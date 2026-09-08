import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdir, readFile, lstat } from "node:fs/promises";
import { basename, extname, join, relative, resolve } from "node:path";

const root = resolve(".");
const output = resolve("out");
const rules = [
  [
    "GitHub credential",
    /\b(?:gh[pousr]_[A-Za-z0-9]{30,255}|github_pat_[A-Za-z0-9_]{40,255})\b/g,
  ],
  [
    "Private key",
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/g,
  ],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ["Google API key", /\bAIza[A-Za-z0-9_-]{35}\b/g],
  ["Stripe live key", /\b[rs]k_live_[A-Za-z0-9]{20,}\b/g],
  ["OpenAI key", /\bsk-(?:proj-|svcacct-)[A-Za-z0-9_-]{30,}\b/g],
  ["Credential in URL", /https?:\/\/[^\s/:'"`<>]+:[^\s@'"`<>]+@/g],
  [
    "Literal secret assignment",
    /\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|database_url)["']?\s*[=:]\s*["'][A-Za-z0-9_+./=:@-]{20,}["']/gi,
  ],
];
const findings = [];
const sensitiveName =
  /(?:token|secret|password|api_?key|private_?key|database_url|credential)/i;
const knownSecrets = new Set();
for (const [name, value] of Object.entries(process.env)) {
  if (name.startsWith("NEXT_PUBLIC_") && sensitiveName.test(name) && value) {
    findings.push({
      file: "process.env",
      issue: "Sensitive public environment variable",
    });
  }
  if (sensitiveName.test(name) && value && value.length >= 8)
    knownSecrets.add(value);
}

// Inspect local env values without writing them to logs, source, or reports.
const envFiles = (await readdir(root)).filter((file) =>
  /^\.env(?:\.|$)/.test(file),
);
for (const file of envFiles) {
  const content = await readFile(join(root, file), "utf8");
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][\w]*)\s*=\s*(.*?)\s*$/,
    );
    if (!match) continue;
    const [, name, raw] = match;
    const value = raw.replace(/^(["'])(.*)\1$/, "$2").trim();
    if (file === ".env.example")
      assert(!value, ".env.example must contain empty placeholders only");
    if (name.startsWith("NEXT_PUBLIC_") && sensitiveName.test(name) && value) {
      findings.push({ file, issue: "Sensitive public environment variable" });
    }
    if (sensitiveName.test(name) && value.length >= 8) {
      knownSecrets.add(value);
    }
  }
}

const gitFiles = (args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  })
    .split("\0")
    .filter(Boolean);
const tracked = gitFiles(["ls-files", "-z"]);
for (const file of tracked) {
  if (/(^|\/)\.env(?:\.|$)/.test(file) && basename(file) !== ".env.example")
    findings.push({ file, issue: "Tracked environment file" });
  if (/\.(?:pem|key|p12|pfx)$/i.test(file))
    findings.push({ file, issue: "Tracked private-key container" });
}
const sourceFiles = [
  ...new Set([
    ...tracked,
    ...gitFiles(["ls-files", "--others", "--exclude-standard", "-z"]),
  ]),
];
const ignoredChecks = [
  ".env",
  ".env.local",
  ".env.production",
  ".env.test.local",
  "security-probe.pem",
  "security-probe.key",
];
for (const file of ignoredChecks) {
  try {
    execFileSync("git", ["check-ignore", "--no-index", "-q", file], {
      cwd: root,
      stdio: "ignore",
    });
  } catch {
    findings.push({ file, issue: "Sensitive file pattern is not ignored" });
  }
}

function inspect(file, buffer, built) {
  const content = buffer.toString("utf8");
  for (const [issue, expression] of rules) {
    expression.lastIndex = 0;
    if (expression.test(content)) findings.push({ file, issue });
  }
  for (const secret of knownSecrets) {
    if (
      content.includes(secret) ||
      content.includes(encodeURIComponent(secret)) ||
      content.includes(Buffer.from(secret).toString("base64"))
    ) {
      findings.push({
        file,
        issue: "Known credential value detected (redacted)",
      });
      break;
    }
  }
  if (
    built &&
    /GITHUB_TOKEN|GH_TOKEN|NEXT_PUBLIC_[A-Z_]*(?:TOKEN|SECRET|KEY)|api\.github\.com/.test(
      content,
    )
  ) {
    findings.push({
      file,
      issue:
        "Build-only GitHub code or sensitive variable name in public output",
    });
  }
}

let sourceCount = 0;
for (const file of sourceFiles) {
  const path = resolve(root, file);
  const info = await lstat(path).catch(() => null);
  if (!info?.isFile()) continue;
  inspect(file, await readFile(path), false);
  sourceCount++;
}

let historyCount = 0;
let commitCount = 0;
if (process.argv.includes("--history")) {
  const commits = execFileSync("git", ["rev-list", "--all", "--reflog"], {
    encoding: "utf8",
  })
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  commitCount = new Set(commits).size;
  const objects = execFileSync(
    "git",
    ["rev-list", "--objects", "--all", "--reflog"],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
  )
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(" ")[0]);
  const types = execFileSync(
    "git",
    ["cat-file", "--batch-check=%(objectname) %(objecttype)"],
    {
      input: objects.join("\n") + "\n",
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    },
  );
  for (const line of types.trim().split("\n")) {
    const [oid, type] = line.split(" ");
    if (type !== "blob") continue;
    inspect(
      `history/blob/${oid.slice(0, 12)}`,
      execFileSync("git", ["cat-file", "blob", oid], {
        maxBuffer: 50 * 1024 * 1024,
      }),
      false,
    );
    historyCount++;
  }
}

const builtFiles = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      findings.push({
        file: relative(root, path),
        issue: "Symbolic link in public output",
      });
      continue;
    }
    if (entry.isDirectory()) await walk(path);
    else builtFiles.push(path);
  }
}
await walk(output);
for (const file of builtFiles) {
  const name = relative(output, file).replaceAll("\\", "/");
  if (
    /(^|\/)(?:\.env(?:\.|$)|\.git(?:\/|$)|node_modules|\.next|\.openai)|\.(?:pem|key|p12|pfx|zip|tar|gz|7z|sql|sqlite|bak|log|map)$/i.test(
      name,
    )
  ) {
    findings.push({
      file: `out/${name}`,
      issue: "Sensitive, debug, archive, or source-map artifact",
    });
  }
  inspect(`out/${name}`, await readFile(file), true);
  if ([".html", ".js", ".json", ".txt"].includes(extname(file))) {
    const content = await readFile(file, "utf8");
    if (
      /[A-Z]:[\\/](?:Users|Windows)[\\/]|\/(?:home|Users)\/[^\s"'<>]+\//.test(
        content,
      )
    )
      findings.push({
        file: `out/${name}`,
        issue: "Local filesystem path in public output",
      });
  }
}

if (findings.length) {
  // File and rule names only. Never include matching content or credential values.
  for (const finding of findings)
    console.error(`${finding.file}: ${finding.issue}`);
  throw new Error(
    `Security scan failed with ${findings.length} finding(s). Values redacted.`,
  );
}
console.log(`SOURCE CODE SECRET SCAN = PASS (${sourceCount} files)`);
if (process.argv.includes("--history"))
  console.log(
    `GIT HISTORY SECRET SCAN = PASS (${commitCount} available commits, ${historyCount} blobs)`,
  );
console.log(
  `BUILD OUTPUT SECRET SCAN = PASS (${builtFiles.length} files, including HTML/JS/RSC/text/assets)`,
);
console.log(
  `Environment ignore rules PASS; ${knownSecrets.size} locally available sensitive value(s) checked without disclosure.`,
);

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Command,
  File,
  FileCode2,
  Folder,
  GitBranch,
  Plus,
} from "lucide-react";
import type { ProjectVisual } from "@/data/projects";

export function ProjectArtwork({
  visual,
  compact = false,
}: {
  visual: ProjectVisual;
  compact?: boolean;
}) {
  return (
    <div
      className={`project-art art-${visual} ${compact ? "art-compact" : ""}`}
      aria-hidden="true"
    >
      {visual === "converter" && (
        <>
          <div className="art-topline">
            <span>
              <span className="tiny-cross">✳</span> fileshift
            </span>
            <span>MAKE THE SHIFT ↗</span>
          </div>
          <div className="converter-headline">
            New format.
            <br />
            <span>Same possibilities.</span>
          </div>
          <div className="file-flow">
            <div className="file-sheet">
              <File size={26} strokeWidth={1.3} />
              <span>.PNG</span>
              <small>THE ORIGINAL</small>
            </div>
            <span className="flow-arrow">
              <ArrowRight />
            </span>
            <div className="file-sheet file-output">
              <File size={26} strokeWidth={1.3} />
              <span>.WEBP</span>
              <small>THE NEXT CHAPTER</small>
            </div>
          </div>
          <div className="conversion-bar">
            <span>
              <span className="status-dot" /> Ready when you are.
            </span>
            <span>
              Convert files <ArrowUpRight size={13} />
            </span>
          </div>
          <div className="art-bottomline">
            <span>LESS FRICTION. MORE FLOW.</span>
            <span>001—∞</span>
          </div>
        </>
      )}
      {visual === "readme" && (
        <>
          <div className="art-topline">
            <span>README.studio®</span>
            <span>YOUR REPO, INTRODUCED.</span>
          </div>
          <div className="readme-headline">
            First
            <br />
            impressions
            <br />
            <em>matter.</em>
            <span className="readme-asterisk">✳</span>
          </div>
          <div className="readme-editor">
            <div className="editor-dots">
              <i />
              <i />
              <i />
              <span>README.md</span>
            </div>
            <p>
              <span>01</span> # Something worth building
            </p>
            <p>
              <span>02</span> A better way to document.
            </p>
            <p>
              <span>03</span> <b>→</b> Make yourself understood.
            </p>
          </div>
          <div className="art-bottomline">
            <span>WRITE IT WELL.</span>
            <ArrowUpRight size={20} />
          </div>
        </>
      )}
      {visual === "automation" && (
        <>
          <div className="art-topline">
            <span>
              <Command size={15} /> autopilot
            </span>
            <span>
              SYSTEM / ONLINE <i className="status-dot" />
            </span>
          </div>
          <div className="automation-headline">
            Your workflow.
            <br />
            <em>On autopilot.</em>
          </div>
          <div className="terminal">
            <div className="terminal-title">
              <span>~/projects/next-big-thing</span>
              <span>− &nbsp; +</span>
            </div>
            <p>
              <b>→</b> autopilot run ship
            </p>
            <p className="terminal-muted">
              Initializing a little less busywork...
            </p>
            <p>
              <Check size={13} /> Code quality checked <span>0.8s</span>
            </p>
            <p>
              <Check size={13} /> Production build ready <span>2.4s</span>
            </p>
            <p>
              <Check size={13} /> All systems go <span>✓</span>
            </p>
            <p className="terminal-result">
              3 tasks. One command. <span className="terminal-caret" />
            </p>
          </div>
          <div className="art-bottomline">
            <span>BUILD. AUTOMATE. REPEAT.</span>
            <GitBranch size={19} />
          </div>
        </>
      )}
      {visual === "fullstack" && (
        <>
          <div className="art-topline">
            <span>
              common ground<span className="brand-period">●</span>
            </span>
            <span>A SPACE TO MAKE THINGS.</span>
          </div>
          <div className="workspace">
            <aside>
              <span className="workspace-brand">cg.</span>
              <span>
                <Folder size={12} /> Workspace
              </span>
              <span>
                <FileCode2 size={12} /> Projects
              </span>
              <span>
                <GitBranch size={12} /> Activity
              </span>
              <span className="workspace-bottom">Your next big thing. ↗</span>
            </aside>
            <div className="workspace-main">
              <div className="workspace-heading">
                Room for good ideas.
                <Plus size={16} />
              </div>
              <div className="workspace-tabs">
                All projects <span>In progress</span>
                <span>Completed</span>
              </div>
              <div className="workspace-project">
                <span className="workspace-symbol">↗</span>
                <div>
                  A fresh perspective<small>Design exploration</small>
                </div>
                <span>01</span>
              </div>
              <div className="workspace-project">
                <span className="workspace-symbol lilac">✳</span>
                <div>
                  The next chapter<small>Product development</small>
                </div>
                <span>02</span>
              </div>
              <div className="workspace-progress">
                <span>Small steps. Real progress.</span>
                <div>
                  <i />
                </div>
              </div>
            </div>
          </div>
          <div className="art-bottomline">
            <span>IDEAS GROW BETTER TOGETHER.</span>
            <span>EST. 2026</span>
          </div>
        </>
      )}
      {visual === "experimental" && (
        <>
          <div className="art-topline">
            <span>THE SANDBOX</span>
            <span>EXPERIMENT NO. 005</span>
          </div>
          <div className="sandbox-layout">
            <div className="sandbox-headline">
              What
              <br />
              <em>if?</em>
              <span className="sandbox-caption">
                A playground for the possibilities.
              </span>
            </div>
            <div className="orbit-object">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <i>+</i>
            </div>
          </div>
          <div className="art-bottomline">
            <span>PLAY IS PART OF THE PROCESS.</span>
            <ArrowDown size={20} />
          </div>
        </>
      )}
    </div>
  );
}

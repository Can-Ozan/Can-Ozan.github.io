"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Search, X } from "lucide-react";
import { chapters, siteConfig } from "@/data/siteConfig";
import { useCopyEmail } from "@/hooks/useCopyEmail";
import { PROJECT_DIALOG_CHANGE } from "@/lib/modal-events";
import {
  isTypingTarget,
  navigateToChapter,
  trapDialogFocus,
} from "@/lib/interactions";

const commands = [
  ...chapters.slice(1).map((chapter) => ({
    id: chapter.id,
    label:
      chapter.id === "work"
        ? "Selected Work"
        : chapter.id === "tools"
          ? "Tech Stack"
          : chapter.label,
    group: "Navigate",
    type: "navigate" as const,
    value: chapter.id,
  })),
  {
    id: "open-github",
    label: "Open GitHub",
    group: "Actions",
    type: "external" as const,
    value: siteConfig.socials.github,
  },
  {
    id: "copy-email",
    label: "Copy Email",
    group: "Actions",
    type: "copy" as const,
    value: siteConfig.email,
  },
  ...(siteConfig.sourceUrl
    ? [
        {
          id: "source",
          label: "View Source",
          group: "Actions",
          type: "external" as const,
          value: siteConfig.sourceUrl,
        },
      ]
    : []),
  {
    id: "go-top",
    label: "Go to Top",
    group: "Actions",
    type: "navigate" as const,
    value: "top",
  },
];
type Command = (typeof commands)[number];

export function CommandPalette() {
  const [opened, setOpened] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [shortcuts, setShortcuts] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const restoreFocus = useRef(true);
  const { status, copy } = useCopyEmail();
  const results = commands.filter((command) =>
    `${command.label} ${command.group}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const selected = results[Math.min(active, Math.max(0, results.length - 1))];
  useEffect(() => {
    if (opened && selected)
      document
        .getElementById(`command-${selected.id}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [opened, selected]);
  const open = useCallback(() => {
    if (document.querySelector("dialog[open]")) return;
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    restoreFocus.current = true;
    setQuery("");
    setActive(0);
    setOpened(true);
  }, []);
  const close = useCallback((restore = true) => {
    restoreFocus.current = restore;
    dialog.current?.close();
    document.dispatchEvent(new Event(PROJECT_DIALOG_CHANGE));
    setOpened(false);
  }, []);
  const run = (command: Command) => {
    if (command.type === "copy") {
      void copy();
      return;
    }
    if (command.type === "external") {
      window.open(command.value, "_blank", "noopener,noreferrer");
      close();
    } else {
      close(false);
      requestAnimationFrame(() => navigateToChapter(command.value));
    }
  };

  useLayoutEffect(() => {
    if (!opened || !dialog.current) return;
    const node = dialog.current;
    node.showModal();
    document.dispatchEvent(new Event(PROJECT_DIALOG_CHANGE));
    input.current?.focus({ preventScroll: true });
    const trap = (event: KeyboardEvent) => trapDialogFocus(event, node);
    document.addEventListener("keydown", trap);
    return () => {
      node.close();
      document.removeEventListener("keydown", trap);
      document.dispatchEvent(new Event(PROJECT_DIALOG_CHANGE));
      if (restoreFocus.current && returnFocus.current?.isConnected)
        returnFocus.current.focus({ preventScroll: true });
    };
  }, [opened]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.isComposing || event.repeat) return;
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k" &&
        !event.altKey
      ) {
        if (!opened && isTypingTarget(event.target)) return;
        if (!opened && document.querySelector("dialog[open]")) return;
        event.preventDefault();
        if (opened) close();
        else open();
        return;
      }
      if (
        opened ||
        !shortcuts ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        isTypingTarget(event.target) ||
        document.querySelector("dialog[open]")
      )
        return;
      const key = event.key.toLowerCase();
      const destinations: Record<string, string> = {
        w: "work",
        a: "about",
        c: "contact",
      };
      if (destinations[key]) {
        event.preventDefault();
        navigateToChapter(destinations[key]);
      }
      if (key === "g") {
        event.preventDefault();
        window.open(siteConfig.socials.github, "_blank", "noopener,noreferrer");
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [open, close, opened, shortcuts]);

  return (
    <>
      <button
        className="command-trigger"
        onClick={open}
        aria-label="Open command palette"
        aria-keyshortcuts="Control+k Meta+k"
        aria-haspopup="dialog"
        data-cursor="OPEN"
      >
        <span>COMMANDS</span>
        <kbd>⌘ / Ctrl K</kbd>
        <Search size={17} />
      </button>
      {opened &&
        createPortal(
          <dialog
            ref={dialog}
            className="command-dialog"
            aria-labelledby="command-title"
            data-lenis-prevent
            onCancel={(event) => {
              event.preventDefault();
              close();
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <div className="command-sheet">
              <div className="command-heading">
                <div>
                  <span className="eyebrow">CAN—OZAN / INDEX</span>
                  <h2 id="command-title">
                    Where to<span>?</span>
                  </h2>
                </div>
                <button
                  className="dialog-close"
                  onClick={() => close()}
                  aria-label="Close command palette"
                  data-cursor="CLOSE"
                >
                  <X size={23} />
                </button>
              </div>
              <div className="command-search">
                <Search size={20} />
                <input
                  ref={input}
                  type="search"
                  role="combobox"
                  aria-label="Search commands"
                  aria-expanded="true"
                  aria-controls="command-results"
                  aria-autocomplete="list"
                  aria-activedescendant={
                    selected ? `command-${selected.id}` : undefined
                  }
                  placeholder="Type a place or an action…"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.nativeEvent.isComposing ||
                      (event.key === "Enter" && event.repeat)
                    )
                      return;
                    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                      event.preventDefault();
                      if (results.length)
                        setActive(
                          (value) =>
                            (value +
                              (event.key === "ArrowDown" ? 1 : -1) +
                              results.length) %
                            results.length,
                        );
                    }
                    if (event.key === "Enter" && selected) {
                      event.preventDefault();
                      run(selected);
                    }
                  }}
                />
                <kbd>↵</kbd>
              </div>
              <div
                id="command-results"
                role="listbox"
                aria-label="Commands"
                className="command-results"
              >
                {results.map((command, index) => (
                  <div key={command.id} role="presentation">
                    {(index === 0 ||
                      results[index - 1].group !== command.group) && (
                      <p className="command-group" role="presentation">
                        {command.group}
                      </p>
                    )}
                    <button
                      id={`command-${command.id}`}
                      role="option"
                      aria-selected={selected?.id === command.id}
                      tabIndex={-1}
                      className="command-option"
                      onPointerMove={() => {
                        if (active !== index) setActive(index);
                      }}
                      onClick={() => run(command)}
                      data-cursor={command.type === "copy" ? "COPY" : "OPEN"}
                    >
                      <span>
                        {command.type === "copy" && status === "copied"
                          ? "Copied ✓"
                          : command.label}
                      </span>
                      <span>
                        {command.type === "external" ? (
                          <ArrowUpRight size={18} />
                        ) : (
                          String(index + 1).padStart(2, "0")
                        )}
                      </span>
                    </button>
                  </div>
                ))}
                {!results.length && (
                  <p className="command-empty" role="presentation">
                    No matches. Try “work” or “email”.
                  </p>
                )}
              </div>
              <span role="status" className="sr-only">
                {status === "copied"
                  ? "Email address copied."
                  : `${results.length} commands available.`}
              </span>
              {status === "manual" && (
                <label className="copy-fallback">
                  Select and copy the email address
                  <input
                    readOnly
                    aria-label="Email address to copy"
                    value={siteConfig.email}
                    onFocus={(event) => event.currentTarget.select()}
                  />
                </label>
              )}
              <div className="command-footer">
                <span>↑ ↓ EXPLORE · ENTER OPEN · ESC CLOSE</span>
                <label>
                  <input
                    type="checkbox"
                    checked={shortcuts}
                    onChange={(event) => setShortcuts(event.target.checked)}
                  />{" "}
                  ENABLE G / W / A / C SHORTCUTS
                </label>
                <span className="shortcut-legend">
                  GitHub / Work / About / Contact
                </span>
              </div>
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
}

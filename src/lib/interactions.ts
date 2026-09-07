export const NAVIGATE_CHAPTER = "portfolio:navigate-chapter";

export function isTypingTarget(target: EventTarget | null) {
  return target instanceof Element && !!target.closest(
    "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox']",
  );
}

export function trapDialogFocus(event: KeyboardEvent, dialog: HTMLDialogElement) {
  if (event.key !== "Tab") return;
  const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
    "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex='0']",
  )).filter((element) => element.getClientRects().length > 0 && !element.closest("[hidden]"));
  const first = controls[0];
  const last = controls.at(-1);
  const active = document.activeElement;
  if (event.shiftKey && last && (active === first || !dialog.contains(active))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && first && (active === last || !dialog.contains(active))) {
    event.preventDefault(); first.focus();
  }
}

export function navigateToChapter(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const event = new CustomEvent(NAVIGATE_CHAPTER, { cancelable: true, detail: { id } });
  if (document.dispatchEvent(event)) {
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  history.replaceState(null, "", `#${id}`);
  const heading = target.querySelector<HTMLElement>("h1, h2") ?? target;
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { PROJECT_DIALOG_CHANGE } from "./modal-events";

const EASE = "power3.out";
const REVEAL_DISTANCE = 42;

export function initializeAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();

  media.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 901px) and (hover: hover) and (pointer: fine)",
    },
    (context) => {
      const { motion, desktop } = context.conditions ?? {};
      if (!motion) return;

      const lenis = desktop
        ? new Lenis({
            autoRaf: false,
            duration: 1.05,
            smoothWheel: true,
            anchors: true,
            stopInertiaOnNavigate: true,
          })
        : null;
      const ticker = (time: number) => lenis?.raf(time * 1000);
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
      }

      const syncDialog = () => {
        if (document.querySelector("dialog[open]")) lenis?.stop();
        else lenis?.start();
      };
      document.addEventListener(PROJECT_DIALOG_CHANGE, syncDialog);
      syncDialog();

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: desktop ? REVEAL_DISTANCE : 18,
          opacity: 0,
          duration: 0.8,
          ease: EASE,
          scrollTrigger: { trigger: element, start: "top 94%", once: true },
        });
      });

      const cleanups: (() => void)[] = [];
      if (desktop) {
        const transition = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom 12%",
            scrub: 0.8,
          },
        });
        transition
          .to(
            ".hero",
            { backgroundColor: "#191916", color: "#f0eee6", ease: "none" },
            0,
          )
          .to(
            ".hero-title",
            { y: 80, scale: 0.96, opacity: 0.15, ease: "none" },
            0,
          );
        const posters = [
          {
            selector: ".poster-left",
            values: { x: -85, y: -100, rotation: -22 },
          },
          {
            selector: ".poster-right",
            values: { x: 90, y: -65, rotation: 22 },
          },
          {
            selector: ".poster-center",
            values: { y: -95, scale: 0.9, rotation: 3 },
          },
        ];
        for (const { selector, values } of posters) {
          const poster = document.querySelector(selector);
          if (poster) transition.to(poster, { ...values, ease: "none" }, 0);
        }

        const stage = document.querySelector<HTMLElement>(".hero-stage");
        if (stage) {
          const tilts = gsap.utils
            .toArray<HTMLElement>(".poster-tilt")
            .map((element, index) => ({
              rotateX: gsap.quickTo(element, "rotationX", {
                duration: 0.7,
                ease: EASE,
              }),
              rotateY: gsap.quickTo(element, "rotationY", {
                duration: 0.7,
                ease: EASE,
              }),
              x: gsap.quickTo(element, "x", { duration: 0.7, ease: EASE }),
              y: gsap.quickTo(element, "y", { duration: 0.7, ease: EASE }),
              depth: (index + 1) * 0.4,
            }));
          const move = (event: PointerEvent) => {
            const bounds = stage.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            tilts.forEach((tilt) => {
              tilt.rotateX(-y * 5 * tilt.depth);
              tilt.rotateY(x * 6 * tilt.depth);
              tilt.x(x * 12 * tilt.depth);
              tilt.y(y * 8 * tilt.depth);
            });
          };
          const leave = () =>
            tilts.forEach((tilt) => {
              tilt.rotateX(0);
              tilt.rotateY(0);
              tilt.x(0);
              tilt.y(0);
            });
          stage.addEventListener("pointermove", move, { passive: true });
          stage.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            stage.removeEventListener("pointermove", move);
            stage.removeEventListener("pointerleave", leave);
          });
        }
      }

      // Refresh after self-hosted fonts settle without taking over browser scroll restoration.
      gsap.from(".manifesto-line > span", {
        yPercent: 105,
        duration: 0.85,
        stagger: 0.12,
        ease: EASE,
        scrollTrigger: { trigger: ".manifesto", start: "top 86%", once: true },
      });
      let alive = true;
      void document.fonts.ready.then(() => {
        if (alive) ScrollTrigger.refresh();
      });
      const restore = () => {
        ScrollTrigger.refresh();
        lenis?.resize();
      };
      window.addEventListener("pageshow", restore);
      return () => {
        alive = false;
        cleanups.forEach((cleanup) => cleanup());
        window.removeEventListener("pageshow", restore);
        document.removeEventListener(PROJECT_DIALOG_CHANGE, syncDialog);
        gsap.ticker.remove(ticker);
        lenis?.destroy();
      };
    },
  );

  return () => media.revert();
}

"use client";

import { useEffect } from "react";

const GLYPHS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+<>/\\=_?";

function scramble(el: HTMLElement) {
  const final = el.dataset.text ?? el.textContent ?? "";
  el.dataset.text = final;
  if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", final);
  const duration = Number(el.dataset.scrambleMs ?? 1100);
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    let out = "";
    for (let i = 0; i < final.length; i++) {
      const ch = final[i];
      if (ch === " " || p > i / final.length + 0.12) out += ch;
      else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  };
  requestAnimationFrame(tick);
}

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const start = performance.now();
  const duration = 1400;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = String(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * Page-wide motion: reveal on scroll, decode-in headings, count-up numbers,
 * pointer-following light on panels, gentle 3D tilt and a cursor glow.
 * Content is fully visible without JavaScript and with reduced motion.
 */
export default function Effects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    // Stagger children of [data-stagger] containers.
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        const el = child as HTMLElement;
        el.setAttribute("data-reveal", "");
        el.style.setProperty("--i", String(Math.min(i, 8)));
      });
    });

    if (reduce) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    root.classList.add("fx-ready");

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          const el = entry.target as HTMLElement;
          el.classList.add("is-visible");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          if (el.matches("[data-count]")) countUp(el);
          el.querySelectorAll<HTMLElement>("[data-scramble]").forEach(scramble);
          if (el.matches("[data-scramble]")) scramble(el);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    document.querySelectorAll("[data-reveal], [data-scramble], [data-count]").forEach((el) => io.observe(el));

    // Pointer light on panels and tilt on marked elements.
    let glow: HTMLDivElement | null = null;
    if (finePointer) {
      glow = document.createElement("div");
      glow.className = "cursor-glow";
      glow.setAttribute("aria-hidden", "true");
      document.body.appendChild(glow);
    }
    let raf = 0;
    let lastEvent: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      const e = lastEvent;
      if (!e) return;
      if (glow) glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const target = e.target instanceof Element ? e.target : null;
      const spot = target?.closest<HTMLElement>(".spot");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      const tilt = target?.closest<HTMLElement>("[data-tilt]");
      if (tilt && finePointer) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--ry", `${px * 8}deg`);
        tilt.style.setProperty("--rx", `${-py * 8}deg`);
      }
    };
    const onMove = (e: PointerEvent) => {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (el?.matches?.("[data-tilt]")) {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onLeave, true);

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave, true);
      glow?.remove();
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

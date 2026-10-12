"use client";

import { useEffect, useRef } from "react";

const CHARS = "01アイウエオカキクケコ0110<>/{}#$%ABCDEF0123456789";

/** Subtle falling-glyph backdrop. Pauses off screen; nothing drawn with reduced motion. */
export default function DataRain({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const size = 16;
    let w = 0;
    let h = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let raf = 0;
    let running = false;
    let last = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.ceil((w / size) * density);
      drops = Array.from({ length: cols }, () => Math.random() * -h);
      speeds = Array.from({ length: cols }, () => 0.6 + Math.random() * 1.4);
      ctx.clearRect(0, 0, w, h);
    };

    const step = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(step);
      if (now - last < 50) return;
      last = now;
      ctx.fillStyle = "rgba(5,7,13,0.16)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size - 3}px "JetBrains Mono", monospace`;
      const gap = w / drops.length;
      for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[(Math.random() * CHARS.length) | 0];
        const y = drops[i];
        ctx.fillStyle = Math.random() < 0.06 ? "rgba(225,255,255,0.9)" : i % 5 === 0 ? "rgba(155,107,255,0.55)" : "rgba(62,242,255,0.5)";
        ctx.fillText(ch, i * gap, y);
        drops[i] = y > h + 40 && Math.random() > 0.97 ? Math.random() * -60 : y + size * speeds[i] * 0.5;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return <canvas ref={ref} className="data-rain" aria-hidden="true" />;
}

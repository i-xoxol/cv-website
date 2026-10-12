"use client";

import { useEffect, useRef } from "react";

type Vec = [number, number, number];

interface Arc {
  a: Vec;
  b: Vec;
  t: number;
  speed: number;
  rgb: string;
  threat: boolean;
  arrived: number;
}

const CYAN = "62,242,255";
const VIOLET = "155,107,255";
const RED = "255,77,109";

/**
 * A rotating point-cloud globe with traffic arcs: most packets arrive (cyan,
 * violet), some are flagged as threats (red) and get intercepted with a burst.
 * Renders a single still frame when the visitor prefers reduced motion.
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 760;
    const N = small ? 1100 : 2600;

    // Even distribution of points on a sphere.
    const pts: Vec[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    // Brighter "continents" from a cheap smooth field, so the globe has texture.
    const glow = pts.map(([x, y, z]) => {
      const v = Math.sin(x * 3.3 + 1.1) * Math.cos(y * 2.6 - 0.5) + Math.sin(z * 4.1 + y * 1.7) * 0.55;
      return v > 0.1 ? 1 : 0.45;
    });

    let w = 0;
    let h = 0;
    let R = 0;
    let cx = 0;
    let cy = 0;
    let rot = 0.6;
    let tiltX = -0.32;
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;
    let running = false;
    let raf = 0;
    let lastSpawn = 0;
    const arcs: Arc[] = [];

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w, h) * (small ? 0.42 : 0.4);
      cx = w * (small ? 0.62 : 0.66);
      cy = h * (small ? 0.62 : 0.44);
    }

    function project(p: Vec): [number, number, number] {
      const ry = rot + pointerX * 0.25;
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = p[0] * cosY + p[2] * sinY;
      const z1 = -p[0] * sinY + p[2] * cosY;
      const tx = tiltX + pointerY * 0.15;
      const cosT = Math.cos(tx);
      const sinT = Math.sin(tx);
      const y1 = p[1] * cosT - z1 * sinT;
      const z2 = p[1] * sinT + z1 * cosT;
      return [cx + x1 * R, cy + y1 * R, z2];
    }

    function along(a: Vec, b: Vec, t: number): Vec {
      const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      const om = Math.acos(dot);
      const s = Math.sin(om) || 1;
      const k1 = Math.sin((1 - t) * om) / s;
      const k2 = Math.sin(t * om) / s;
      const lift = 1 + 0.28 * Math.sin(Math.PI * t) * (om / Math.PI + 0.4);
      return [(a[0] * k1 + b[0] * k2) * lift, (a[1] * k1 + b[1] * k2) * lift, (a[2] * k1 + b[2] * k2) * lift];
    }

    function spawn(t0 = 0) {
      const a = pts[(Math.random() * N) | 0];
      let b = pts[(Math.random() * N) | 0];
      for (let i = 0; i < 6 && a[0] * b[0] + a[1] * b[1] + a[2] * b[2] > 0.6; i++) b = pts[(Math.random() * N) | 0];
      const threat = Math.random() < 0.22;
      arcs.push({
        a,
        b,
        t: t0,
        speed: 0.006 + Math.random() * 0.008,
        rgb: threat ? RED : Math.random() < 0.6 ? CYAN : VIOLET,
        threat,
        arrived: 0,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // Atmosphere
      const atm = ctx!.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.55);
      atm.addColorStop(0, "rgba(62,242,255,0.10)");
      atm.addColorStop(0.5, "rgba(155,107,255,0.06)");
      atm.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = atm;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R * 1.55, 0, Math.PI * 2);
      ctx!.fill();

      // Orbit rings
      ctx!.save();
      ctx!.translate(cx, cy);
      for (let i = 0; i < 2; i++) {
        ctx!.save();
        ctx!.rotate(-0.42 + i * 0.95);
        ctx!.scale(1, 0.26);
        ctx!.strokeStyle = i ? "rgba(155,107,255,0.22)" : "rgba(62,242,255,0.22)";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(0, 0, R * (1.32 + i * 0.16), 0, Math.PI * 2);
        ctx!.stroke();
        const ang = frame * (0.006 + i * 0.004) + i * 2;
        ctx!.fillStyle = i ? "rgba(155,107,255,0.95)" : "rgba(62,242,255,0.95)";
        ctx!.beginPath();
        ctx!.arc(Math.cos(ang) * R * (1.32 + i * 0.16), Math.sin(ang) * R * (1.32 + i * 0.16), 3.2, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
      ctx!.restore();

      // Graticule: latitude and longitude lines give the sphere its shape.
      ctx!.lineWidth = 1;
      const drawLine = (fn: (k: number) => Vec) => {
        let prev: [number, number, number] | null = null;
        for (let k = 0; k <= 64; k++) {
          const p = project(fn(k / 64));
          if (prev && (p[2] > 0 || prev[2] > 0)) {
            const z = Math.max(p[2], prev[2]);
            ctx!.strokeStyle = `rgba(62,242,255,${0.05 + 0.16 * z})`;
            ctx!.beginPath();
            ctx!.moveTo(prev[0], prev[1]);
            ctx!.lineTo(p[0], p[1]);
            ctx!.stroke();
          }
          prev = p;
        }
      };
      for (let m = 0; m < 12; m++) {
        const lon = (m / 12) * Math.PI * 2;
        drawLine((k) => {
          const lat = -Math.PI / 2 + k * Math.PI;
          return [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)];
        });
      }
      for (let l = 1; l < 8; l++) {
        const lat = -Math.PI / 2 + (l / 8) * Math.PI;
        drawLine((k) => {
          const lon = k * Math.PI * 2;
          return [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)];
        });
      }

      // Globe points, back to front
      for (let i = 0; i < N; i++) {
        const [x, y, z] = project(pts[i]);
        const front = z > 0;
        const a = front ? 0.35 + 0.65 * z * glow[i] : 0.1 * glow[i];
        const size = front ? 1.2 + 1.6 * z * glow[i] : 0.9;
        ctx!.fillStyle = glow[i] > 0.5 ? `rgba(110,245,255,${a})` : `rgba(150,140,255,${a * 0.8})`;
        ctx!.fillRect(x - size / 2, y - size / 2, size, size);
      }

      // Rim
      const rim = ctx!.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      rim.addColorStop(0, "rgba(62,242,255,0.55)");
      rim.addColorStop(1, "rgba(155,107,255,0.35)");
      ctx!.strokeStyle = rim;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.stroke();

      // Traffic arcs
      ctx!.lineCap = "round";
      for (const arc of arcs) {
        const head = Math.min(arc.t, 1);
        const tail = Math.max(0, head - 0.35);
        const steps = 26;
        let prev: [number, number, number] | null = null;
        for (let s = 0; s <= steps; s++) {
          const tt = tail + ((head - tail) * s) / steps;
          const p = project(along(arc.a, arc.b, tt));
          if (prev) {
            const vis = p[2] > -0.15 ? 1 : 0.25;
            const alpha = (s / steps) * 0.9 * vis * (arc.arrived ? Math.max(0, 1 - arc.arrived / 30) : 1);
            ctx!.strokeStyle = `rgba(${arc.rgb},${alpha})`;
            ctx!.lineWidth = 1.2 + (s / steps) * 2;
            ctx!.beginPath();
            ctx!.moveTo(prev[0], prev[1]);
            ctx!.lineTo(p[0], p[1]);
            ctx!.stroke();
          }
          prev = p;
        }
        if (!arc.arrived && prev) {
          ctx!.fillStyle = `rgba(${arc.rgb},1)`;
          ctx!.shadowColor = `rgba(${arc.rgb},0.9)`;
          ctx!.shadowBlur = 12;
          ctx!.beginPath();
          ctx!.arc(prev[0], prev[1], 3.2, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.shadowBlur = 0;
        }
        // Threats are stopped before they land; others land with a soft ping.
        const stopAt = arc.threat ? 0.82 : 1;
        if (arc.t >= stopAt && !arc.arrived) arc.arrived = 1;
        if (arc.arrived) {
          const p = project(along(arc.a, arc.b, stopAt));
          const k = arc.arrived / 30;
          ctx!.strokeStyle = `rgba(${arc.rgb},${Math.max(0, 1 - k)})`;
          ctx!.lineWidth = arc.threat ? 2 : 1.2;
          ctx!.beginPath();
          ctx!.arc(p[0], p[1], 3 + k * (arc.threat ? 26 : 14), 0, Math.PI * 2);
          ctx!.stroke();
          if (arc.threat && k < 0.6) {
            ctx!.strokeStyle = `rgba(${RED},${0.9 - k})`;
            ctx!.beginPath();
            ctx!.moveTo(p[0] - 6, p[1] - 6);
            ctx!.lineTo(p[0] + 6, p[1] + 6);
            ctx!.moveTo(p[0] + 6, p[1] - 6);
            ctx!.lineTo(p[0] - 6, p[1] + 6);
            ctx!.stroke();
          }
        }
      }
    }

    function step(now: number) {
      if (!running) return;
      frame++;
      rot += 0.0016;
      if (now - lastSpawn > (small ? 420 : 240) && arcs.length < (small ? 12 : 22)) {
        spawn();
        lastSpawn = now;
      }
      for (const arc of arcs) {
        if (arc.arrived) arc.arrived++;
        else arc.t += arc.speed;
      }
      for (let i = arcs.length - 1; i >= 0; i--) if (arcs[i].arrived > 30) arcs.splice(i, 1);
      draw();
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    if (reduce) {
      for (let i = 0; i < 8; i++) spawn(0.35 + Math.random() * 0.4);
      draw();
    } else {
      for (let i = 0; i < 6; i++) spawn(Math.random() * 0.8);
      start();
    }

    const onResize = () => {
      resize();
      if (reduce) draw();
    };
    const onPointer = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}

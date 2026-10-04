import { useEffect, useRef } from "react";
import { useReducedMotion } from "./shared/motion";

/* ================================================================
   WEB AUDIO API HARMONIC SYNTHESIZER (OPTIONAL / USER-TRIGGERED)
   ================================================================ */

let sharedAudioCtx: AudioContext | null = null;

export function playHarmonicTone(freq: number, m: number, n: number) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!sharedAudioCtx) sharedAudioCtx = new Ctx();
    const ctx = sharedAudioCtx;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 4.5, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 1.6);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.11, now + 0.04);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.85);

    filter.connect(master);
    master.connect(ctx.destination);

    // Fundamental + Chladni modal overtones
    const ratios = [1, n / m, 2];
    ratios.forEach((r, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq * r, now);
      g.gain.setValueAtTime(i === 0 ? 0.65 : 0.2 / i, now);
      osc.connect(g);
      g.connect(filter);
      osc.start(now);
      osc.stop(now + 1.9);
    });
  } catch {
    /* ignore audio context restrictions */
  }
}

/* ================================================================
   REAL-TIME CHLADNI CYMATICS STANDING-WAVE PARTICLE ENGINE
   ================================================================ */

export function CymaticsCanvas({
  m,
  n,
  freq,
}: {
  m: number;
  n: number;
  freq: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({ m, n, freq });
  paramsRef.current = { m, n, freq };
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = canvas.clientWidth || 640;
    let h = canvas.clientHeight || 640;

    const resize = () => {
      w = canvas.clientWidth || 640;
      h = canvas.clientHeight || 640;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Create 2,200 resonant particles in normalized [-1, 1] plate coordinates
    const COUNT = reduced ? 900 : 2200;
    const px = new Float32Array(COUNT);
    const py = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      px[i] = (Math.random() * 2 - 1) * 0.96;
      py[i] = (Math.random() * 2 - 1) * 0.96;
    }

    const pointer = { x: 0, y: 0, active: false };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    // Chladni potential function: zero along standing-wave nodal lines
    const chladni = (x: number, y: number, cm: number, cn: number) =>
      Math.cos(cn * Math.PI * x * 0.5) * Math.cos(cm * Math.PI * y * 0.5) -
      Math.cos(cm * Math.PI * x * 0.5) * Math.cos(cn * Math.PI * y * 0.5);

    let sm = m;
    let sn = n;
    let raf = 0;

    const stepFrame = () => {
      const targetM = paramsRef.current.m;
      const targetN = paramsRef.current.n;
      sm += (targetM - sm) * 0.08;
      sn += (targetN - sn) * 0.08;

      // Phosphor persistence trail
      ctx.fillStyle = "rgba(12, 13, 16, 0.26)";
      ctx.fillRect(0, 0, w, h);

      // Subtle calibration crosshairs
      ctx.strokeStyle = "rgba(230, 228, 222, 0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, 0);
      ctx.lineTo(w * 0.5, h);
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(w, h * 0.5);
      ctx.stroke();

      const eps = 0.008;
      for (let i = 0; i < COUNT; i++) {
        let x = px[i];
        let y = py[i];

        const val = chladni(x, y, sm, sn);
        const absV = Math.abs(val);

        // Gradient descent toward nodal line |val| -> 0
        const gx = (Math.abs(chladni(x + eps, y, sm, sn)) - absV) / eps;
        const gy = (Math.abs(chladni(x, y + eps, sm, sn)) - absV) / eps;

        // Thermal / acoustic agitation proportional to displacement
        const jitter = absV * 0.028 + 0.0012;
        x -= gx * 0.012 + (Math.random() - 0.5) * jitter;
        y -= gy * 0.012 + (Math.random() - 0.5) * jitter;

        // Pointer acoustic repulsion probe
        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.09 && d2 > 0.0001) {
            const push = (0.09 - d2) * 0.18;
            x += (dx / Math.sqrt(d2)) * push;
            y += (dy / Math.sqrt(d2)) * push;
          }
        }

        // Keep inside resonant plate
        if (x < -0.96 || x > 0.96) x = (Math.random() * 2 - 1) * 0.94;
        if (y < -0.96 || y > 0.96) y = (Math.random() * 2 - 1) * 0.94;

        px[i] = x;
        py[i] = y;

        const sx = (x * 0.5 + 0.5) * w;
        const sy = (y * 0.5 + 0.5) * h;

        // Particles settled on the node glow phosphor-orange/ivory
        ctx.fillStyle = absV < 0.08 ? (i % 5 === 0 ? "#ff5500" : "#e6e4de") : "rgba(255, 176, 32, 0.45)";
        ctx.fillRect(sx, sy, 1.7, 1.7);
      }

      if (!reduced) {
        raf = requestAnimationFrame(stepFrame);
      }
    };

    if (reduced) {
      for (let k = 0; k < 45; k++) stepFrame();
    } else {
      raf = requestAnimationFrame(stepFrame);
    }

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, m, n]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}

/* ================================================================
   INDUSTRIAL HARDWARE TECHNICAL SCHEMATICS (RAMS / TE STYLE)
   ================================================================ */

export function HardwareSchematic({ kind }: { kind: "synth" | "monolith" | "reel" | "mic" }) {
  return (
    <svg viewBox="0 0 640 420" className="block h-full w-full select-none" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <rect width="640" height="420" fill="#121317" />
      {/* Subtle millimeter grid */}
      <g stroke="#e6e4de" strokeOpacity="0.06" strokeWidth="1">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="420" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={i * 40} x2="640" y2={i * 40} />
        ))}
      </g>

      {kind === "synth" && (
        <g stroke="#e6e4de" fill="none">
          {/* CNC chassis outline */}
          <rect x="70" y="75" width="500" height="260" rx="10" fill="#1a1c22" strokeWidth="1.5" />
          {/* OLED scope window */}
          <rect x="96" y="100" width="190" height="84" rx="4" fill="#0b0c0e" stroke="#ff5500" strokeWidth="1.2" />
          <path
            d="M 108 142 Q 130 108, 152 142 T 196 142 T 240 142 T 276 142"
            stroke="#ff5500"
            strokeWidth="1.6"
          />
          {/* 4 Machined rotary encoders */}
          {[328, 384, 440, 496].map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy="142" r="21" fill="#121317" strokeWidth="1.4" />
              <circle cx={cx} cy="142" r="14" stroke={i === 0 ? "#ff5500" : "#e6e4de"} strokeOpacity="0.65" strokeWidth="1" />
              <line x1={cx} y1="142" x2={cx + (i - 1) * 7} y2="128" stroke="#ff5500" strokeWidth="1.6" />
            </g>
          ))}
          {/* Precision keybed modules */}
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={i}
              x={96 + i * 32}
              y="210"
              width="27"
              height="102"
              rx="3"
              fill={i === 4 || i === 9 ? "#ff5500" : "#22252c"}
              fillOpacity={i === 4 || i === 9 ? "0.2" : "1"}
              stroke={i === 4 || i === 9 ? "#ff5500" : "#e6e4de"}
              strokeOpacity="0.65"
              strokeWidth="1"
            />
          ))}
        </g>
      )}

      {kind === "monolith" && (
        <g stroke="#e6e4de" fill="none">
          {/* Acoustic wavefront rings */}
          {[60, 95, 130, 165].map((r, i) => (
            <circle
              key={r}
              cx="320"
              cy="210"
              r={r}
              stroke={i === 1 ? "#ff5500" : "#e6e4de"}
              strokeOpacity={0.55 - i * 0.1}
              strokeDasharray={i % 2 === 0 ? "4 4" : undefined}
            />
          ))}
          {/* Monolith body */}
          <rect x="220" y="65" width="200" height="290" rx="14" fill="#1a1c22" strokeWidth="1.6" />
          <circle cx="320" cy="155" r="54" strokeWidth="1.4" />
          <circle cx="320" cy="155" r="18" fill="#ff5500" fillOpacity="0.25" stroke="#ff5500" strokeWidth="1.4" />
          <circle cx="320" cy="275" r="54" strokeWidth="1.4" />
          <circle cx="320" cy="275" r="34" strokeOpacity="0.5" />
        </g>
      )}

      {kind === "reel" && (
        <g stroke="#e6e4de" fill="none">
          <rect x="195" y="55" width="250" height="310" rx="16" fill="#1a1c22" strokeWidth="1.6" />
          {/* Motorized center platter */}
          <circle cx="320" cy="195" r="86" fill="#111216" strokeWidth="1.6" />
          <circle cx="320" cy="195" r="62" stroke="#ff5500" strokeWidth="1.2" strokeDasharray="6 4" />
          <circle cx="320" cy="195" r="18" fill="#ff5500" fillOpacity="0.25" stroke="#ff5500" strokeWidth="1.4" />
          <line x1="320" y1="195" x2="380" y2="145" stroke="#ff5500" strokeWidth="1.6" />
          {/* Transport keys */}
          {[225, 275, 325, 375].map((x, i) => (
            <rect key={x} x={x} y="308" width="40" height="32" rx="4" stroke={i === 0 ? "#ff5500" : "#e6e4de"} />
          ))}
        </g>
      )}

      {kind === "mic" && (
        <g stroke="#e6e4de" fill="none">
          {/* Polar cardioid pattern */}
          <path
            d="M 320 85 C 420 55, 470 175, 320 265 C 170 175, 220 55, 320 85 Z"
            stroke="#ff5500"
            strokeOpacity="0.7"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <rect x="282" y="80" width="76" height="110" rx="38" fill="#1a1c22" strokeWidth="1.5" />
          <circle cx="320" cy="132" r="24" stroke="#ff5500" strokeWidth="1.4" />
          <rect x="290" y="190" width="60" height="165" rx="6" fill="#16181d" strokeWidth="1.5" />
        </g>
      )}

      <text x="24" y="396" fill="#e6e4de" fillOpacity="0.55" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
        TOLERANCE ISO 2768-mK // SCALE 1:2
      </text>
      <text x="616" y="396" textAnchor="end" fill="#ff5500" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
        ECHO LAB BERLIN—TOKYO
      </text>
    </svg>
  );
}

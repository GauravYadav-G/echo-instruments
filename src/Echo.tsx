import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import {
  gsap,
  scrollToTarget,
  useBodyBg,
  useClock,
  useFontsRefresh,
  useLenis,
  useReducedMotion,
  type Lenis,
} from "./shared/motion";
import { Magnetic } from "./shared/ui";
import { CymaticsCanvas, HardwareSchematic, playHarmonicTone } from "./Art";
import {
  assemblyLayers,
  cymaticPresets,
  instruments,
  type CymaticPreset,
  type EchoInstrument,
} from "./data";

/* ================================================================
   TORX SCREW DECORATOR (INDUSTRIAL HARDWARE DETAIL)
   ================================================================ */

function Screw() {
  return (
    <span
      aria-hidden
      className="inline-flex h-3 w-3 items-center justify-center rounded-full border border-[#e6e4de]/25 bg-[#16181d] text-[7px] leading-none text-[#e6e4de]/45 select-none"
    >
      +
    </span>
  );
}

/* ================================================================
   NAVIGATION BAR
   ================================================================ */

function ENav({
  lenis,
  audioArmed,
  setAudioArmed,
}: {
  lenis: RefObject<Lenis | null>;
  audioArmed: boolean;
  setAudioArmed: (v: boolean) => void;
}) {
  const berlin = useClock("Europe/Berlin");
  const go = (e: React.MouseEvent, sel: string) => {
    e.preventDefault();
    scrollToTarget(lenis.current, sel, -40);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e6e4de]/12 bg-[#0c0d10]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#e-top" onClick={(e) => go(e, "#e-top")} className="flex items-center gap-3">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff5500]" aria-hidden />
          <span className="font-grot text-lg font-semibold tracking-[-0.03em] text-[#e6e4de] uppercase">
            ECHO<span className="font-mono text-xs font-normal text-[#ff5500]">®</span>
          </span>
          <span className="hidden border-l border-[#e6e4de]/20 pl-3 font-mono text-[10px] tracking-[0.24em] text-[#8a8e96] uppercase sm:inline">
            Acoustic Instruments
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Echo sections">
          {[
            ["01 Cymatics Lab", "#e-top"],
            ["02 Instruments", "#e-instruments"],
            ["03 Architecture", "#e-assembly"],
            ["04 Allocation", "#e-order"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={(e) => go(e, href)}
              className="link-sweep font-mono text-[10px] tracking-[0.24em] text-[#8a8e96] uppercase transition-colors hover:text-[#e6e4de]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-[#8a8e96] uppercase tabular xl:inline">
            BER {berlin}
          </span>
          <button
            type="button"
            onClick={() => {
              const next = !audioArmed;
              setAudioArmed(next);
              if (next) playHarmonicTone(220, 4, 7);
            }}
            className={`flex items-center gap-2 rounded-xs border px-3.5 py-2 font-mono text-[10px] tracking-[0.22em] uppercase transition-colors ${
              audioArmed
                ? "border-[#ff5500] bg-[#ff5500] text-[#0c0d10]"
                : "border-[#e6e4de]/25 text-[#e6e4de] hover:border-[#ff5500]"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${audioArmed ? "bg-[#0c0d10]" : "bg-[#ff5500]"}`} />
            Synth: {audioArmed ? "Armed" : "Tap to Arm"}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ================================================================
   HERO — INTERACTIVE CHLADNI CYMATICS & HARMONIC SYNTHESIZER
   ================================================================ */

function Hero({
  audioArmed,
  setAudioArmed,
  lenis,
}: {
  audioArmed: boolean;
  setAudioArmed: (v: boolean) => void;
  lenis: RefObject<Lenis | null>;
}) {
  const [preset, setPreset] = useState<CymaticPreset>(cymaticPresets[2]);
  const [customM, setCustomM] = useState(cymaticPresets[2].m);
  const [customN, setCustomN] = useState(cymaticPresets[2].n);
  const [freq, setFreq] = useState(cymaticPresets[2].freq);

  const selectPreset = (p: CymaticPreset) => {
    setPreset(p);
    setCustomM(p.m);
    setCustomN(p.n);
    setFreq(p.freq);
    setAudioArmed(true);
    playHarmonicTone(p.freq, p.m, p.n);
  };

  return (
    <section id="e-top" className="relative pt-20 md:pt-24">
      <div className="mx-auto max-w-[1680px] px-5 pt-6 pb-20 md:px-10 md:pt-10 md:pb-28">
        {/* Top hardware telemetry rail */}
        <div className="grid grid-cols-2 gap-4 border-b border-[#e6e4de]/15 pb-4 font-mono text-[10px] tracking-[0.24em] text-[#8a8e96] uppercase md:grid-cols-4">
          <span>SYS // ECHO LAB BERLIN · TOKYO</span>
          <span>DSP: 64-BIT WAVEGUIDE @ 384 KHZ</span>
          <span className="hidden md:inline">CHASSIS: CNC 6061-T6 ALUMINUM</span>
          <span className="text-right text-[#ff5500]">THD+N &lt; 0.0006%</span>
        </div>

        <div className="mt-8 grid grid-cols-12 items-stretch gap-8 lg:mt-12">
          {/* Left column: Industrial Typography + Tactile Harmonic Console */}
          <div className="col-span-12 flex flex-col justify-between lg:col-span-6">
            <div>
              <div className="inline-flex items-center gap-2 border border-[#e6e4de]/20 bg-[#14161b] px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] text-[#ff5500] uppercase">
                <span>●</span> Physical-Modeling Audio Hardware
              </div>

              <h1 className="mt-6 font-grot text-[clamp(3rem,7.2vw,7.4rem)] leading-[0.9] font-medium tracking-[-0.045em] text-[#e6e4de]">
                Form follows{" "}
                <span className="font-serifi font-normal text-[#ff5500] italic">frequency.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#8a8e96]">
                We engineer tactile synthesizers, planar-magnetic spatial loudspeakers, and field recorders milled from solid metal. Trigger a harmonic mode below to excite our real-time Chladni resonance plate.
              </p>
            </div>

            {/* Tactile Harmonic Control Deck */}
            <div className="mt-10 border border-[#e6e4de]/20 bg-[#13151a] p-5 md:p-7">
              <div className="flex items-center justify-between border-b border-[#e6e4de]/12 pb-3.5">
                <span className="font-mono text-[10px] tracking-[0.26em] text-[#e6e4de] uppercase">
                  Harmonic Mode Selector — Click Pad to Excite Plate
                </span>
                <span className="font-mono text-[10px] tracking-[0.22em] text-[#ff5500] uppercase tabular">
                  f₀ = {freq.toFixed(1)} Hz ({preset.note})
                </span>
              </div>

              {/* 5 Tactile Drum/Synth Pads */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                {cymaticPresets.map((p) => {
                  const active = preset.id === p.id && customM === p.m && customN === p.n;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPreset(p)}
                      className={`group flex flex-col justify-between border p-3 text-left transition-all ${
                        active
                          ? "border-[#ff5500] bg-[#ff5500] text-[#0c0d10]"
                          : "border-[#e6e4de]/20 bg-[#0c0d10] text-[#e6e4de] hover:border-[#ff5500]"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em] uppercase">
                        <span>{p.note}</span>
                        <span>
                          m{p.m}:n{p.n}
                        </span>
                      </div>
                      <p className="mt-4 font-grot text-xl font-semibold tracking-tight tabular">
                        {p.freq}
                        <span className="ml-0.5 font-mono text-[10px] font-normal">Hz</span>
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Manual Nodal Sliders */}
              <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#e6e4de]/12 pt-4 sm:grid-cols-2">
                <label className="block">
                  <div className="flex justify-between font-mono text-[10px] tracking-[0.22em] text-[#8a8e96] uppercase">
                    <span>Nodal Index M</span>
                    <span className="text-[#e6e4de] tabular">m = {customM}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={9}
                    step={1}
                    value={customM}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCustomM(val);
                      if (audioArmed) playHarmonicTone(freq, val, customN);
                    }}
                    className="mt-2 h-1.5 w-full cursor-pointer appearance-none bg-[#e6e4de]/20 accent-[#ff5500]"
                  />
                </label>
                <label className="block">
                  <div className="flex justify-between font-mono text-[10px] tracking-[0.22em] text-[#8a8e96] uppercase">
                    <span>Nodal Index N</span>
                    <span className="text-[#e6e4de] tabular">n = {customN}</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={11}
                    step={1}
                    value={customN}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCustomN(val);
                      if (audioArmed) playHarmonicTone(freq, customM, val);
                    }}
                    className="mt-2 h-1.5 w-full cursor-pointer appearance-none bg-[#e6e4de]/20 accent-[#ff5500]"
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#e6e4de]/12 pt-4">
                <p className="font-mono text-[10px] text-[#8a8e96]">{preset.description}</p>
                <Magnetic>
                  <a
                    href="#e-instruments"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(lenis.current, "#e-instruments", -40);
                    }}
                    className="inline-flex items-center gap-2 bg-[#e6e4de] px-4 py-2.5 font-mono text-[10px] tracking-[0.24em] text-[#0c0d10] uppercase transition-colors hover:bg-[#ff5500]"
                  >
                    Explore Hardware ↓
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Right column: Anodized Bezel Chladni Cymatics Oscilloscope */}
          <div className="col-span-12 lg:col-span-6">
            <div className="flex h-full min-h-[440px] flex-col justify-between border border-[#e6e4de]/25 bg-[#14161b] p-4 md:p-6">
              <div className="flex items-center justify-between pb-3 font-mono text-[10px] tracking-[0.24em] text-[#8a8e96] uppercase">
                <span className="flex items-center gap-2">
                  <Screw /> CHLADNI RESONANCE SCOPE // 2,200 PARTICLES
                </span>
                <span className="text-[#ff5500]">
                  NODE ({customM}, {customN}) <Screw />
                </span>
              </div>

              <div className="relative aspect-square max-h-[520px] w-full flex-1 overflow-hidden border border-[#e6e4de]/20 bg-[#0c0d10]">
                <CymaticsCanvas m={customM} n={customN} freq={freq} />
                <div className="pointer-events-none absolute bottom-3 left-3 bg-[#0c0d10]/85 px-2.5 py-1 font-mono text-[9px] tracking-[0.24em] text-[#e6e4de]/80 uppercase">
                  Move cursor over plate to perturb standing wave
                </div>
                <div className="pointer-events-none absolute right-3 bottom-3 bg-[#0c0d10]/85 px-2.5 py-1 font-mono text-[9px] tracking-[0.24em] text-[#ff5500] uppercase tabular">
                  cos({customN}πx)cos({customM}πy) − cos({customM}πx)cos({customN}πy) = 0
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 font-mono text-[10px] tracking-[0.24em] text-[#8a8e96] uppercase">
                <span className="flex items-center gap-2">
                  <Screw /> RATIO: {preset.harmonicRatio}
                </span>
                <span className="flex items-center gap-2">
                  Q-FACTOR: 148.4 <Screw />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   02 — FLAGSHIP HARDWARE INSTRUMENTS + SPEC SHEET MODAL
   ================================================================ */

function SpecModal({
  item,
  onClose,
  lenis,
}: {
  item: EchoInstrument;
  onClose: () => void;
  lenis: RefObject<Lenis | null>;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const l = lenis.current;
    l?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      l?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} technical datasheet`}
      className="backdrop-in fixed inset-0 z-[150] flex items-center justify-center bg-[#0c0d10]/80 p-4 backdrop-blur-sm md:p-10"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-swap max-h-[90vh] w-full max-w-[920px] overflow-y-auto border border-[#e6e4de]/25 bg-[#121317] text-[#e6e4de]"
      >
        <div className="flex items-center justify-between border-b border-[#e6e4de]/15 px-6 py-4 font-mono text-[10px] tracking-[0.26em] uppercase">
          <span className="text-[#ff5500]">
            DATASHEET // {item.code} — {item.batch}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="border border-[#e6e4de]/25 px-3 py-1.5 hover:bg-[#e6e4de] hover:text-[#0c0d10]"
          >
            CLOSE [ESC]
          </button>
        </div>

        <div className="grid grid-cols-1 border-b border-[#e6e4de]/15 md:grid-cols-2">
          <div className="aspect-[16/11] overflow-hidden border-b border-[#e6e4de]/15 md:border-r md:border-b-0">
            <HardwareSchematic kind={item.diagramKind} />
          </div>
          <div className="aspect-[16/11] overflow-hidden">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.26em] text-[#8a8e96] uppercase">{item.category}</p>
              <h3 className="mt-1 font-grot text-4xl font-semibold tracking-tight">{item.name}</h3>
            </div>
            <p className="font-grot text-3xl font-medium text-[#ff5500] tabular">{item.price}</p>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-[#8a8e96]">{item.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-[#e6e4de]/15 py-5 sm:grid-cols-4">
            <div>
              <dt className="font-mono text-[9px] tracking-[0.22em] text-[#8a8e96] uppercase">Frequency Range</dt>
              <dd className="mt-1 font-mono text-xs text-[#e6e4de]">{item.freqResponse}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] tracking-[0.22em] text-[#8a8e96] uppercase">Distortion / Noise</dt>
              <dd className="mt-1 font-mono text-xs text-[#ff5500]">{item.thd}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] tracking-[0.22em] text-[#8a8e96] uppercase">Enclosure</dt>
              <dd className="mt-1 font-mono text-xs text-[#e6e4de]">{item.chassis}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] tracking-[0.22em] text-[#8a8e96] uppercase">Mass</dt>
              <dd className="mt-1 font-mono text-xs text-[#e6e4de]">{item.weight}</dd>
            </div>
          </dl>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {item.specs.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-[#e6e4de]/10 py-2 font-mono text-xs">
                <span className="text-[#8a8e96]">{k}</span>
                <span className="text-[#e6e4de]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InstrumentsSection({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const [view, setView] = useState<"schematic" | "photo">("schematic");
  const [activeItem, setActiveItem] = useState<EchoInstrument | null>(null);

  return (
    <section id="e-instruments" className="border-t border-[#e6e4de]/15 bg-[#e6e4de] py-24 text-[#0c0d10] md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#ff5500] uppercase">
              (02) — Production Lineup
            </p>
            <h2 className="mt-3 font-grot text-[clamp(2.4rem,5.8vw,5.6rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
              Four instruments. Zero plastic.
            </h2>
          </div>

          <div className="flex items-center gap-1 border border-[#0c0d10]/25 p-1">
            {(
              [
                ["schematic", "CAD Schematic"],
                ["photo", "Studio Photo"],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => setView(k)}
                className={`px-3.5 py-2 font-mono text-[10px] tracking-[0.22em] uppercase transition-colors ${
                  view === k ? "bg-[#0c0d10] text-[#e6e4de]" : "text-[#0c0d10]/65 hover:text-[#0c0d10]"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          {instruments.map((inst) => (
            <article
              key={inst.id}
              data-erise
              className="group flex flex-col border border-[#0c0d10]/20 bg-[#dcd9d0] transition-colors hover:border-[#0c0d10]"
            >
              <div className="flex items-center justify-between border-b border-[#0c0d10]/15 px-5 py-3.5 font-mono text-[10px] tracking-[0.24em] uppercase">
                <span className="font-semibold text-[#ff5500]">{inst.code}</span>
                <span>{inst.category}</span>
                <span className="tabular">{inst.price}</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveItem(inst)}
                className="relative aspect-[16/10] w-full overflow-hidden bg-[#121317] text-left"
              >
                {view === "schematic" ? (
                  <HardwareSchematic kind={inst.diagramKind} />
                ) : (
                  <img
                    src={inst.image}
                    alt={inst.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <span className="absolute top-3 right-3 bg-[#0c0d10]/85 px-2.5 py-1 font-mono text-[9px] tracking-[0.22em] text-[#e6e4de] uppercase">
                  {inst.batch}
                </span>
              </button>

              <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-grot text-3xl font-semibold tracking-[-0.03em]">{inst.name}</h3>
                    <span className="font-mono text-xs text-[#0c0d10]/60 tabular">{inst.weight}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#0c0d10]/75">{inst.summary}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#0c0d10]/15 pt-4 font-mono text-[10px] tracking-[0.22em] uppercase">
                  <span>
                    {inst.freqResponse} · <strong className="text-[#ff5500]">{inst.thd}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveItem(inst)}
                    className="link-sweep font-semibold text-[#0c0d10]"
                  >
                    Datasheet ↗
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeItem && <SpecModal item={activeItem} onClose={() => setActiveItem(null)} lenis={lenis} />}
    </section>
  );
}

/* ================================================================
   03 — EXPLODED HARDWARE ARCHITECTURE (INTERACTIVE DISASSEMBLY)
   ================================================================ */

function ExplodedAssembly() {
  const [spread, setSpread] = useState(68);
  const [selectedLayer, setSelectedLayer] = useState(0);

  return (
    <section id="e-assembly" className="border-t border-[#e6e4de]/15 bg-[#0c0d10] py-24 text-[#e6e4de] md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#ff5500] uppercase">
              (03) — Internal Architecture
            </p>
            <h2 className="mt-3 font-grot text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.92] font-medium tracking-[-0.045em]">
              Exploded <span className="font-serifi font-normal text-[#ff5500] italic">monolith</span> stack.
            </h2>
          </div>

          <div className="w-full max-w-sm border border-[#e6e4de]/20 bg-[#14161b] p-4">
            <div className="flex justify-between font-mono text-[10px] tracking-[0.24em] uppercase">
              <span>Assembly Separation</span>
              <span className="text-[#ff5500] tabular">{(spread * 1.4).toFixed(1)} mm</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={spread}
              onChange={(e) => setSpread(Number(e.target.value))}
              className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none bg-[#e6e4de]/20 accent-[#ff5500]"
            />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-12 items-center gap-8">
          {/* Interactive Isometric Stack Visualization */}
          <div className="col-span-12 lg:col-span-7">
            <div className="relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden border border-[#e6e4de]/20 bg-[#121317] p-8">
              <div className="w-full max-w-lg space-y-2">
                {assemblyLayers.map((layer, idx) => {
                  const offset = (idx - 2) * (spread * 0.28);
                  const isSel = selectedLayer === idx;
                  return (
                    <button
                      key={layer.code}
                      type="button"
                      onClick={() => setSelectedLayer(idx)}
                      style={{
                        transform: `translateY(${offset}px)`,
                      }}
                      className={`flex w-full items-center justify-between border px-5 py-4 text-left transition-all duration-300 ${
                        isSel
                          ? "border-[#ff5500] bg-[#ff5500]/15 text-[#e6e4de]"
                          : "border-[#e6e4de]/25 bg-[#181a20]/90 text-[#8a8e96] hover:border-[#e6e4de]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-[#ff5500]">{layer.code}</span>
                        <span className="font-grot text-lg font-medium text-[#e6e4de]">{layer.name}</span>
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.22em] text-[#e6e4de]/70 uppercase tabular">
                        {layer.tolerance}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Layer Engineering Readout + List */}
          <div className="col-span-12 lg:col-span-5">
            <div className="border border-[#e6e4de]/20 bg-[#14161b] p-7 md:p-9">
              <span className="font-mono text-[10px] tracking-[0.28em] text-[#ff5500] uppercase">
                SELECTED MODULE // {assemblyLayers[selectedLayer].code}
              </span>
              <h3 className="mt-3 font-grot text-3xl font-medium text-[#e6e4de]">
                {assemblyLayers[selectedLayer].name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#8a8e96]">
                {assemblyLayers[selectedLayer].detail}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-[#e6e4de]/15 pt-6 font-mono">
                <div>
                  <dt className="text-[9px] tracking-[0.24em] text-[#8a8e96] uppercase">Specified Alloy / Medium</dt>
                  <dd className="mt-1.5 text-xs text-[#e6e4de]">{assemblyLayers[selectedLayer].material}</dd>
                </div>
                <div>
                  <dt className="text-[9px] tracking-[0.24em] text-[#8a8e96] uppercase">Machining Tolerance</dt>
                  <dd className="mt-1.5 text-xs text-[#ff5500]">{assemblyLayers[selectedLayer].tolerance}</dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-2 border-t border-[#e6e4de]/15 pt-6">
                {assemblyLayers.map((l, i) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setSelectedLayer(i)}
                    className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase ${
                      selectedLayer === i
                        ? "border-[#ff5500] bg-[#ff5500] text-[#0c0d10]"
                        : "border-[#e6e4de]/20 text-[#8a8e96] hover:text-[#e6e4de]"
                    }`}
                  >
                    {l.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   04 — BATCH 04 DIRECT ALLOCATION & FOOTER
   ================================================================ */

function AllocationFooter({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const [unit, setUnit] = useState(instruments[0].name);
  const [finish, setFinish] = useState("Bead-Blasted Raw 6061");
  const [email, setEmail] = useState("");
  const [serial, setSerial] = useState<string | null>(null);

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSerial(`EC—B04—${Math.floor(1000 + Math.random() * 8999)}`);
  };

  return (
    <section id="e-order" className="border-t border-[#e6e4de]/15 bg-[#121317] pt-24 pb-16 text-[#e6e4de] md:pt-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-6">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#ff5500] uppercase">
              (04) — Direct Factory Allocation
            </p>
            <h2 className="mt-3 font-grot text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.92] font-medium tracking-[-0.045em]">
              Reserve a <span className="font-serifi font-normal text-[#ff5500] italic">serialized</span> unit.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[#8a8e96]">
              Every ECHO instrument is hand-assembled and calibrated in Berlin, shipped in a custom-milled flight case with its individual acoustic test plot.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-6">
            {serial ? (
              <div className="border border-[#ff5500] bg-[#0c0d10] p-8">
                <p className="font-mono text-[10px] tracking-[0.28em] text-[#ff5500] uppercase">
                  ● BUILD SLOT LOCKED — SERIAL {serial}
                </p>
                <p className="mt-4 font-grot text-2xl font-medium">
                  Your allocation for <span className="text-[#ff5500]">{unit}</span> ({finish}) has been assigned. Build sheet sent to {email}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSerial(null);
                    setEmail("");
                  }}
                  className="link-sweep mt-6 font-mono text-[10px] tracking-[0.24em] text-[#e6e4de] uppercase"
                >
                  Configure another unit
                </button>
              </div>
            ) : (
              <form onSubmit={handleReserve} className="border border-[#e6e4de]/20 bg-[#0c0d10] p-7 md:p-9">
                <p className="font-mono text-[10px] tracking-[0.24em] text-[#8a8e96] uppercase">1. Select Instrument</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {instruments.map((inst) => (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => setUnit(inst.name)}
                      className={`border px-3.5 py-2.5 text-left font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                        unit === inst.name
                          ? "border-[#ff5500] bg-[#ff5500] text-[#0c0d10]"
                          : "border-[#e6e4de]/20 text-[#e6e4de] hover:border-[#e6e4de]"
                      }`}
                    >
                      <span className="block opacity-70">{inst.code}</span>
                      {inst.name}
                    </button>
                  ))}
                </div>

                <p className="mt-6 font-mono text-[10px] tracking-[0.24em] text-[#8a8e96] uppercase">2. Anodized Finish</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Bead-Blasted Raw 6061", "Hard-Anodized Carbon"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFinish(f)}
                      className={`border px-3.5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase ${
                        finish === f
                          ? "border-[#e6e4de] bg-[#e6e4de] text-[#0c0d10]"
                          : "border-[#e6e4de]/20 text-[#8a8e96]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <label className="mt-6 block">
                  <span className="font-mono text-[10px] tracking-[0.24em] text-[#8a8e96] uppercase">
                    3. Engineer / Studio Dispatch Email *
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="studio@acoustic.org"
                    className="mt-2 w-full border-b border-[#e6e4de]/30 bg-transparent py-2.5 font-mono text-sm text-[#e6e4de] focus:border-[#ff5500] focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-8 w-full bg-[#ff5500] py-4 font-mono text-[10px] tracking-[0.28em] text-[#0c0d10] uppercase font-semibold transition-colors hover:bg-[#e6e4de]"
                >
                  Lock Batch 04 Serial Allocation →
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-[#e6e4de]/15 pt-8 font-mono text-[10px] tracking-[0.24em] text-[#8a8e96] uppercase">
          <span>© 2026 ECHO ACOUSTIC INSTRUMENTS GMBH — BERLIN / TOKYO</span>
          <button
            type="button"
            onClick={() => (lenis.current ? lenis.current.scrollTo(0, { duration: 1.6 }) : window.scrollTo(0, 0))}
            className="link-sweep text-[#e6e4de]"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   MAIN PAGE EXPORT
   ================================================================ */

export default function Echo() {
  useBodyBg("#0c0d10");
  const lenis = useLenis();
  useFontsRefresh();
  const [audioArmed, setAudioArmed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-erise]").forEach((el) => {
        gsap.from(el, {
          y: 42,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className="relative min-h-screen bg-[#0c0d10] font-grot text-[#e6e4de] selection:bg-[#ff5500] selection:text-[#0c0d10]">
      <ENav lenis={lenis} audioArmed={audioArmed} setAudioArmed={setAudioArmed} />
      <main>
        <Hero audioArmed={audioArmed} setAudioArmed={setAudioArmed} lenis={lenis} />
        <InstrumentsSection lenis={lenis} />
        <ExplodedAssembly />
        <AllocationFooter lenis={lenis} />
      </main>
    </div>
  );
}

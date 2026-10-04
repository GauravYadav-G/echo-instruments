export type EchoInstrument = {
  id: string;
  code: string;
  name: string;
  category: string;
  price: string;
  batch: string;
  summary: string;
  description: string;
  freqResponse: string;
  thd: string;
  chassis: string;
  weight: string;
  image: string;
  diagramKind: "synth" | "monolith" | "reel" | "mic";
  specs: [string, string][];
};

export const instruments: EchoInstrument[] = [
  {
    id: "mk1",
    code: "EC—01",
    name: "Field Synth MK—I",
    category: "Polyphonic Physical-Modeling Synthesizer",
    price: "€2,190",
    batch: "Batch 04 — In Stock",
    summary: "Twelve-voice modal & cymatic synthesizer milled from a solid block of bead-blasted 6061 aluminum, with optical keybeds and brass encoders.",
    description:
      "Designed in Berlin and machined in Nagano, the Field Synth MK—I replaces menu diving with direct physical coupling. Each brass rotary encoder drives a real-time waveguide solver on our custom FPGA core, letting you sculpt standing waves, string tension, and plate damping with zero latency.",
    freqResponse: "8 Hz — 48 kHz (±0.2 dB)",
    thd: "< 0.0006% THD+N",
    chassis: "CNC 6061-T6 Anodized Aluminum",
    weight: "1,420 g",
    image: "https://images.pexels.com/photos/26315454/pexels-photo-26315454.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    diagramKind: "synth",
    specs: [
      ["Synthesis Engine", "12-Voice Modal / Chladni Waveguide"],
      ["DAC Architecture", "Dual-Mono 32-bit / 384 kHz AKM"],
      ["Encoders", "4× Machined C36000 Brass, 14-bit optical"],
      ["Battery Autonomy", "18 hours continuous field operation"],
    ],
  },
  {
    id: "ob4",
    code: "EC—02",
    name: "Monolith OB—4",
    category: "Omni-Directional Spatial Reference Array",
    price: "€3,450",
    batch: "Batch 03 — Limited",
    summary: "An acoustic point-source column combining a planar magnetic ribbon tweeter with a force-canceling neodymium woofer pair.",
    description:
      "Conventional loudspeakers beam high frequencies into a narrow sweet spot. Monolith OB—4 projects a phase-coherent cylindrical wavefront across 360 degrees, calibrating itself to your room's boundaries in 1.4 seconds using four flush-mounted MEMS reference microphones.",
    freqResponse: "19 Hz — 42 kHz (−1.5 dB)",
    thd: "< 0.0012% @ 95 dB SPL",
    chassis: "Die-Cast Magnesium & Stainless Mesh",
    weight: "11.8 kg",
    image: "https://images.pexels.com/photos/3391920/pexels-photo-3391920.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    diagramKind: "monolith",
    specs: [
      ["Amplification", "900W Class-AD Hybrid (Zero Feedback)"],
      ["HF Transducer", "120mm Kapton Planar Magnetic Ribbon"],
      ["LF Architecture", "Dual 180mm Force-Canceling Long-Throw"],
      ["Room Correction", "64-bit FIR Acoustic Boundary Solver"],
    ],
  },
  {
    id: "tp7",
    code: "EC—03",
    name: "Reel Deck TP—7",
    category: "Motorized Field Recorder & Tactile Scrubbing Wheel",
    price: "€1,490",
    batch: "Batch 05 — Shipping",
    summary: "Pocket-sized 32-bit float field recorder with a motorized center platter that spins under your thumb for physical tape-style scrubbing.",
    description:
      "When you touch the brushed aluminum center wheel, the brushless Hall-effect motor yields to your fingertips — letting you scrub through a six-channel field recording at 1/100th speed or throw the platter into a gentle inertia loop.",
    freqResponse: "10 Hz — 96 kHz",
    thd: "134 dB Dynamic Range",
    chassis: "Stainless Steel & Tempered Gorilla Glass",
    weight: "310 g",
    image: "https://images.pexels.com/photos/36471696/pexels-photo-36471696.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    diagramKind: "reel",
    specs: [
      ["Preamp Noise Floor", "−131 dBu EIN (Discrete JFET)"],
      ["Motorized Platter", "Coreless 3-Phase Brushless Gimbal"],
      ["Internal Storage", "512 GB NVMe + USB-C 10Gbps"],
      ["Timecode", "0.1 ppm TCXO Generator / Jam-Sync"],
    ],
  },
  {
    id: "cm12",
    code: "EC—04",
    name: "Capsule CM—12",
    category: "Large-Diaphragm Titanium Reference Microphone",
    price: "€1,850",
    batch: "Built to Order",
    summary: "Hand-tensioned 2-micron titanium diaphragm suspended in a non-resonant brass acoustic labyrinth.",
    description:
      "Every CM—12 capsule is sputtered and tuned in our Berlin cleanroom, then paired with an individual serialized frequency chart. Its cardioid-to-omni polar pattern is continuously variable via a precision vernier ring on the barrel.",
    freqResponse: "15 Hz — 35 kHz",
    thd: "6 dBA Self-Noise",
    chassis: "Turned C36000 Brass & Matte Nickel",
    weight: "680 g",
    image: "https://images.pexels.com/photos/19829189/pexels-photo-19829189.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    diagramKind: "mic",
    specs: [
      ["Diaphragm", "28mm / 2-Micron Pure Titanium Foil"],
      ["Max SPL", "148 dB SPL (0.5% THD)"],
      ["Output Stage", "Transformerless Lundahl Balanced"],
      ["Tolerance", "±0.3 dB matched stereo pairs"],
    ],
  },
];

export type CymaticPreset = {
  id: string;
  label: string;
  note: string;
  freq: number;
  m: number;
  n: number;
  harmonicRatio: string;
  description: string;
};

export const cymaticPresets: CymaticPreset[] = [
  {
    id: "a2",
    label: "MODE I — FUNDAMENTAL",
    note: "A2",
    freq: 110,
    m: 2,
    n: 3,
    harmonicRatio: "2 : 3 Fifth",
    description: "Low-order quadrupolar standing wave. Sand particles migrate toward two primary hyperbolic nodal lines.",
  },
  {
    id: "e3",
    label: "MODE II — HARMONIC",
    note: "E3",
    freq: 165,
    m: 3,
    n: 5,
    harmonicRatio: "3 : 5 Major Sixth",
    description: "Cellular lattice resonance with eight symmetrical nodal pockets and zero corner displacement.",
  },
  {
    id: "a3",
    label: "MODE III — OCTAVE",
    note: "A3",
    freq: 220,
    m: 4,
    n: 7,
    harmonicRatio: "4 : 7 Harmonic Seventh",
    description: "High-Q radial ring formation where phase cancellation carves a concentric acoustic mandala.",
  },
  {
    id: "c4",
    label: "MODE IV — CRYSTALLINE",
    note: "C#4",
    freq: 277.2,
    m: 5,
    n: 8,
    harmonicRatio: "5 : 8 Golden Minor",
    description: "Fibonacci-proportioned standing wave used to test diaphragm rigidity across our planar ribbons.",
  },
  {
    id: "a4",
    label: "MODE V — REFERENCE",
    note: "A4",
    freq: 440,
    m: 6,
    n: 9,
    harmonicRatio: "6 : 9 Concert Reference",
    description: "Dense high-frequency interference matrix revealing sub-millimeter thickness variations in 6061 aluminum.",
  },
];

export const assemblyLayers = [
  {
    code: "L—01",
    name: "CNC-Milled 6061-T6 Top Deck",
    tolerance: "±0.008 mm",
    material: "Bead-Blasted Anodized Aluminum",
    detail: "Machined in 14 operations from a 4.2 kg billet; laser-etched legends filled with cured ceramic pigment.",
  },
  {
    code: "L—02",
    name: "Planar Magnetic Ribbon & Acoustic Grille",
    tolerance: "±0.003 mm",
    material: "2-Micron Kapton / Etched Aluminum Trace",
    detail: "Ultra-low-mass diaphragm accelerates 18× faster than conventional dome tweeters for transient accuracy.",
  },
  {
    code: "L—03",
    name: "Toroidal Neodymium N52 Flux Array",
    tolerance: "1.48 Tesla",
    material: "Sintered NdFeB + Permalloy Yoke",
    detail: "Symmetrical push-pull magnetic circuit eliminates even-order harmonic distortion across the full excursion.",
  },
  {
    code: "L—04",
    name: "64-Bit Custom FPGA Waveguide Core",
    tolerance: "0.08 ms Latency",
    material: "6-Layer Immersion-Gold PCB",
    detail: "Dedicated hardware DSP computes 12 simultaneous physical-modeling differential equations at 384 kHz.",
  },
  {
    code: "L—05",
    name: "Weighted Brass Detent Encoders & Base",
    tolerance: "50,000 Cycles",
    material: "Turned C36000 Solid Brass",
    detail: "Optical contactless sensing paired with fluid-damped bearings for lifelong zero-play tactile resistance.",
  },
];

export interface Product {
  id: string;
  name: string;
  model: string;
  description: string;
  longDescription: string;
  specs: Record<string, string>;
  features: string[];
  price: number;
  brand: string;
  category: string;
  images: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isHidden?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Brand {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: "refrigerators", name: "Refrigerators", description: "Precision cooling, elegant design.", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=1200&q=80" },
  { id: "washers", name: "Washing Machines", description: "Whisper-quiet, deeply effective.", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1200&q=80" },
  { id: "ovens", name: "Ovens & Cooking", description: "Restaurant-grade in your kitchen.", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80" },
  { id: "dishwashers", name: "Dishwashers", description: "Spotless results, every cycle.", image: "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?w=1200&q=80" },
  { id: "ac", name: "Air Conditioners", description: "Climate, perfectly tuned.", image: "https://images.unsplash.com/photo-1631545308456-c8f3a8e25c5b?w=1200&q=80" },
  { id: "tv", name: "Televisions", description: "Cinematic clarity at home.", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=80" },
];

export const brands: Brand[] = [
  { id: "chrani", name: "Chrani" },
  { id: "lumen", name: "Lumen" },
  { id: "atelier", name: "Atelier" },
  { id: "noir", name: "Noir Series" },
  { id: "vega", name: "Vega" },
];

const img = (seed: string, w = 1200) => `https://images.unsplash.com/${seed}?w=${w}&q=80&auto=format&fit=crop`;

export const products: Product[] = [
  {
    id: "ch-fridge-pro-900",
    name: "Chrani Pro 900 French Door",
    model: "CFP-900-X",
    description: "900L French-door refrigerator with InvisiCool airflow and metallic interior.",
    longDescription: "The Pro 900 redefines premium refrigeration with a triple-zone cooling architecture, antimicrobial steel interior, and a flush-mount door system that integrates seamlessly into modern kitchens. Energy-rated A+++ with intelligent humidity zones for produce.",
    specs: { Capacity: "900 L", Energy: "A+++", "Noise Level": "32 dB", Width: "91 cm", Height: "183 cm", Weight: "142 kg" },
    features: ["InvisiCool triple airflow", "Antimicrobial steel liner", "Smart inverter compressor", "Voice & app control", "Vacation mode", "Filtered ice & water"],
    price: 4200,
    brand: "chrani",
    category: "refrigerators",
    images: [img("photo-1571175443880-49e1d25b2bc5"), img("photo-1584568694244-14fbdf83bd30"), img("photo-1556910103-1c02745aae4d")],
    isFeatured: true,
  },
  {
    id: "lumen-washer-x7",
    name: "Lumen X7 SilentWash",
    model: "LX7-SW",
    description: "10kg front-load washer with auto-dose and SteamRefresh.",
    longDescription: "Engineered for the quietest household. Direct-drive motor, 10-year warranty, auto-dose for precise detergent dispensing, and a SteamRefresh cycle that revives garments without water.",
    specs: { Capacity: "10 kg", Spin: "1600 rpm", Energy: "A", "Noise Level": "47 dB", Programs: "16", Warranty: "10 years (motor)" },
    features: ["Direct-drive motor", "Auto-dose detergent", "SteamRefresh cycle", "Anti-allergy program", "Smart leak protection"],
    price: 1490,
    brand: "lumen",
    category: "washers",
    images: [img("photo-1626806787461-102c1bfaaea1"), img("photo-1610557892470-55d9e80c0bce"), img("photo-1604335079877-83c8a8c4cae6")],
    isFeatured: true,
    isNew: true,
  },
  {
    id: "atelier-oven-duet",
    name: "Atelier Duet Steam Oven",
    model: "AT-DUET-60",
    description: "Built-in steam + convection oven with sous-vide precision.",
    longDescription: "A chef's instrument disguised as an appliance. The Duet combines true convection with calibrated steam injection, a probe thermometer, and 30 guided recipes preloaded.",
    specs: { Capacity: "75 L", Power: "3.6 kW", Modes: "17", "Probe Range": "30–99°C", Cleaning: "Pyrolytic" },
    features: ["Steam + convection", "Pyrolytic self-clean", "Soft-close door", "Touch glass interface", "Recipe library"],
    price: 2890,
    brand: "atelier",
    category: "ovens",
    images: [img("photo-1556909114-f6e7ad7d3136"), img("photo-1556909114-44c0a72d7d4f"), img("photo-1574269910231-bc508bcb40c1")],
    isFeatured: true,
  },
  {
    id: "noir-dishwasher-q",
    name: "Noir Quiet Series Dishwasher",
    model: "NQ-14P",
    description: "14-place dishwasher with crystal-care and 38 dB rating.",
    longDescription: "The world's quietest at 38 dB, the Noir Q hides behind any cabinet. Zeolite drying, crystal-safe wash arms, and adjustable third rack for cookware.",
    specs: { "Place Settings": "14", "Noise Level": "38 dB", Energy: "A+++", Programs: "9", Warranty: "5 years" },
    features: ["Zeolite drying", "Third cutlery rack", "TimeBeam projection", "Auto open finish", "Home Connect app"],
    price: 1650,
    brand: "noir",
    category: "dishwashers",
    images: [img("photo-1581622558663-b2e33377dfb2"), img("photo-1584568694244-14fbdf83bd30"), img("photo-1556910103-1c02745aae4d")],
    isNew: true,
  },
  {
    id: "vega-ac-inverter",
    name: "Vega Inverter Split AC 24K",
    model: "VG-INV-24",
    description: "24,000 BTU inverter AC with WindFree comfort mode.",
    longDescription: "Cooling that disappears. WindFree micro-vents diffuse air without a draft, while the inverter compressor sips power. Smart filtration removes 99.7% of particulates.",
    specs: { BTU: "24,000", SEER: "21", Modes: "Cool / Heat / Dry / Fan", "Noise Level": "23 dB", Coverage: "55 m²" },
    features: ["WindFree comfort", "Triple inverter", "PM2.5 filter", "Voice control", "10-year compressor warranty"],
    price: 1280,
    brand: "vega",
    category: "ac",
    images: [img("photo-1631545308456-c8f3a8e25c5b"), img("photo-1632935190508-bcd72d0f8a4c"), img("photo-1535914254981-b5012eebbd15")],
    isFeatured: true,
  },
  {
    id: "chrani-tv-oled-65",
    name: "Chrani OLED 65\" Cinema",
    model: "C-OLED-65C",
    description: "65-inch 4K OLED with Dolby Vision IQ and 144Hz.",
    longDescription: "Self-lit pixels, perfect blacks, and a cinematic processing chip tuned by colorists. Gallery-thin profile sits flush against the wall.",
    specs: { Size: "65\"", Resolution: "4K UHD", "Refresh Rate": "144 Hz", HDR: "Dolby Vision IQ", Sound: "60W 2.2.2" },
    features: ["Perfect blacks (OLED)", "144Hz gaming", "Dolby Vision IQ", "Filmmaker mode", "AirPlay & Chromecast"],
    price: 2490,
    brand: "chrani",
    category: "tv",
    images: [img("photo-1593359677879-a4bb92f829d1"), img("photo-1461151304267-38535e780c79"), img("photo-1571415060716-baff5f717068")],
    isFeatured: true,
    isNew: true,
  },
  {
    id: "lumen-fridge-slim",
    name: "Lumen Slim Column Fridge",
    model: "LSC-450",
    description: "Integrated 60cm column fridge — 450L capacity.",
    longDescription: "Designed for paneled kitchens. Pairs with the Lumen freezer column for a seamless built-in look.",
    specs: { Capacity: "450 L", Energy: "A++", Width: "60 cm", Height: "212 cm" },
    features: ["Integrated panel-ready", "Soft-close drawers", "LED column lighting", "Door alarm"],
    price: 3100,
    brand: "lumen",
    category: "refrigerators",
    images: [img("photo-1584568694244-14fbdf83bd30"), img("photo-1571175443880-49e1d25b2bc5")],
  },
  {
    id: "atelier-washer-2in1",
    name: "Atelier Wash & Dry 2in1",
    model: "AT-WD-12",
    description: "12kg wash + 8kg dry combo with heat pump.",
    longDescription: "All-in-one laundry without compromise. Heat-pump drying preserves fabrics while saving energy.",
    specs: { "Wash Capacity": "12 kg", "Dry Capacity": "8 kg", Spin: "1400 rpm", Energy: "A" },
    features: ["Heat-pump drying", "Wrinkle-free finish", "Auto-dose", "Steam refresh"],
    price: 2190,
    brand: "atelier",
    category: "washers",
    images: [img("photo-1610557892470-55d9e80c0bce"), img("photo-1626806787461-102c1bfaaea1")],
  },
  {
    id: "vega-oven-compact",
    name: "Vega Compact Microwave Oven",
    model: "VG-COMBI-45",
    description: "Combi microwave with grill and convection.",
    longDescription: "Compact 45cm built-in combi unit — microwave, grill, and full convection in one slot.",
    specs: { Capacity: "40 L", Power: "900 W (microwave)", Modes: "12" },
    features: ["3-in-1 cooking", "Touch interface", "Auto programs", "Child lock"],
    price: 980,
    brand: "vega",
    category: "ovens",
    images: [img("photo-1574269910231-bc508bcb40c1"), img("photo-1556909114-f6e7ad7d3136")],
    isNew: true,
  },
  {
    id: "noir-tv-qled-55",
    name: "Noir QLED 55\" Studio",
    model: "N-QLED-55S",
    description: "55-inch QLED with anti-glare matte screen.",
    longDescription: "Quantum dot color and a true matte finish that defeats reflections in bright rooms.",
    specs: { Size: "55\"", Resolution: "4K UHD", "Refresh Rate": "120 Hz", HDR: "HDR10+" },
    features: ["Anti-glare matte", "Quantum dots", "Object tracking sound", "Ambient mode"],
    price: 1390,
    brand: "noir",
    category: "tv",
    images: [img("photo-1461151304267-38535e780c79"), img("photo-1593359677879-a4bb92f829d1")],
  },
  {
    id: "chrani-ac-multi",
    name: "Chrani Multi-Split System",
    model: "C-MSS-3X",
    description: "3-zone multi-split AC system with one outdoor unit.",
    longDescription: "Cool three rooms independently with a single outdoor condenser. Discrete, efficient, premium.",
    specs: { Zones: "3", "Total BTU": "36,000", SEER: "22" },
    features: ["3 independent zones", "Single condenser", "Whisper outdoor unit", "App scheduling"],
    price: 3450,
    brand: "chrani",
    category: "ac",
    images: [img("photo-1632935190508-bcd72d0f8a4c"), img("photo-1631545308456-c8f3a8e25c5b")],
  },
  {
    id: "hidden-test",
    name: "Hidden Product (should not appear)",
    model: "HIDDEN",
    description: "—",
    longDescription: "—",
    specs: {},
    features: [],
    price: 0,
    brand: "chrani",
    category: "tv",
    images: [],
    isHidden: true,
  },
];

export const visibleProducts = products.filter((p) => !p.isHidden);

export const serviceCenters = [
  { city: "Erbil", address: "100m Road, near Family Mall, Erbil", phone: "+964 750 000 0001", hours: "Sat–Thu, 9:00–19:00" },
  { city: "Sulaymaniyah", address: "Salim Street, opposite City Center, Sulaymaniyah", phone: "+964 750 000 0002", hours: "Sat–Thu, 9:00–19:00" },
  { city: "Duhok", address: "Nahro Street, Duhok", phone: "+964 750 000 0003", hours: "Sat–Thu, 9:00–18:00" },
  { city: "Baghdad", address: "Karrada, Baghdad", phone: "+964 750 000 0004", hours: "Sat–Thu, 9:00–18:00" },
];

export const manuals = [
  { id: "m1", title: "Chrani Pro 900 — User Manual", size: "4.2 MB", url: "#" },
  { id: "m2", title: "Lumen X7 SilentWash — Quick Start", size: "1.8 MB", url: "#" },
  { id: "m3", title: "Atelier Duet Oven — Recipe Guide", size: "6.1 MB", url: "#" },
  { id: "m4", title: "Noir Q Dishwasher — Installation", size: "2.4 MB", url: "#" },
  { id: "m5", title: "Vega Inverter AC — Maintenance", size: "1.2 MB", url: "#" },
];

export const tutorials = [
  { id: "t1", title: "Setting up your Chrani Pro 900", youtubeId: "dQw4w9WgXcQ" },
  { id: "t2", title: "Lumen X7 — first wash", youtubeId: "ScMzIvxBSi4" },
  { id: "t3", title: "Atelier Duet — sous-vide basics", youtubeId: "kXYiU_JCYtU" },
];

export const WHATSAPP_NUMBER = "9647500000000"; // placeholder

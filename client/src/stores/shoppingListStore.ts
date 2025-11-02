// Offline master shopping list store
export type ShopItem = {
  id: string;
  name: string;
  qty?: number;
  unit?: string;
  cat?: string;
  note?: string;
  checked?: boolean;
};

type Store = {
  items: ShopItem[];
  updatedAt: string;
  weekKey?: string;
};

export type Options = {
  groupByAisle: boolean;
  excludePantryStaples: boolean;
  rounding: "none" | "friendly";
  scopeByWeek: boolean;
};

const KEY = "shopping_list_master_v1";
const OPT_KEY = "shopping_list_options_v1";

const uid = () => `itm_${Math.random().toString(36).slice(2,10)}${Date.now().toString(36)}`;

// ---------- Options ----------
export function readOptions(): Options {
  try {
    const raw = localStorage.getItem(OPT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { groupByAisle: true, excludePantryStaples: false, rounding: "friendly", scopeByWeek: false };
}

export function writeOptions(next: Options) {
  try { localStorage.setItem(OPT_KEY, JSON.stringify(next)); } catch {}
  window.dispatchEvent(new Event("shopping:options:updated"));
}

// ---------- Week helpers ----------
export function getWeekKey(d = new Date()) {
  const dt = new Date(d);
  const day = dt.getDay(); // 0 Sun .. 6 Sat
  const diffToMon = (day + 6) % 7; // Monday=0
  dt.setDate(dt.getDate() - diffToMon);
  dt.setHours(0,0,0,0);
  return dt.toISOString().slice(0,10); // YYYY-MM-DD
}

export function setWeekScope(enabled: boolean) {
  const store = readList();
  writeList({ ...store, weekKey: enabled ? getWeekKey() : undefined });
}

// ---------- Pantry staples ----------
const PANTRY_STAPLES = new Set<string>([
  "Salt","Black Pepper","Olive Oil","Vegetable Oil","Cooking Spray","Sugar","Flour","Baking Powder","Baking Soda",
  "Soy Sauce","Vinegar","Apple Cider Vinegar","White Vinegar","Rice Vinegar","Hot Sauce","Ketchup","Mustard",
  "Garlic Powder","Onion Powder","Paprika","Cumin","Chili Powder","Oregano","Italian Seasoning","Cinnamon",
  "Coffee","Tea","Broth","Stock"
].map(s=>s.toLowerCase()));

export function isPantryStaple(name: string) {
  return PANTRY_STAPLES.has(name.trim().toLowerCase());
}

// ---------- Rounding ----------
function roundFriendly(qty?: number, unit?: string): { qty?: number; unit?: string } {
  if (qty == null || !Number.isFinite(qty)) return { qty, unit };
  const u = (unit || "").toLowerCase();

  if (u === "cup") return { qty: Math.round(qty * 4) / 4, unit };
  if (u === "tbsp" || u === "tsp") return { qty: Math.round(qty), unit };
  if (u === "lb") return { qty: Math.round(qty * 2) / 2, unit };
  if (u === "oz") return { qty: Math.round(qty), unit };
  if (u === "g") return { qty: Math.round(qty / 10) * 10, unit };
  if (u === "ml") return { qty: Math.round(qty / 10) * 10, unit };
  if (u === "l" || u === "kg") return { qty: Math.round(qty * 10) / 10, unit };

  return { qty: Math.round(qty), unit };
}

// ---------- Store operations ----------
export function readList(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { items: [], updatedAt: new Date().toISOString() };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.items)) return { items: [], updatedAt: new Date().toISOString() };
    return parsed;
  } catch {
    return { items: [], updatedAt: new Date().toISOString() };
  }
}

export function writeList(next: Store) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  window.dispatchEvent(new Event("shopping:list:updated"));
}

export function setItems(items: ShopItem[]) {
  const store = readList();
  writeList({ items, updatedAt: new Date().toISOString(), weekKey: store.weekKey });
}

export function addItems(newItems: Omit<ShopItem, "id">[]) {
  const opts = readOptions();
  const store = readList();

  // If weekly scoping is enabled and store has a different weekKey, reset to new week
  let base: Store = store;
  if (opts.scopeByWeek) {
    const wk = getWeekKey();
    if (store.weekKey !== wk) base = { items: [], updatedAt: new Date().toISOString(), weekKey: wk };
  }

  const cleaned = newItems
    .map(i => ({...i, name: normalizeName(i.name)}))
    .filter(i => !(opts.excludePantryStaples && isPantryStaple(i.name)));

  const merged = mergeItems([...base.items], cleaned.map(i => {
    const conv = convertQty(i.qty ?? 0, i.unit);
    const rounded = opts.rounding === "friendly" ? roundFriendly(conv.qty, conv.unit) : conv;
    return { ...i, qty: rounded.qty, unit: rounded.unit };
  }));

  writeList({ items: merged, updatedAt: new Date().toISOString(), weekKey: base.weekKey ?? (opts.scopeByWeek ? getWeekKey() : undefined) });
}

export function clearAll() {
  writeList({ items: [], updatedAt: new Date().toISOString() });
}

export function clearChecked() {
  const store = readList();
  const items = store.items.filter(i => !i.checked);
  writeList({ ...store, items });
}

export function toggleChecked(id: string, checked?: boolean) {
  const store = readList();
  const items = store.items.map(i => i.id === id ? { ...i, checked: checked ?? !i.checked } : i);
  writeList({ ...store, items });
}

export function deleteItems(ids: string[]) {
  const store = readList();
  const items = store.items.filter(i => !ids.includes(i.id));
  writeList({ ...store, items });
}

export function updateItem(id: string, patch: Partial<ShopItem>) {
  const store = readList();
  const items = store.items.map(i => i.id === id ? { ...i, ...patch, name: patch.name ? normalizeName(patch.name) : i.name } : i);
  writeList({ ...store, items });
}

// ---------- merging / normalization ----------
const NAME_ALIASES: Record<string,string> = {
  "bell pepper": "bell peppers",
  "scallion": "green onions",
  "yoghurt": "yogurt",
};

function normalizeName(n?: string) {
  if (!n) return "";
  let s = n.trim().toLowerCase();
  s = s.replace(/\s+/g, " ");
  s = s.replace(/^-\s*/, "");
  s = s.replace(/[•·] /, "");
  if (NAME_ALIASES[s]) s = NAME_ALIASES[s];
  return s.split(" ").map(w => w ? w[0].toUpperCase()+w.slice(1) : w).join(" ");
}

export function classify(name: string): string {
  const n = name.toLowerCase();
  if (/(lettuce|spinach|kale|broccoli|onion|garlic|pepper|tomato|cucumber|apple|banana|berries|lime|lemon|carrot|celery|mushroom|zucchini|squash|avocado)/.test(n)) return "Produce";
  if (/(chicken|beef|pork|turkey|salmon|tuna|shrimp|sausage|eggs|fish|steak|bacon)/.test(n)) return "Meat";
  if (/(milk|yogurt|cheese|butter|cream|cottage cheese|sour cream)/.test(n)) return "Dairy";
  if (/(bread|tortilla|rice|pasta|oats|flour|sugar|spice|salt|oil|vinegar|sauce|broth|beans|stock|quinoa)/.test(n)) return "Pantry";
  if (/(frozen|ice)/.test(n)) return "Frozen";
  if (/(wine|beer|soda|water|juice|tea|coffee)/.test(n)) return "Beverages";
  if (/(cake|cookie|muffin|bagel|croissant)/.test(n)) return "Bakery";
  return "Pantry";
}

export function normalizeUnit(u?: string) {
  if (!u) return undefined;
  const s = u.trim().toLowerCase();
  const map: Record<string,string> = {
    tsp: "tsp", teaspoon: "tsp", teaspoons: "tsp",
    tbsp: "Tbsp", tbs: "Tbsp", tablespoon: "Tbsp", tablespoons: "Tbsp",
    cup: "cup", cups: "cup",
    "fl oz": "fl oz", floz: "fl oz", ounce: "oz", ounces: "oz", oz: "oz",
    pound: "lb", pounds: "lb", lbs: "lb", lb: "lb",
    g: "g", gram: "g", grams: "g",
    kg: "kg", kilogram: "kg", kilograms: "kg",
    ml: "ml", milliliter: "ml", milliliters: "ml",
    l: "L", liter: "L", liters: "L",
    head: "head", heads: "head", clove: "clove", cloves: "clove",
    whole: "whole", piece: "piece", pieces: "piece"
  };
  return map[s] ?? u;
}

export function convertQty(qty: number, unit?: string): { qty: number; unit?: string } {
  const u = normalizeUnit(unit);
  if (u === "tsp" && qty >= 3) { return { qty: +(qty/3).toFixed(2), unit: "Tbsp" }; }
  if (u === "Tbsp" && qty >= 16) { return { qty: +(qty/16).toFixed(2), unit: "cup" }; }
  if (u === "oz" && qty >= 16) { return { qty: +(qty/16).toFixed(2), unit: "lb" }; }
  if (u === "g" && qty >= 1000) { return { qty: +(qty/1000).toFixed(2), unit: "kg" }; }
  if (u === "ml" && qty >= 1000) { return { qty: +(qty/1000).toFixed(2), unit: "L" }; }
  return { qty, unit: u };
}

export function mergeItems(existing: ShopItem[], incoming: Omit<ShopItem,"id">[]): ShopItem[] {
  const out = [...existing];
  for (const raw of incoming) {
    const name = normalizeName(raw.name);
    const unit = normalizeUnit(raw.unit);
    const cat = raw.cat ?? classify(name);
    const note = raw.note?.trim();
    const qty = (raw.qty ?? 0) || undefined;

    const i = out.findIndex(x =>
      x.name.toLowerCase() === name.toLowerCase() &&
      (x.unit ?? "") === (unit ?? "")
    );

    if (i === -1) {
      out.push({
        id: uid(),
        name,
        qty,
        unit,
        cat,
        note,
        checked: false
      });
    } else {
      const cur = out[i];
      const nextQty = (cur.qty ?? 0) + (qty ?? 0);
      let { qty: q2, unit: u2 } = convertQty(nextQty, unit ?? cur.unit);
      out[i] = {
        ...cur,
        qty: q2,
        unit: u2,
        note: cur.note || note,
        cat: cur.cat || cat
      };
    }
  }
  out.sort((a,b) => (a.cat||"").localeCompare(b.cat||"") || a.name.localeCompare(b.name));
  return out;
}

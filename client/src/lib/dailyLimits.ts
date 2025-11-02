export type DailyLimits = {
  date: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type MacroTargets = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

const LS_KEY = (userId?: string) => `mpm.dailyLimits.${userId ?? "anon"}`;
const TARGETS_KEY = (userId?: string) => `mpm.macroTargets.${userId ?? "anon"}`;

// NEW: Persistent macro targets (not date-specific - stays until you change it)
export function setMacroTargets(targets: MacroTargets, userId?: string) {
  const key = TARGETS_KEY(userId);
  localStorage.setItem(key, JSON.stringify(targets));
}

export function getMacroTargets(userId?: string): MacroTargets | null {
  const key = TARGETS_KEY(userId);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

// OLD: Date-specific limits (kept for backward compatibility)
export function setDailyLimits(limits: DailyLimits, userId?: string) {
  const key = LS_KEY(userId);
  const map: Record<string, DailyLimits> = JSON.parse(localStorage.getItem(key) || "{}");
  map[limits.date] = limits;
  localStorage.setItem(key, JSON.stringify(map));
}

export function getDailyLimits(date: string, userId?: string): DailyLimits | null {
  const key = LS_KEY(userId);
  const map: Record<string, DailyLimits> = JSON.parse(localStorage.getItem(key) || "{}");
  return map[date] ?? null;
}

import { z } from "zod";

// Meal schema with all fields
export const MealSchema = z.object({
  id: z.string(),
  title: z.string(),
  servings: z.number(),
  ingredients: z.array(
    z.object({
      item: z.string(),
      amount: z.string().optional(),
    })
  ),
  instructions: z.array(z.string()),
  nutrition: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  badges: z.array(z.string()).optional(),
  technique: z.string().optional(),
  cuisine: z.string().optional(),
  orderIndex: z.number().optional(),
  name: z.string().optional(),
  entryType: z.enum(["quick", "recipe"]).optional(),
  brand: z.string().optional(),
  servingDesc: z.string().optional(),
  includeInShoppingList: z.boolean().optional(),
});

export type Meal = z.infer<typeof MealSchema>;

// Day lists schema
export const DayListsSchema = z.object({
  breakfast: z.array(MealSchema),
  lunch: z.array(MealSchema),
  dinner: z.array(MealSchema),
  snacks: z.array(MealSchema),
});

export type DayLists = z.infer<typeof DayListsSchema>;

// Week board schema
export const WeekBoardSchema = z.object({
  id: z.string(),
  version: z.number(),
  lists: DayListsSchema,
  days: z.record(z.string(), DayListsSchema).optional(),
  meta: z.object({
    createdAt: z.string(),
    lastUpdatedAt: z.string(),
    excludedItems: z.array(z.string()).optional(),
  }),
});

export type WeekBoard = z.infer<typeof WeekBoardSchema>;

// API response schema
export const WeekBoardResponseSchema = z.object({
  weekStartISO: z.string(),
  week: WeekBoardSchema,
  source: z.enum(["db", "cache", "seed"]).optional(),
});

export type WeekBoardResponse = z.infer<typeof WeekBoardResponseSchema>;

// Helper to create deterministic empty week structure
export function createEmptyWeekStructure(weekStartISO: string): WeekBoardResponse {
  const startDate = new Date(weekStartISO + "T00:00:00Z");
  const days: Record<string, DayLists> = {};

  // Generate 7 days (Mon-Sun)
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + i);
    const dateISO = date.toISOString().slice(0, 10);
    days[dateISO] = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
  }

  const now = new Date().toISOString();
  const firstDay = Object.values(days)[0];

  return {
    weekStartISO,
    week: {
      id: `week-${weekStartISO}`,
      version: 1,
      lists: firstDay,
      days,
      meta: {
        createdAt: now,
        lastUpdatedAt: now,
      },
    },
    source: "seed",
  };
}

// ISO week calculation
export function getWeekId(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((d.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

// Get Monday of current week
export function getMondayISO(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Mon=0, Sun=6
  d.setUTCDate(d.getUTCDate() - dayNum);
  return d.toISOString().slice(0, 10);
}

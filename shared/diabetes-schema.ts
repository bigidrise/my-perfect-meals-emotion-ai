import { pgTable, uuid, text, integer, timestamp, boolean, jsonb, numeric, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const diabetesTypeEnum = pgEnum("diabetes_type", ["NONE", "T1D", "T2D"]);
export const glucoseContextEnum = pgEnum("glucose_context", [
  "FASTED",
  "PRE_MEAL",
  "POST_MEAL_1H",
  "POST_MEAL_2H",
  "RANDOM",
]);

export const diabetesProfile = pgTable("diabetes_profile", {
  userId: uuid("user_id").primaryKey(),
  type: diabetesTypeEnum("type").notNull().default("NONE"),
  medications: jsonb("medications").$type<{ name: string; dose?: string }[] | null>().default(null),
  hypoHistory: boolean("hypo_history").notNull().default(false),
  a1cPercent: numeric("a1c_percent", { precision: 4, scale: 1 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const glucoseLogs = pgTable("glucose_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  valueMgdl: integer("value_mgdl").notNull(),
  context: glucoseContextEnum("context").notNull(),
  relatedMealId: uuid("related_meal_id"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  insulinUnits: numeric("insulin_units", { precision: 5, scale: 1 }),
  notes: text("notes"),
});

// Optional basic labs (alpha-minimal)
export const labs = pgTable("labs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  type: text("type").notNull(), // e.g., A1C, FASTING_GLUCOSE, LDL, eGFR, TSH
  value: numeric("value", { precision: 8, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  collectedAt: timestamp("collected_at", { withTimezone: true }).notNull(),
  notes: text("notes"),
});

// ========================================
// Zod Schemas & TypeScript Types
// ========================================

export const insertGlucoseLogSchema = createInsertSchema(glucoseLogs, {
  valueMgdl: z.number().int().min(20).max(600),
  context: z.enum(["FASTED", "PRE_MEAL", "POST_MEAL_1H", "POST_MEAL_2H", "RANDOM"]),
  userId: z.string().uuid(),
  relatedMealId: z.string().uuid().optional(),
  insulinUnits: z.number().optional(),
  notes: z.string().optional(),
}).omit({ id: true, recordedAt: true });

export type InsertGlucoseLog = z.infer<typeof insertGlucoseLogSchema>;
export type GlucoseLog = typeof glucoseLogs.$inferSelect;
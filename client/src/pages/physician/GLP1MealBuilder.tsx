import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  UtensilsCrossed,
  Check,
  AlertTriangle,
} from "lucide-react";
import TrashButton from "@/components/ui/TrashButton";
import MacroBridgeButton from "@/components/biometrics/MacroBridgeButton";
import HealthBadgesPopover from "@/components/badges/HealthBadgesPopover";
import { MacroBridgeFooter } from "@/components/biometrics/MacroBridgeFooter";
import ShoppingAggregateBar from "@/components/ShoppingAggregateBar";
import { normalizeIngredients } from "@/utils/ingredientParser";
import { FeatureInstructions } from "@/components/FeatureInstructions";
import { AddOwnMealButton } from "@/components/pickers/AddOwnMealButton";

// Glass cards
import {
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle,
} from "@/components/glass/GlassCard";

// Import BuilderDayBoard types
import BuilderDayBoard from "@/components/BuilderDayBoard";
import type { PlanDay, BuilderPlanJSON } from "@/lib/builderPlansApi";
import { useBuilderPlan } from "@/hooks/useBuilderPlan";

// APIs
import { addBulkMacros, logMacrosToBiometrics } from "@/lib/macrosApi";
import { fetchLabRules } from "@/lib/labsClient";
import type { LabRules } from "@/lib/labsClient";

// GLP-1 data
import { glp1Meals, type GLP1Meal } from "@/data/GLP1MealsData";

// ===== Local "Smart-like" types & helpers (to mirror Smart builder) =====
// Fixed mode for GLP-1 users (no scaling needed - weight loss meds)
type Mode = "maintain";

type SmartishMeal = {
  id: string;
  name: string;
  macros: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  badges?: string[];
  // match Smart ingredient shape: { item, amount?: string }
  ingredients?: Array<{ item: string; amount?: string }>;
  instructions?: string[];
};

type DaySlots = {
  breakfast?: SmartishMeal;
  lunch?: SmartishMeal;
  dinner?: SmartishMeal;
  snack?: SmartishMeal;
};

// Convert DaySlots to PlanDay lists format
function toPlanDayLists(daySlots: DaySlots): PlanDay["lists"] {
  const toMealArray = (meal?: SmartishMeal) => meal ? [{
    id: meal.id,
    name: meal.name,
    servings: 1,
    ingredients: meal.ingredients?.map(ing => ({
      name: ing.item,
      quantity: ing.amount || "1",
      unit: ""
    })) || [],
    instructions: meal.instructions || [],
    nutrition: {
      calories: meal.macros.calories,
      protein: meal.macros.protein_g,
      carbs: meal.macros.carbs_g,
      fat: meal.macros.fat_g
    }
  }] : [];

  return {
    breakfast: toMealArray(daySlots.breakfast),
    lunch: toMealArray(daySlots.lunch),
    dinner: toMealArray(daySlots.dinner),
    snacks: toMealArray(daySlots.snack),
  };
}

// Make a 1–7 day draft from current plan
function makeDraftFromPlan(daySlots: DaySlots, daysCount: number): BuilderPlanJSON {
  const lists = toPlanDayLists(daySlots);
  const n = Math.min(7, Math.max(1, daysCount || 1));
  return {
    source: "glp1",
    createdAtISO: new Date().toISOString(),
    days: Array.from({ length: n }, (_, i) => ({
      dayIndex: i,
      lists: structuredClone(lists),
    })),
  };
}

// Create empty plan with blank day slots (no meals)
function createEmptyPlan(daysCount: number): BuilderPlanJSON {
  const n = Math.min(7, Math.max(1, daysCount || 1));
  const emptyLists: PlanDay["lists"] = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };
  return {
    source: "glp1",
    createdAtISO: new Date().toISOString(),
    days: Array.from({ length: n }, (_, i) => ({
      dayIndex: i,
      lists: structuredClone(emptyLists),
    })),
  };
}

const UI_VERSION = "glp1-2025-09-30-01";

// Mock DEV_USER_ID for local testing - replace with actual user ID in production
const DEV_USER_ID = "test-user-123";

// Round to clean strings for ingredient "amount" fields
function formatQty(q: number) {
  const s = Number.isInteger(q) ? String(q) : (Math.round(q * 10) / 10).toString();
  return s;
}
function pluralize(unit: string | undefined, qty: number): string | undefined {
  if (!unit) return unit;
  const u = unit.trim();
  if (qty === 1) return u.replace(/s$/i, "");
  if (!/s$/i.test(u) && !/(oz|ml|g|kg|lb)$/i.test(u)) return `${u}s`;
  return u;
}

// Map GLP1Meal -> SmartishMeal (badges, macros, ingredients text, etc.)
function mapGLP1(meal: GLP1Meal): SmartishMeal {
  const macros = {
    calories: meal.nutrition?.calories ?? 0,
    protein_g: meal.nutrition?.protein ?? 0,
    carbs_g: meal.nutrition?.carbs ?? 0,
    fat_g: meal.nutrition?.fat ?? 0,
  };
  const ingredients =
    meal.ingredients?.map((ing) => {
      const qty = typeof ing.quantity === "number" ? formatQty(ing.quantity) : "";
      const u = pluralize(ing.unit, Number(ing.quantity ?? 0));
      const amount = [qty, u].filter(Boolean).join(" ").trim() || undefined;
      return { item: ing.item, amount };
    }) ?? [];

  return {
    id: meal.id,
    name: meal.name,
    macros,
    badges: meal.healthBadges ?? [],
    ingredients,
    instructions: meal.instructions ?? [],
  };
}

// Split GLP-1 list by category to mirror Smart menus
function useGLP1Buckets() {
  return useMemo(() => {
    const mapped = glp1Meals.map(mapGLP1);
    const pick = (cat: string) =>
      mapped.filter((m) =>
        (glp1Meals.find((g) => g.id === m.id)?.category ?? "").toLowerCase() ===
        cat.toLowerCase()
      );
    return {
      breakfast: pick("breakfast"),
      lunch: pick("lunch"),
      dinner: pick("dinner"),
      snack: pick("snack"),
    };
  }, []);
}

// Nutrition scaling (GLP-1 users always maintain - no scaling)
function scaleNutrition(n: SmartishMeal["macros"], mode: Mode) {
  const factor = 1.0;
  const round = (x: number) => Math.round(x);
  return {
    calories: round(n.calories * factor),
    protein_g: round(n.protein_g * factor),
    carbs_g: round(n.carbs_g * factor),
    fat_g: round(n.fat_g * factor),
  };
}


// UI row used inside the collapsible menus
function MealRow({
  meal,
  mode,
  slot,
  isSelected,
  onAdd,
}: {
  meal: SmartishMeal;
  mode: Mode;
  slot: keyof DaySlots;
  isSelected: boolean;
  onAdd: (m: SmartishMeal) => void;
}) {
  const n = scaleNutrition(meal.macros, mode);

  return (
    <GlassCard className="bg-black/30 border border-white/20 overflow-hidden rounded-2xl mb-3">
      <GlassCardContent className="p-3 grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium">{meal.name}</div>
            <div className="text-xs text-white/60">
              {n.calories} kcal • P{n.protein_g} C{n.carbs_g} F{n.fat_g}
            </div>
            <HealthBadgesPopover badges={meal.badges} className="mt-2" />
          </div>

          {isSelected ? (
            <Button
              size="sm"
              className="bg-emerald-600/20 border border-emerald-400/40 text-emerald-200 cursor-default shrink-0"
              disabled
            >
              <Check className="h-4 w-4 mr-1" />
              Added
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white shrink-0"
              onClick={() => onAdd(meal)}
              title={`Add to ${slot}`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>

        {/* Add to Macros Button */}
        <MacroBridgeButton
          meal={{
            protein: n.protein_g || 0,
            carbs: n.carbs_g || 0,
            fat: n.fat_g || 0,
            calories: n.calories || 0,
            dateISO: new Date().toISOString().slice(0, 10),
            mealSlot: slot as 'breakfast' | 'lunch' | 'dinner' | 'snack',
            servings: 1,
          }}
          label="Add to Macros"
          source="glp1-menu-builder"
        />
      </GlassCardContent>
    </GlassCard>
  );
}

/** Card used in "Today's Plan" — text-only: name, macros, badges, ingredients, instructions */
function LocalMealCard({
  slotLabel,
  meal,
  mode,
  onRemove,
}: {
  slotLabel: string;
  meal: SmartishMeal;
  mode: Mode;
  onRemove: () => void;
}) {
  const n = scaleNutrition(meal.macros, mode);
  const ingredients = meal.ingredients || [];
  const steps = meal.instructions || [];

  return (
    <GlassCard className="bg-black/30 border border-white/20 overflow-hidden rounded-2xl">
      <GlassCardHeader className="py-2 bg-black/20 backdrop-blur-none border-b border-white/10">
        <GlassCardTitle className="text-white text-base flex items-center justify-between">
          <span className="capitalize">{slotLabel}</span>
          <TrashButton
            onClick={onRemove}
            size="sm"
            confirm={true}
            confirmMessage={`Remove this ${slotLabel} from the plan?`}
            ariaLabel={`Remove ${slotLabel}`}
            title={`Remove ${slotLabel}`}
            data-testid={`button-remove-${slotLabel}`}
          />
        </GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent className="grid gap-3">
        <div>
          <div className="font-medium text-white">{meal.name}</div>
          <div className="text-xs text-white/70">
            <div>
              <strong>{n.calories} calories</strong>
            </div>
            <div>
              Protein: {n.protein_g}g • Carbs: {n.carbs_g}g • Fat: {n.fat_g}g
            </div>
          </div>
          <HealthBadgesPopover badges={meal.badges} className="mt-3" />
        </div>

        {/* Ingredients */}
        {!!ingredients.length && (
          <div>
            <div className="font-semibold text-white text-sm mb-1">Ingredients</div>
            <ul className="text-white/80 text-sm list-disc pl-5 space-y-0.5">
              {ingredients.map((ing, idx) => (
                <li key={idx}>
                  {ing.item}
                  {ing.amount ? ` — ${ing.amount}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        {!!steps.length && (
          <div>
            <div className="font-semibold text-white text-sm mb-1">Instructions</div>
            <ol className="text-white/80 text-sm list-decimal pl-5 space-y-0.5">
              {steps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Add to Macros Button */}
        <MacroBridgeButton
          meal={{
            protein: n.protein_g || 0,
            carbs: n.carbs_g || 0,
            fat: n.fat_g || 0,
            calories: n.calories || 0,
            dateISO: new Date().toISOString().slice(0, 10),
            mealSlot: slotLabel as 'breakfast' | 'lunch' | 'dinner' | 'snack',
            servings: 1,
          }}
          label="Add to Macros"
          source="glp1-menu-builder"
        />
      </GlassCardContent>
    </GlassCard>
  );
}

// Bulk helpers (identical behavior)
function sumTotals(meals: SmartishMeal[]) {
  return meals.reduce(
    (t, m) => {
      t.calories += m.macros.calories || 0;
      t.protein += m.macros.protein_g || 0;
      t.carbs += m.macros.carbs_g || 0;
      t.fat += m.macros.fat_g || 0;
      return t;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}
function collectIngredients(meals: SmartishMeal[]) {
  const map = new Map<string, { item: string; qty: number; unit?: string }>();
  for (const m of meals) {
    const list = Array.isArray(m.ingredients) ? m.ingredients : [];
    for (const ing of list) {
      const key = String(ing.item || "").trim().toLowerCase();
      if (!key) continue;
      const prev = map.get(key);
      const qty = 1;
      if (prev) prev.qty += qty;
      else map.set(key, { item: ing.item!, qty, unit: ing.amount || "" });
    }
  }
  return Array.from(map.values());
}

// Page shell style
const CARD_SHELL =
  "bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl p-4";

// ======================= PAGE =======================
export default function GLP1MealBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { query, save, update } = useBuilderPlan("glp1");

  // Fixed mode for GLP-1 users (no scaling needed)
  const mode: Mode = "maintain";

  // Load Today's Plan from localStorage on mount (lazy initializer)
  const [plan, setPlan] = useState<DaySlots>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem("glp1-today-plan");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [labRules, setLabRules] = useState<LabRules | null>(null);
  const [labAware, setLabAware] = useState(false);

  // Save Today's Plan to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem("glp1-today-plan", JSON.stringify(plan));
    } catch (err) {
      console.error("Failed to save GLP-1 Today's Plan:", err);
    }
  }, [plan]);

  // Draft state for BuilderDayBoard
  const [daysCount, setDaysCount] = useState(3);

  // Auto-generate draft - populate with selected meals if any, otherwise blank days
  const draft = useMemo<BuilderPlanJSON>(() => {
    const hasAnyMeal = !!(plan.breakfast || plan.lunch || plan.dinner || plan.snack);
    if (hasAnyMeal) {
      // User has selected meals - populate all days with these meals
      return makeDraftFromPlan(plan, daysCount);
    }
    // No meals selected - show blank day structure
    return createEmptyPlan(daysCount);
  }, [plan, daysCount]);

  const { breakfast, lunch, dinner, snack } = useGLP1Buckets();

  // Collapsible refs
  const breakfastRef = useRef<HTMLDetailsElement>(null);
  const lunchRef = useRef<HTMLDetailsElement>(null);
  const dinnerRef = useRef<HTMLDetailsElement>(null);
  const snacksRef = useRef<HTMLDetailsElement>(null);

  const collapseAllMenus = () => {
    if (breakfastRef.current) breakfastRef.current.removeAttribute("open");
    if (lunchRef.current) lunchRef.current.removeAttribute("open");
    if (dinnerRef.current) dinnerRef.current.removeAttribute("open");
    if (snacksRef.current) snacksRef.current.removeAttribute("open");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "GLP-1 Menu Builder | My Perfect Meals";
    (async () => {
      const rules = await fetchLabRules();
      setLabRules(rules);
      setLabAware(!!rules);
    })();
  }, []);

  // Lab rules scoring identical to Smart
  function applyLabRules(list: SmartishMeal[]): SmartishMeal[] {
    if (!labRules) return list;
    const inc = new Set(labRules.includeBadges.map((b) => b.toLowerCase()));
    const exc = new Set(labRules.excludeTags.map((t) => t.toLowerCase()));
    const scored = list.map((m) => {
      const badges = (m.badges || []).map((b) => b.toLowerCase());
      let score = 0;
      for (const b of badges) if (inc.has(b)) score += 2;
      for (const b of badges) if (exc.has(b)) score -= 2;
      return { m, score };
    });
    return scored.sort((a, b) => b.score - a.score).map((x) => x.m);
  }

  const total = useMemo(() => {
    const slots = ["breakfast", "lunch", "dinner", "snack"] as const;
    return slots.reduce(
      (acc, s) => {
        const m = plan[s];
        if (!m) return acc;
        const n = scaleNutrition(m.macros, mode);
        acc.calories += n.calories;
        acc.protein += n.protein_g;
        acc.carbs += n.carbs_g;
        acc.fat += n.fat_g;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [plan, mode]);

  const setSlot = (slot: keyof DaySlots, meal: SmartishMeal) => {
    setPlan((p) => ({ ...p, [slot]: meal }));
    toast({ title: "Added", description: `${meal.name} added to ${slot}.` });
    collapseAllMenus();
  };
  function removeSlot(slot: keyof DaySlots) {
    setPlan((p) => {
      const next = { ...p };
      delete next[slot];
      return next;
    });
  }

  // Log meal to macros/biometrics using the same system as craving creator
  async function handleLogToMacros(meal: any) {
    try {
      const mealData = {
        id: meal.id || `glp1-${Date.now()}`,
        name: meal.name || "GLP-1 Meal",
        nutrition: {
          calories: meal.calories || 0,
          protein_g: meal.protein || 0,
          carbs_g: meal.carbs || 0,
          fat_g: meal.fat || 0,
        },
      };

      // Use proper UTC timestamp (no manual timezone offset)
      const loggedAt = new Date().toISOString();

      const payload = {
        loggedAt,
        mealType: undefined, // Let user specify if needed
        kcal: Math.round(mealData.nutrition.calories),
        protein: Math.round(mealData.nutrition.protein_g),
        carbs: Math.round(mealData.nutrition.carbs_g),
        fat: Math.round(mealData.nutrition.fat_g),
        source: "glp1" as const,
        mealId: mealData.id,
      };

      console.log("🔸 GLP-1 macro logging payload:", payload);

      const { post } = await import("@/lib/api");
      await post(`/api/users/${DEV_USER_ID}/food-logs`, payload);

      // Trigger macro refresh in Biometrics dashboard
      window.dispatchEvent(new Event("macros:updated"));

      toast({
        title: "✅ Added to Macros!",
        description: `${mealData.name} has been logged to your daily macros and biometrics.`,
      });
    } catch (error: any) {
      console.error("Failed to log to macros:", error);
      toast({
        title: "❌ Failed to Log",
        description: "Could not add to macros. Please try again.",
        variant: "destructive",
      });
    }
  }

  function handleClearPlan() {
    setPlan({});
    toast({ title: "Plan cleared", description: "All meals removed from your plan." });
  }

  const clientId = localStorage.getItem("pro-client-id");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-32">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocation("/dashboard")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-white hover:bg-white/20 bg-black/30 border border-white/20 rounded-2xl p-3 shadow-lg"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      {clientId && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation(`/pro/clients/${clientId}`)}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 text-white hover:bg-white/20 bg-black/30 border border-white/20 rounded-2xl p-3 shadow-lg"
          data-testid="button-client-dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Client Dashboard</span>
        </Button>
      )}

      <div className="container mx-auto p-4 max-w-6xl space-y-6 pt-16">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-none border border-white/20 rounded-2xl p-4 shadow-lg">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-white">GLP-1 Menu Builder</h1>
            <p className="text-white text-xl opacity-90 mb-2">
              Small-portion, high-calorie, high-nutrient meals tailored for GLP-1 users
            </p>
            <p className="text-white text-lg opacity-75">
              Choose from breakfast, lunch, dinner, and snack options and build Today's Plan
            </p>
          </div>

          <FeatureInstructions
            steps={[
              "Step 1: Go to Macro Calculator → calculate your macros → click 'Set as Today's Limits' (purple button)",
              "Step 2: Return here to browse GLP-1 optimized meals (small portions, high nutrition, easy on digestion)",
              "Step 3: For each meal slot (Breakfast, Lunch, Dinner, Snacks): Click 'Show options' to browse GLP-1 meals OR click the '+' button to add your own custom meal",
              "Step 4: Click green 'Add' button on meals you want - portions are pre-optimized for GLP-1 users",
              "Step 5: Use 'Add to Macros' button on each meal to send individual meals to Biometrics page",
              "Step 6: Click 'Send Entire Day to Macros' at the bottom to log your complete day",
              "Step 7: Choose number of days (1-7) and click 'Create Menu' to save as a multi-day plan",
              "Step 8: Use 'Add & View List' button at bottom to send all ingredients to your Shopping List"
            ]}
          />
        </div>

        {/* Health-Aware Banner */}
        {labAware && labRules && (
          <div className="bg-emerald-500/10 border border-emerald-400/40 text-emerald-200 rounded-xl p-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <div>
                <strong>Health-aware choices enabled.</strong> We're prioritizing meals for your lab profile
                {labRules.includeBadges.length ? ` (focus: ${labRules.includeBadges.join(", ")})` : ""}.
              </div>
            </div>
          </div>
        )}

        {/* Menus */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Breakfast */}
          <GlassCard className={CARD_SHELL}>
            <GlassCardHeader className="p-0 mb-2 flex items-center justify-between">
              <GlassCardTitle className="text-white text-lg">Breakfast ({breakfast.length})</GlassCardTitle>
              <AddOwnMealButton slot="breakfast" onSave={(meal) => setSlot("breakfast", meal)} variant="icon" />
            </GlassCardHeader>
            <GlassCardContent className="p-0">
              <details ref={breakfastRef} className="mb-2">
                <summary className="cursor-pointer text-white/80">Show options</summary>
                <div
                  key={`breakfast-${UI_VERSION}`}
                  className="mt-3 w-full max-h-[60vh] overflow-y-auto pr-2 sm:max-h-none"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {applyLabRules(breakfast).map((meal) => (
                    <MealRow
                      key={meal.id}
                      meal={meal}
                      mode={mode}
                      slot="breakfast"
                      isSelected={plan.breakfast?.id === meal.id}
                      onAdd={(m) => setSlot("breakfast", m)}
                    />
                  ))}
                </div>
              </details>
            </GlassCardContent>
          </GlassCard>

          {/* Lunch */}
          <GlassCard className={CARD_SHELL}>
            <GlassCardHeader className="p-0 mb-2 flex items-center justify-between">
              <GlassCardTitle className="text-white text-lg">Lunch ({lunch.length})</GlassCardTitle>
              <AddOwnMealButton slot="lunch" onSave={(meal) => setSlot("lunch", meal)} variant="icon" />
            </GlassCardHeader>
            <GlassCardContent className="p-0">
              <details ref={lunchRef} className="mb-2">
                <summary className="cursor-pointer text-white/80">Show options</summary>
                <div
                  key={`lunch-${UI_VERSION}`}
                  className="mt-3 w-full max-h-[60vh] overflow-y-auto pr-2 sm:max-h-none"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {applyLabRules(lunch).map((meal) => (
                    <MealRow
                      key={meal.id}
                      meal={meal}
                      mode={mode}
                      slot="lunch"
                      isSelected={plan.lunch?.id === meal.id}
                      onAdd={(m) => setSlot("lunch", m)}
                    />
                  ))}
                </div>
              </details>
            </GlassCardContent>
          </GlassCard>

          {/* Dinner */}
          <GlassCard className={CARD_SHELL}>
            <GlassCardHeader className="p-0 mb-2 flex items-center justify-between">
              <GlassCardTitle className="text-white text-lg">Dinner ({dinner.length})</GlassCardTitle>
              <AddOwnMealButton slot="dinner" onSave={(meal) => setSlot("dinner", meal)} variant="icon" />
            </GlassCardHeader>
            <GlassCardContent className="p-0">
              <details ref={dinnerRef} className="mb-2">
                <summary className="cursor-pointer text-white/80">Show options</summary>
                <div
                  key={`dinner-${UI_VERSION}`}
                  className="mt-3 w-full max-h-[60vh] overflow-y-auto pr-2 sm:max-h-none"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {applyLabRules(dinner).map((meal) => (
                    <MealRow
                      key={meal.id}
                      meal={meal}
                      mode={mode}
                      slot="dinner"
                      isSelected={plan.dinner?.id === meal.id}
                      onAdd={(m) => setSlot("dinner", m)}
                    />
                  ))}
                </div>
              </details>
            </GlassCardContent>
          </GlassCard>

          {/* Snacks */}
          <GlassCard className={CARD_SHELL}>
            <GlassCardHeader className="p-0 mb-2 flex items-center justify-between">
              <GlassCardTitle className="text-white text-lg">Snacks ({snack.length})</GlassCardTitle>
              <AddOwnMealButton slot="snack" onSave={(meal) => setSlot("snack", meal)} variant="icon" />
            </GlassCardHeader>
            <GlassCardContent className="p-0">
              <details ref={snacksRef} className="mb-2">
                <summary className="cursor-pointer text-white/80">Show options</summary>
                <div
                  key={`snack-${UI_VERSION}`}
                  className="mt-3 w-full max-h-[60vh] overflow-y-auto pr-2 sm:max-h-none"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {applyLabRules(snack).map((meal) => (
                    <MealRow
                      key={meal.id}
                      meal={meal}
                      mode={mode}
                      slot="snack"
                      isSelected={plan.snack?.id === meal.id}
                      onAdd={(m) => setSlot("snack", m)}
                    />
                  ))}
                </div>
              </details>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Today's Plan */}
        <GlassCard className="bg-black/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
          <GlassCardHeader className="p-4 mb-2 bg-black/20 backdrop-blur-lg border-b border-white/10">
            <GlassCardTitle className="text-white/90 text-lg font-semibold flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              Today's Plan
            </GlassCardTitle>
          </GlassCardHeader>

          <GlassCardContent className="grid gap-4 max-h-[56vh] overflow-auto sm:max-h-none">
            {plan.breakfast && (
              <LocalMealCard
                slotLabel="breakfast"
                meal={plan.breakfast}
                mode={mode}
                onRemove={() => removeSlot("breakfast")}
              />
            )}
            {plan.lunch && (
              <LocalMealCard
                slotLabel="lunch"
                meal={plan.lunch}
                mode={mode}
                onRemove={() => removeSlot("lunch")}
              />
            )}
            {plan.dinner && (
              <LocalMealCard
                slotLabel="dinner"
                meal={plan.dinner}
                mode={mode}
                onRemove={() => removeSlot("dinner")}
              />
            )}
            {plan.snack && (
              <LocalMealCard
                slotLabel="snack"
                meal={plan.snack}
                mode={mode}
                onRemove={() => removeSlot("snack")}
              />
            )}

            {!plan.breakfast && !plan.lunch && !plan.dinner && !plan.snack && (
              <div className="text-center py-8 text-white/60">
                <UtensilsCrossed className="h-8 w-8 mx-auto mb-2" />
                <p>No meals selected yet. Choose meals from the options above to build your plan.</p>
              </div>
            )}
          </GlassCardContent>

          {/* MacroBridge Footer */}
          {(plan.breakfast || plan.lunch || plan.dinner || plan.snack) && (
            <div className="px-4 pb-4">
              <MacroBridgeFooter
                items={Object.values(plan).filter(Boolean).map(meal => {
                  const n = scaleNutrition(meal.macros, mode);
                  return {
                    protein: n.protein_g,
                    carbs: n.carbs_g,
                    fat: n.fat_g,
                    calories: n.calories,
                  };
                })}
                dateISO={new Date().toISOString().slice(0, 10)}
                mealSlot={null}
                variant="day"
                source="glp1-menu-builder"
              />
            </div>
          )}
        </GlassCard>

        <p className="text-xs text-white/60 text-center">

        </p>
      </div>

      {/* Persistent Day Board */}
      <div className="mt-8">
        {/* Day Count Selector */}
        <GlassCard className="bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-4">
            <Label className="text-white/80">Generate plan for:</Label>
            <Select value={daysCount.toString()} onValueChange={(v) => setDaysCount(+v)}>
              <SelectTrigger className="bg-black/50 text-white w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7].map(n => (
                  <SelectItem key={n} value={n.toString()}>
                    {n} day{n>1?"s":""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-white/60">
              Generate plan for 1-7 days.
            </div>
          </div>
        </GlassCard>

        <BuilderDayBoard 
          builderKey="glp1" 
          draft={draft}
          draftLabel="Create Menu"
          header="Your GLP-1 Menu Plan"
        />
      </div>

      {/* Shopping Aggregate Bar */}
      <ShoppingAggregateBar
        ingredients={Object.values(plan).filter(Boolean).flatMap(meal => 
          normalizeIngredients(meal.ingredients || [])
        )}
        source="GLP-1 Meal Builder"
      />
    </div>
  );
}
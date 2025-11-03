import React from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Meal } from "@/components/MealCard";
import {
  getAthleteMealsByCategory,
  type AthleteMeal,
} from "@/data/athleteMeals";

// 🔄 Convert AthleteMeal to standard Meal
function convertAthleteMealToMeal(athleteMeal: AthleteMeal): Meal {
  const ingredients = [
    {
      item: athleteMeal.protein_source,
      amount: `${athleteMeal.protein_oz} oz`,
    },
    ...(athleteMeal.carb_source
      ? [{ item: athleteMeal.carb_source, amount: `${athleteMeal.carb_g}g` }]
      : []),
    ...athleteMeal.fibrous_source.map((veg: string) => ({
      item: veg,
      amount: "1 cup",
    })),
  ];

  const instructions = [
    `Grill or bake ${athleteMeal.protein_source} (${athleteMeal.protein_oz}oz)`,
    ...(athleteMeal.carb_source
      ? [`Prepare ${athleteMeal.carb_source} (${athleteMeal.carb_g}g)`]
      : []),
    ...(athleteMeal.fibrous_source.length
      ? [`Steam or grill ${athleteMeal.fibrous_source.join(", ")}`]
      : []),
    "Season to taste with low-sodium options",
  ];

  const uniqueId = `${athleteMeal.id}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

  return {
    id: uniqueId,
    title: athleteMeal.title,
    servings: 1,
    ingredients,
    instructions,
    nutrition: {
      calories: athleteMeal.macros.kcal,
      protein: athleteMeal.macros.protein,
      carbs: athleteMeal.macros.carbs,
      fat: athleteMeal.macros.fat,
    },
    badges: athleteMeal.tags,
  };
}

const DEFAULT_CATEGORY = "poultry";

const CATEGORY_OPTIONS = [
  { value: "poultry", label: "🐔 Chicken & Turkey" },
  { value: "redmeat", label: "🥩 Red Meat" },
  { value: "fish", label: "🐟 Fillet Fish" },
  { value: "eggs_shakes", label: "🥚 Eggs & Shakes" },
] as const;

export function AthleteMealPickerDrawer({
  open,
  list,
  onClose,
  onPick,
}: {
  open: boolean;
  list: "breakfast" | "lunch" | "dinner" | "snacks" | null;
  onClose: () => void;
  onPick: (meal: Meal) => void;
}) {
  const [category, setCategory] =
    React.useState<AthleteMeal["category"]>(DEFAULT_CATEGORY);

  // Reset category when drawer opens
  React.useEffect(() => {
    if (open) {
      setCategory(DEFAULT_CATEGORY);
    }
  }, [open]);

  // Filter meals by selected category
  const filteredMeals = React.useMemo(() => {
    return getAthleteMealsByCategory(category);
  }, [category]);

  if (!open || !list) return null;

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="bg-zinc-900/95 border-zinc-800 text-white max-h-[75vh] sm:max-h-[90vh] rounded-t-2xl overflow-hidden flex flex-col w-full max-w-[100vw] overflow-x-hidden">
        {/* Sticky header with safe-area padding */}
        <div className="sticky top-0 z-10 backdrop-blur bg-zinc-900/90 border-b border-zinc-800 pt-2 px-3 sm:px-4 pb-2">
          <DrawerTitle className="text-sm sm:text-base font-semibold">
            Add to {list}
          </DrawerTitle>

          <div className="mt-2 flex flex-col sm:flex-row gap-2">
            <Select
              value={category}
              onValueChange={(val) =>
                setCategory(val as AthleteMeal["category"])
              }
            >
              <SelectTrigger className="w-full bg-black/60 border-purple-500 border text-white h-9 text-xs shadow-lg shadow-purple-500/30">
                <SelectValue>
                  {CATEGORY_OPTIONS.find((opt) => opt.value === category)
                    ?.label ?? "Select Category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-purple-500/30 text-white">
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-white/80 hover:bg-white/10 rounded-2xl text-xs sm:text-sm px-2 sm:px-3 w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>

        {/* Scrollable meal grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 sm:px-4 py-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 w-full max-w-6xl mx-auto">
            {filteredMeals.map((am: AthleteMeal) => (
              <button
                key={am.id}
                onClick={() => {
                  const mealToAdd = convertAthleteMealToMeal(am);
                  onPick(mealToAdd);
                }}
                className="w-full text-left rounded-2xl border border-purple-500/30 bg-black/50 hover:bg-black/70 p-3 transition-all"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="text-white/90 font-medium text-xs flex-1 leading-tight">
                    {am.title.includes('(') ? (
                      <>
                        {am.title.split('(')[0].trim()}
                        <br />
                        ({am.title.split('(')[1]}
                      </>
                    ) : (
                      am.title
                    )}
                  </div>
                  {am.includeCarbs ? (
                    <Badge className="bg-emerald-600/80 text-white text-[10px] ml-1 px-1.5 py-0 shrink-0">
                      Carbs
                    </Badge>
                  ) : (
                    <Badge className="bg-purple-600/80 text-white text-[10px] ml-1 px-1.5 py-0 shrink-0">
                      P+V
                    </Badge>
                  )}
                </div>

                <div className="text-white/70 text-[10px] mb-0.5 leading-tight">
                  {am.protein_source} ({am.protein_oz}oz)
                  {am.carb_source && ` • ${am.carb_source} (${am.carb_g}g)`}
                </div>

                <div className="text-white/60 text-[10px] leading-tight">
                  {am.macros.kcal} kcal · P{am.macros.protein} · C
                  {am.macros.carbs} · F{am.macros.fat}
                </div>

                {am.tags?.length ? (
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {am.tags.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[9px] bg-purple-600/20 text-purple-300 px-1.5 py-0.5 rounded-full leading-none"
                      >
                        {tag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

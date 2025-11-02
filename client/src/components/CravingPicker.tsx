// client/src/components/CravingPicker.tsx
// Full-screen modal that uses the same backend as Craving Creator
// and returns a meal object to the caller without leaving the page.
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, RefreshCcw } from "lucide-react";
import MealCard from "@/components/MealCard";

type Ingredient = { name: string; amount: string };

export type PickerMeal = {
  name: string; 
  description?: string; 
  imageUrl?: string;
  ingredients: Ingredient[]; 
  instructions: string[];
  calories?: number; 
  protein?: number; 
  carbs?: number; 
  fats?: number;
  labels?: string[]; 
  badges: string[];
};

export default function CravingPicker({
  open,
  slotLabel,
  onClose,
  onUse,
  userId = "1",
}: {
  open: boolean;
  slotLabel: string; // e.g., "Breakfast" | "Lunch" | "Dinner" | "Snack"
  onClose: () => void;
  onUse: (meal: PickerMeal) => void;
  userId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [meal, setMeal] = useState<PickerMeal | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { 
    if (open) { 
      setMeal(null); 
      setError(null); 
    } 
  }, [open]);

  async function generate() {
    setLoading(true); 
    setError(null);
    
    try {
      const res = await fetch("/api/meals/craving-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId, 
          targetMealType: slotLabel.toLowerCase(),
          cravingInput: `${slotLabel} meal`,
          includeImage: true 
        }),
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      const m = data.meal || data;
      
      const normalized: PickerMeal = {
        name: String(m?.name ?? m?.title ?? "Chef's Choice"),
        description: m?.description ?? m?.summary ?? undefined,
        imageUrl: m?.imageUrl ?? m?.imageURL ?? m?.image ?? undefined,
        ingredients: Array.isArray(m?.ingredients)
          ? m.ingredients.map((x: any) => ({ 
              name: String(x.name ?? x.ingredient ?? "").trim(), 
              amount: String(x.amount ?? x.quantity ?? x.qty ?? "").trim() 
            }))
          : [],
        instructions: Array.isArray(m?.instructions)
          ? m.instructions.map((s: any) => String(s).trim()).filter(Boolean)
          : [],
        calories: m?.calories != null ? Number(m.calories) : undefined,
        protein: m?.protein != null ? Number(m.protein) : undefined,
        carbs: m?.carbs != null ? Number(m.carbs) : undefined,
        fats: m?.fats != null ? Number(m.fats) : (m?.fat != null ? Number(m.fat) : undefined),
        labels: Array.isArray(m?.labels) ? m.labels.map((s: any) => String(s)) : [],
        badges: Array.isArray(m?.badges ?? m?.medicalBadges) ? (m.badges ?? m.medicalBadges).map((s: any) => String(s)) : [],
      };
      
      setMeal(normalized);
    } catch (e: any) {
      setError(e.message || "Failed to generate meal");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-xl overflow-hidden flex flex-col shadow-xl max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="font-semibold text-gray-900 dark:text-white">
            Craving Picker — {slotLabel}
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {!meal ? (
            <div className="flex items-center gap-3">
              <Button onClick={generate} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin"/>
                    Generating...
                  </>
                ) : (
                  <>Generate {slotLabel} Option</>
                )}
              </Button>
              {error && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <>
              <MealCard
                item={{
                  ...meal,
                  slot: "meal" as const,
                  label: slotLabel,
                  time: "",
                  dayIndex: 0,
                  order: 0,
                  badges: meal.badges ?? [],
                }}
                onRegenerate={generate}
                cravingCreatorHref="#"
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={generate} disabled={loading}>
                  <RefreshCcw className="w-4 h-4 mr-2"/>
                  Different Option
                </Button>
                <Button onClick={() => onUse(meal)}>
                  Use This Meal
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
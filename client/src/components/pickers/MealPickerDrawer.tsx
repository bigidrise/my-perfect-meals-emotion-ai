import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import type { Meal } from "@/components/MealCard";
import { TEMPLATE_SETS } from "@/data/templateSets";
import { useOnboardingProfile } from "@/hooks/useOnboardingProfile";

function matchesProfile(meal: Meal, profile: any){
  const allergies: string[] = (profile?.allergies || []).map((s:string)=>s.toLowerCase());
  const avoidBadges: string[] = (profile?.avoidBadges || []).map((s:string)=>s.toLowerCase());
  if (allergies.length && Array.isArray(meal.ingredients)) {
    for (const ing of meal.ingredients) {
      const name = (ing?.item || "").toLowerCase();
      if (!name) continue;
      // naive contains check; expand with your alias list if needed
      if (allergies.some(a => name.includes(a))) return false;
    }
  }
  if (avoidBadges.length && Array.isArray(meal.badges)) {
    for (const b of meal.badges) {
      if (avoidBadges.includes(String(b).toLowerCase())) return false;
    }
  }
  return true;
}

function pickFromTemplates(list: "breakfast"|"lunch"|"dinner"|"snacks"): Meal[] {
  return TEMPLATE_SETS[list];
}

export function MealPickerDrawer({
  open, list, onClose, onPick
}:{
  open: boolean;
  list: "breakfast"|"lunch"|"dinner"|"snacks"|null;
  onClose: ()=>void;
  onPick: (meal: Meal)=>void;
}){
  const [loading, setLoading] = React.useState<"cafeteria"|null>(null);
  const [templates, setTemplates] = React.useState<Meal[]>([]);
  const profile = useOnboardingProfile();

  // Cafeteria generation with safe fallback and deep clone
  async function generateFromCafeteria(list: "breakfast"|"lunch"|"dinner"|"snacks"): Promise<Meal[]> {
    // prefer profile-filtered pool, fall back to all, and if still empty → safe stub
    const filtered = TEMPLATE_SETS[list].filter(m => matchesProfile(m, profile));
    const base = (filtered.length ? filtered : TEMPLATE_SETS[list]);
    let pick = base[Math.floor(Math.random() * Math.max(base.length, 1))];

    if (!pick) {
      // last-resort stub to avoid UI failure
      pick = {
        id: "caf_stub",
        title: `Quick ${list} Meal`,
        servings: 1,
        ingredients: [{ item: "egg", amount: "2" }],
        instructions: ["Scramble eggs (2) 3–4 min."],
        nutrition: { calories: 140, protein: 12, carbs: 1, fat: 9 },
        badges: ["low-GI"],
      } as any;
    }

    // deep clone + new id + guards
    const meal: any = JSON.parse(JSON.stringify(pick));
    meal.id = "caf_" + Math.random().toString(36).slice(2);
    meal.ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];
    meal.instructions = Array.isArray(meal.instructions) ? meal.instructions : [];
    meal.nutrition = meal.nutrition || { calories:0, protein:0, carbs:0, fat:0 };
    return [meal as Meal];
  }

  React.useEffect(() => {
    if (!list) return;
    const raw = pickFromTemplates(list);
    const filtered = raw.filter(m => matchesProfile(m, profile));
    setTemplates(filtered.length > 0 ? filtered : raw);
  }, [list, profile]);

  if (!open || !list) return null;

  return (
    <Drawer open={open} onOpenChange={(v)=>!v && onClose()}>
      <DrawerContent className="bg-zinc-900/95 border-zinc-800 text-white max-h-[75vh] sm:max-h-[90vh] rounded-t-2xl overflow-hidden flex flex-col">
        {/* Sticky header with iOS safe-area padding */}
        <div className="sticky top-0 z-10 backdrop-blur bg-zinc-900/90 border-b border-zinc-800 pt-2 sm:pt-[calc(env(safe-area-inset-top,0px)+12px)] px-3 sm:px-4 pb-2 sm:pb-3">
          <DrawerTitle className="text-sm sm:text-base font-semibold">Add to {list}</DrawerTitle>

          <div className="mt-1.5 sm:mt-3 flex flex-col sm:flex-row gap-1.5 sm:gap-2">
            <div className="flex gap-1.5 sm:gap-2">
              <Button
                size="sm"
                disabled={!!loading}
                onClick={async ()=>{ setLoading("cafeteria"); const [m] = await generateFromCafeteria(list); setLoading(null); onPick(m);} }
                className="bg-emerald-600/80 hover:bg-emerald-600 rounded-2xl text-xs sm:text-sm px-2 sm:px-3"
                data-testid="button-cafeteria"
              >
                {loading==="cafeteria" ? "Generating…" : "Cafeteria"}
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose} className="text-white/80 hover:bg-white/10 rounded-2xl text-xs sm:text-sm px-2 sm:px-3" data-testid="button-close">Close</Button>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 sm:px-4 py-2 sm:py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={()=>{
                // deep clone + ensure ingredients array exists
                const clone: any = JSON.parse(JSON.stringify(t));
                clone.id = "tpl_pick_" + Math.random().toString(36).slice(2);
                if (!Array.isArray(clone.ingredients)) clone.ingredients = [];
                if (!Array.isArray(clone.instructions)) clone.instructions = [];
                if (!clone.nutrition) clone.nutrition = { calories:0, protein:0, carbs:0, fat:0 };
                onPick(clone);
              }}
              className="text-left rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900/80 p-2 sm:p-3"
              data-testid={`card-meal-${t.id}`}
            >
              <div className="text-white/90 font-medium text-xs sm:text-base">{t.title}</div>
              <div className="text-white/60 text-xs mt-0.5 sm:mt-1">
                {t.nutrition.calories} kcal · P {t.nutrition.protein} · C {t.nutrition.carbs} · F {t.nutrition.fat}
              </div>
              {t.badges?.length ? (
                <div className="mt-1 flex flex-wrap gap-1">
                  {t.badges.map((b)=>(
                    <span key={b} className="text-xs bg-emerald-600/20 text-emerald-400 px-2 py-0.5 rounded-full">
                      {b}
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

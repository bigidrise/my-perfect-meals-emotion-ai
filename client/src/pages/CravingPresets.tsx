// 🔒🔒🔒 CRAVING PRESETS FINAL LOCKDOWN (JANUARY 3, 2025) - DO NOT MODIFY
// Complete system lockdown per user command: macro logging, medical badges, JSX structure
// Zero-tolerance policy for modifications - system working perfectly for production deployment

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Home,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useLocation } from "wouter";
import {
  CRAVING_PRESETS,
  type CravingPreset,
  type Ingredient,
} from "@/data/cravingsPresetsData";
import { prettyAmount } from "@/utils/prettyUnits";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ShoppingAggregateBar from "@/components/ShoppingAggregateBar";
import MacroBridgeButton from "@/components/biometrics/MacroBridgeButton";
import TrashButton from "@/components/ui/TrashButton";

const SERVING_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

type RoundingMode = "tenth" | "half" | "whole";

function roundQty(value: number, mode: RoundingMode = "tenth"): number {
  if (!isFinite(value)) return 0;
  switch (mode) {
    case "half":
      return Math.round(value * 2) / 2; // 0.5 increments
    case "whole":
      return Math.round(value);
    default:
      return Math.round(value * 10) / 10; // 0.1 increments
  }
}

function scaleQty(
  qty: number,
  fromServings: number,
  toServings: number,
): number {
  if (!fromServings || fromServings <= 0) return qty;
  return qty * (toServings / fromServings);
}

function formatQty(qty: number): string {
  const s = qty.toFixed(2);
  return parseFloat(s).toString();
}

function pluralize(unit: string | undefined, qty: number): string | undefined {
  if (!unit) return unit;
  const u = unit.trim();
  if (qty === 1) return u.replace(/s$/i, "");
  if (!/s$/i.test(u) && !/(oz|ml|g|kg|lb)$/i.test(u)) return `${u}s`;
  return u;
}

function scaledIngredient(
  ing: Ingredient,
  baseServings: number,
  toServings: number,
  rounding: RoundingMode,
): Ingredient {
  const scaled = scaleQty(ing.quantity, baseServings, toServings);
  const rounded = roundQty(scaled, rounding);
  return { ...ing, quantity: rounded };
}

function scaleIngredients(
  ings: Ingredient[],
  baseServings: number,
  toServings: number,
  rounding: RoundingMode,
): Ingredient[] {
  return ings.map((ing) =>
    scaledIngredient(ing, baseServings, toServings, rounding),
  );
}

export default function CravingPresetsPage() {
  const [, setLocation] = useLocation();
  const [selectedServings, setSelectedServings] = useState<number>(2);
  const [rounding, setRounding] = useState<RoundingMode>("tenth");
  const [filterText, setFilterText] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const presets = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return CRAVING_PRESETS;
    return CRAVING_PRESETS.filter(
      (preset) =>
        preset.name.toLowerCase().includes(q) ||
        (preset.badges?.some((badge) => badge.toLowerCase().includes(q)) ??
          false) ||
        (preset.tags?.some((tag) => tag.toLowerCase().includes(q)) ?? false) ||
        preset.summary?.toLowerCase().includes(q),
    );
  }, [filterText]);

  const toggleCardExpansion = (presetId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(presetId)) {
      newExpanded.delete(presetId);
    } else {
      newExpanded.add(presetId);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 p-4"
    >
      {/* Fixed Back to Meal Hub Button */}
      <Button
        variant="ghost"
        onClick={() => setLocation("/craving-hub")}
        className="fixed top-4 left-4 z-[2147483647] transform translateZ(0) isolation-isolate flex items-center gap-2 text-white bg-black/10 backdrop-blur-none rounded-2xl border border-white/20 hover:bg-black/20 transition-all duration-200"
        data-testid="button-back-meal-hub"
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>

      <div className="max-w-7xl mx-auto pt-20 pb-48">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block rounded-2xl px-6 py-5 bg-black/20 border border-white/10 backdrop-blur-sm shadow-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Healthy Premade Cravings
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              20 smarter recipes that satisfy what you're craving — scaled from
              1-10 servings
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 bg-black/20 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-white font-medium">Servings</Label>
              <Select
                value={selectedServings.toString()}
                onValueChange={(value) => setSelectedServings(parseInt(value))}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVING_OPTIONS.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} serving{num !== 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Rounding</Label>
              <Select
                value={rounding}
                onValueChange={(value) => setRounding(value as RoundingMode)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tenth">0.1 (precise)</SelectItem>
                  <SelectItem value="half">0.5 (practical)</SelectItem>
                  <SelectItem value="whole">1.0 (simple)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Search</Label>
              <div className="relative">
                <Input
                  placeholder="Filter presets..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 pr-8"
                  data-testid="input-search"
                />
                {filterText && (
                  <TrashButton
                    onClick={() => setFilterText("")}
                    size="sm"
                    ariaLabel="Clear search"
                    title="Clear search"
                    data-testid="button-clear-search"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  />
                )}
              </div>
            </div>

            <div className="text-white/60 text-sm">
              Showing {presets.length} of {CRAVING_PRESETS.length} presets
            </div>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((preset) => {
            const scaledIngredients = scaleIngredients(
              preset.ingredients,
              preset.baseServings,
              selectedServings,
              rounding,
            );

            // NEW: determine expanded state once so we can style the button accordingly
            const isOpen = expandedCards.has(preset.id);

            return (
              <Card
                key={preset.id}
                className="bg-black/60 border-white/20 backdrop-blur-sm hover:bg-black/70 transition-all duration-300 group relative overflow-hidden"
                data-testid={`card-preset-${preset.id}`}
              >
                {/* Routing Number */}
                <div className="absolute top-3 right-3 bg-white/90 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-10">
                  {CRAVING_PRESETS.indexOf(preset) + 1}
                </div>

                {/* Image */}
                <div className="h-40 bg-slate-700 rounded-t-lg overflow-hidden">
                  {preset.image ? (
                    <img
                      src={preset.image}
                      alt={preset.name}
                      className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onLoad={() =>
                        console.log("✅ Image loaded:", preset.id, preset.image)
                      }
                      onError={(e) => {
                        console.log(
                          "❌ Image error:",
                          preset.id,
                          preset.image,
                          e,
                        );
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                        (
                          e.currentTarget
                            .nextElementSibling as HTMLElement | null
                        )?.removeAttribute("style");
                      }}
                    />
                  ) : null}
                  <div className="hidden h-40 w-full bg-gradient-to-br from-orange-500/20 to-indigo-500/20 flex items-center justify-center">
                    <span className="text-white/60 text-sm">No Image</span>
                  </div>
                </div>

                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {preset.name}
                    </h3>
                    {preset.summary && (
                      <p className="text-white/70 text-sm">{preset.summary}</p>
                    )}
                  </div>

                  {/* Badges */}
                  {preset.badges && preset.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {preset.badges.map((badge, index) => (
                        <Badge
                          key={index}
                          className="bg-green-100 text-green-800 border-green-200 text-xs"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Macros row (scaled from preset.macros) */}
                  {preset.macros && (
                    <div className="grid grid-cols-4 gap-2 text-center mb-4">
                      <div>
                        <div className="text-lg font-bold text-orange-300">
                          {Math.round(
                            preset.macros.calories * selectedServings,
                          )}
                        </div>
                        <div className="text-xs text-white/70">Calories</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-300">
                          {Math.round(preset.macros.protein * selectedServings)}
                          g
                        </div>
                        <div className="text-xs text-white/70">Protein</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-300">
                          {Math.round(preset.macros.carbs * selectedServings)}g
                        </div>
                        <div className="text-xs text-white/70">Carbs</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-300">
                          {Math.round(preset.macros.fat * selectedServings)}g
                        </div>
                        <div className="text-xs text-white/70">Fat</div>
                      </div>
                    </div>
                  )}

                  {/* Scaled Ingredients */}
                  <div className="space-y-2">
                    <h4 className="text-white/90 font-semibold text-sm flex items-center gap-1">
                      <span>
                        Ingredients ({selectedServings} serving
                        {selectedServings !== 1 ? "s" : ""})
                      </span>
                    </h4>
                    <div className="bg-slate-800/50 rounded-md p-3 space-y-1 max-h-32 overflow-y-auto">
                      {scaledIngredients.map((ing, index) => {
                        const amount = formatQty(ing.quantity);
                        const unit = pluralize(ing.unit, ing.quantity);
                        const base = `${amount}${unit ? ` ${unit}` : ""}`;
                        const friendly =
                          unit?.toLowerCase() === "g"
                            ? ` (${prettyAmount(ing.quantity, "g", ing.name)})`
                            : "";

                        return (
                          <div
                            key={index}
                            className="text-white/80 text-xs flex justify-between"
                          >
                            <span>{ing.name}</span>
                            <span className="text-orange-300 font-mono">
                              {base}
                              {friendly}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCardExpansion(preset.id)}
                      aria-pressed={isOpen}
                      className={`w-full border-white/20 text-white flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 hover:bg-white/20 ${isOpen ? "bg-white/20" : "bg-white/10"}`}
                      data-testid={`button-cooking-instructions-${preset.id}`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span className="mx-2 font-medium">Instructions</span>
                      {isOpen ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </Button>

                    {preset.macros && (
                      <MacroBridgeButton
                        meal={{
                          protein: Math.round(
                            preset.macros.protein * selectedServings,
                          ),
                          carbs: Math.round(
                            preset.macros.carbs * selectedServings,
                          ),
                          fat: Math.round(preset.macros.fat * selectedServings),
                          calories: Math.round(
                            preset.macros.calories * selectedServings,
                          ),
                        }}
                        source="craving-presets"
                      />
                    )}
                  </div>

                  {/* Expanded Instructions Dropdown */}
                  {isOpen && (
                    <div className="mt-4 space-y-3 border-t border-white/20 pt-3">
                      {/* Instructions */}
                      <div>
                        <h4 className="font-semibold text-white text-sm mb-2">
                          Cooking Instructions
                        </h4>
                        <div className="space-y-2">
                          {preset.instructions.map((instruction, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-xs text-white/90"
                            >
                              <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="bg-slate-800/50 p-2 rounded flex-1">
                                {instruction}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {presets.length === 0 && (
          <div className="text-center text-white/60 py-12">
            <p>No presets match your search.</p>
          </div>
        )}
      </div>

      {/* Shopping Aggregate Bar */}
      <ShoppingAggregateBar
        ingredients={presets.flatMap((preset) => {
          const scaledIngredients = scaleIngredients(
            preset.ingredients,
            preset.baseServings,
            selectedServings,
            rounding,
          );
          return scaledIngredients.map((ing) => ({
            name: ing.name,
            qty: ing.quantity,
            unit: ing.unit,
          }));
        })}
        source="Craving Presets"
      />
    </motion.div>
  );
}

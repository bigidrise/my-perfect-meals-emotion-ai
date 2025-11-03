import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation, useRoute } from "wouter";
import { MealCard, Meal } from "@/components/MealCard";
import {
  type WeekBoard,
  weekDates,
  getDayLists,
  setDayLists,
  cloneDayLists,
  putWeekBoard,
  getWeekBoardByDate,
} from "@/lib/boardApi";
import { ManualMealModal } from "@/components/pickers/ManualMealModal";
import { AthleteMealPickerDrawer } from "@/components/pickers/AthleteMealPickerDrawer";
import { AddSnackModal } from "@/components/AddSnackModal";
import { MacroBridgeFooter } from "@/components/biometrics/MacroBridgeFooter";
import WeeklyOverviewModal from "@/components/WeeklyOverviewModal";
import ShoppingAggregateBar from "@/components/ShoppingAggregateBar";
import { normalizeIngredients } from "@/utils/ingredientParser";
import { addItems } from "@/stores/shoppingListStore";
import { useToast } from "@/hooks/use-toast";
import ShoppingListPreviewModal from "@/components/ShoppingListPreviewModal";
import { useWeeklyBoard } from "@/hooks/useWeeklyBoard";
import { getMondayISO } from "@/../../shared/schema/weeklyBoard";
import { v4 as uuidv4 } from "uuid";
import {
  Plus,
  Check,
  Sparkles,
  BarChart3,
  ShoppingCart,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Target,
} from "lucide-react";
import { FEATURES } from "@/utils/features";
import { DayWeekToggle } from "@/components/DayWeekToggle";
import { DayChips } from "@/components/DayChips";
import { DuplicateDayModal } from "@/components/DuplicateDayModal";
import { DuplicateWeekModal } from "@/components/DuplicateWeekModal";
import { setMacroTargets } from "@/lib/dailyLimits";
import { proStore } from "@/lib/proData";
import { linkUserToClient } from "@/lib/macroResolver";
import { saveLastAthleteClientId } from "@/lib/macroSourcesConfig";

// Helper function to create new snacks
function makeNewSnack(nextIndex: number): Meal {
  return {
    id: `snk-${Date.now()}`,
    title: "Snack",
    servings: 1,
    ingredients: [],
    instructions: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  };
}

// Week navigation utilities
function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function nextWeekISO(weekStartISO: string) {
  return addDaysISO(weekStartISO, 7);
}

function prevWeekISO(weekStartISO: string) {
  return addDaysISO(weekStartISO, -7);
}

function formatWeekLabel(weekStartISO: string): string {
  const start = new Date(weekStartISO + "T00:00:00Z");
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${fmt(start)}–${fmt(end)}`;
}

// Competition Prep Meal Slots: 6 meals mapped to underlying storage slots
const ATHLETE_MEAL_SLOTS = [
  { label: "First Meal", slot: "breakfast" as const },
  { label: "Second Meal", slot: "breakfast" as const },
  { label: "Third Meal", slot: "lunch" as const },
  { label: "Fourth Meal", slot: "lunch" as const },
  { label: "Fifth Meal", slot: "dinner" as const },
  { label: "Sixth Meal", slot: "snacks" as const },
];

interface AthleteBoardProps {
  mode?: "athlete" | "procare";
}

export default function AthleteBoard({ mode = "athlete" }: AthleteBoardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Route params
  const [, athleteParams] = useRoute("/athlete-meal-board/:clientId");
  const [, proParams] = useRoute("/pro/clients/:id/athlete-board");
  const clientId = athleteParams?.clientId || proParams?.id;

  // Safety check: redirect if no clientId
  useEffect(() => {
    if (!clientId) {
      setLocation("/dashboard");
    } else {
      // Save clientId for "Came From" dropdown routing
      saveLastAthleteClientId(clientId);
    }
  }, [clientId, setLocation]);

  if (!clientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Missing client ID. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // 🎯 BULLETPROOF BOARD LOADING
  const [weekStartISO, setWeekStartISO] =
    React.useState<string>(getMondayISO());
  const {
    board: hookBoard,
    loading: hookLoading,
    error,
    save: saveToHook,
    source,
  } = useWeeklyBoard(clientId, weekStartISO);

  // Local mutable board state for optimistic updates
  const [board, setBoard] = React.useState<WeekBoard | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [justSaved, setJustSaved] = React.useState(false);

  // Sync hook board to local state
  React.useEffect(() => {
    if (hookBoard) {
      setBoard(hookBoard);
      setLoading(hookLoading);
    }
  }, [hookBoard, hookLoading]);

  // Wrapper to save with idempotent IDs
  const saveBoard = React.useCallback(
    async (updatedBoard: WeekBoard) => {
      setSaving(true);
      try {
        await saveToHook(updatedBoard as any, uuidv4());
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
      } catch (err) {
        console.error("Failed to save board:", err);
        toast({
          title: "Save failed",
          description: "Changes will retry when you're online",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    },
    [saveToHook, toast],
  );

  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pickerList, setPickerList] = React.useState<
    "breakfast" | "lunch" | "dinner" | "snacks" | null
  >(null);
  const [manualModalOpen, setManualModalOpen] = React.useState(false);
  const [manualModalList, setManualModalList] = React.useState<
    "breakfast" | "lunch" | "dinner" | "snacks" | null
  >(null);
  const [showSnackModal, setShowSnackModal] = React.useState(false);
  const [showOverview, setShowOverview] = React.useState(false);

  // Day/Week planning state
  const [planningMode, setPlanningMode] = React.useState<"day" | "week">("day");
  const [activeDayISO, setActiveDayISO] = React.useState<string>("");

  const [showDuplicateDayModal, setShowDuplicateDayModal] =
    React.useState(false);
  const [showDuplicateWeekModal, setShowDuplicateWeekModal] =
    React.useState(false);

  // Shopping list modal state
  const [shoppingListModal, setShoppingListModal] = useState<{
    isOpen: boolean;
    meal: any | null;
  }>({ isOpen: false, meal: null });

  // Generate week dates
  const weekDatesList = useMemo(() => {
    return weekStartISO ? weekDates(weekStartISO) : [];
  }, [weekStartISO]);

  // Set initial active day when week loads
  useEffect(() => {
    if (weekDatesList.length > 0 && !activeDayISO) {
      setActiveDayISO(weekDatesList[0]); // Default to Monday
    }
  }, [weekDatesList, activeDayISO]);

  // Duplicate day handler
  const handleDuplicateDay = useCallback(
    async (targetDates: string[]) => {
      if (!board || !activeDayISO) return;

      const sourceLists = getDayLists(board, activeDayISO);
      const clonedLists = cloneDayLists(sourceLists);

      let updatedBoard = board;
      targetDates.forEach((dateISO) => {
        updatedBoard = setDayLists(updatedBoard, dateISO, clonedLists);
      });

      try {
        await saveBoard(updatedBoard);
        toast({
          title: "Day duplicated",
          description: `Copied to ${targetDates.length} day(s)`,
        });
      } catch (error) {
        console.error("Failed to duplicate day:", error);
        toast({
          title: "Failed to duplicate",
          description: "Please try again",
          variant: "destructive",
        });
      }
    },
    [board, activeDayISO, saveBoard, toast],
  );

  // Duplicate week handler
  const handleDuplicateWeek = useCallback(
    async (targetWeekStartISO: string) => {
      if (!board) return;

      const clonedBoard = {
        ...board,
        id: `week-${targetWeekStartISO}`,
        days: board.days
          ? Object.fromEntries(
              Object.entries(board.days).map(([oldDateISO, lists]) => {
                const dayIndex = weekDatesList.indexOf(oldDateISO);
                const targetWeekDates = weekDates(targetWeekStartISO);
                const newDateISO = targetWeekDates[dayIndex] || oldDateISO;
                return [newDateISO, cloneDayLists(lists)];
              }),
            )
          : undefined,
      };

      try {
        await putWeekBoard(targetWeekStartISO, clonedBoard);
        setWeekStartISO(targetWeekStartISO);
        toast({
          title: "Week duplicated",
          description: `Copied to week of ${targetWeekStartISO}`,
        });
      } catch (error) {
        console.error("Failed to duplicate week:", error);
        toast({
          title: "Failed to duplicate",
          description: "Please try again",
          variant: "destructive",
        });
      }
    },
    [board, weekDatesList, toast],
  );

  // Shopping list handler - Single day
  const handleAddToShoppingList = useCallback(() => {
    if (!board) {
      toast({
        title: "No meals found",
        description: "Add meals to your board before creating a shopping list.",
        variant: "destructive",
      });
      return;
    }

    let allMeals: Meal[] = [];
    if (
      FEATURES.dayPlanning === "alpha" &&
      planningMode === "day" &&
      activeDayISO
    ) {
      const dayLists = getDayLists(board, activeDayISO);
      allMeals = [
        ...dayLists.breakfast,
        ...dayLists.lunch,
        ...dayLists.dinner,
        ...dayLists.snacks,
      ];
    } else {
      allMeals = [
        ...board.lists.breakfast,
        ...board.lists.lunch,
        ...board.lists.dinner,
        ...board.lists.snacks,
      ];
    }

    if (allMeals.length === 0) {
      toast({
        title: "No meals found",
        description: "Add meals to your board before creating a shopping list.",
        variant: "destructive",
      });
      return;
    }

    const ingredients = allMeals.flatMap((meal) =>
      normalizeIngredients(meal.ingredients || []),
    );

    const items = ingredients.map((i) => ({
      name: i.name,
      qty:
        typeof i.qty === "number"
          ? i.qty
          : i.qty
            ? parseFloat(String(i.qty))
            : undefined,
      unit: i.unit,
      note:
        planningMode === "day" && activeDayISO
          ? `${new Date(activeDayISO + "T00:00:00Z").toLocaleDateString(undefined, { weekday: "long" })} Athlete Plan`
          : `Athlete Meal Plan (${formatWeekLabel(weekStartISO)})`,
    }));

    addItems(items);

    toast({
      title: "Added to Shopping List",
      description: `${ingredients.length} items added to your master list`,
    });
  }, [board, planningMode, activeDayISO, weekStartISO, toast]);

  // Shopping list handler - Entire week
  const handleAddEntireWeekToShoppingList = useCallback(() => {
    if (!board) {
      toast({
        title: "No meals found",
        description: "Add meals to your board before creating a shopping list.",
        variant: "destructive",
      });
      return;
    }

    let allMeals: Meal[] = [];
    weekDatesList.forEach((dateISO) => {
      const dayLists = getDayLists(board, dateISO);
      allMeals.push(
        ...dayLists.breakfast,
        ...dayLists.lunch,
        ...dayLists.dinner,
        ...dayLists.snacks,
      );
    });

    if (allMeals.length === 0) {
      toast({
        title: "No meals found",
        description: "Add meals to your week before creating a shopping list.",
        variant: "destructive",
      });
      return;
    }

    const ingredients = allMeals.flatMap((meal) =>
      normalizeIngredients(meal.ingredients || []),
    );

    const items = ingredients.map((i) => ({
      name: i.name,
      qty:
        typeof i.qty === "number"
          ? i.qty
          : i.qty
            ? parseFloat(String(i.qty))
            : undefined,
      unit: i.unit,
      note: `Athlete Meal Plan (${formatWeekLabel(weekStartISO)}) - All 7 Days`,
    }));

    addItems(items);

    toast({
      title: "Added to Shopping List",
      description: `${ingredients.length} items from entire week added to your master list`,
    });
  }, [board, weekStartISO, weekDatesList, toast]);

  // Add Snack handlers
  const onAddSnack = useCallback(() => setShowSnackModal(true), []);

  const onSaveSnack = useCallback(
    async (p: {
      title: string;
      brand?: string;
      servingDesc?: string;
      servings: number;
      calories: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      includeInShoppingList: boolean;
    }) => {
      if (!board) return;

      const currentSnacks =
        FEATURES.dayPlanning === "alpha" &&
        planningMode === "day" &&
        activeDayISO
          ? (getDayLists(board, activeDayISO).snacks ?? [])
          : (board.lists.snacks ?? []);

      const nextIndex =
        currentSnacks.length > 0
          ? Math.max(...currentSnacks.map((s: any) => s?.orderIndex ?? 0)) + 1
          : 0;

      const newSnack: Meal = {
        id: `snk-${Date.now()}`,
        title: p.title,
        name: `Snack ${nextIndex + 1}`,
        servings: p.servings,
        ingredients: [],
        instructions: [],
        nutrition: {
          calories: p.calories,
          protein: p.protein ?? 0,
          carbs: p.carbs ?? 0,
          fat: p.fat ?? 0,
        },
        orderIndex: nextIndex,
        entryType: "quick" as const,
        brand: p.brand,
        servingDesc: p.servingDesc,
        includeInShoppingList: p.includeInShoppingList === true,
      } as any;

      try {
        if (
          FEATURES.dayPlanning === "alpha" &&
          planningMode === "day" &&
          activeDayISO
        ) {
          const dayLists = getDayLists(board, activeDayISO);
          const updatedDay = {
            ...dayLists,
            snacks: [...(dayLists.snacks ?? []), newSnack],
          };
          const updatedBoard = setDayLists(board, activeDayISO, updatedDay);
          const { week } = await putWeekBoard(weekStartISO, updatedBoard);
          setBoard(week);
        } else {
          const snacks = board.lists.snacks ?? [];
          const updated: WeekBoard = {
            ...board,
            lists: { ...board.lists, snacks: [...snacks, newSnack] },
          };
          setBoard(updated);
          await putWeekBoard(weekStartISO, updated);
        }

        try {
          window.dispatchEvent(
            new CustomEvent("board:updated", { detail: { weekStartISO } }),
          );
          window.dispatchEvent(new Event("macros:updated"));
        } catch {}
      } catch (e) {
        console.error("Failed to save snack:", e);
        try {
          const { week } = await getWeekBoardByDate(weekStartISO);
          setBoard(week);
        } catch {}
      }
    },
    [board, weekStartISO, planningMode, activeDayISO],
  );

  // Week navigation
  const gotoWeek = useCallback(
    async (targetISO: string) => {
      setLoading(true);
      try {
        const { weekStartISO: ws, week } = await getWeekBoardByDate(targetISO);
        setWeekStartISO(ws);
        setBoard(week);
      } catch (error) {
        console.error("Failed to load week:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setWeekStartISO, setBoard],
  );

  const onPrevWeek = useCallback(() => {
    if (!weekStartISO) return;
    const d = new Date(weekStartISO + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - 7);
    const prevISO = d.toISOString().slice(0, 10);
    gotoWeek(prevISO);
  }, [weekStartISO, gotoWeek]);

  const onNextWeek = useCallback(() => {
    if (!weekStartISO) return;
    const d = new Date(weekStartISO + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + 7);
    const nextISO = d.toISOString().slice(0, 10);
    gotoWeek(nextISO);
  }, [weekStartISO, gotoWeek]);

  async function quickAdd(
    list: "breakfast" | "lunch" | "dinner" | "snacks",
    meal: Meal,
  ) {
    if (!board) return;

    try {
      if (
        FEATURES.dayPlanning === "alpha" &&
        planningMode === "day" &&
        activeDayISO
      ) {
        const dayLists = getDayLists(board, activeDayISO);
        const updatedDayLists = {
          ...dayLists,
          [list]: [...dayLists[list as keyof typeof dayLists], meal],
        };
        const updatedBoard = setDayLists(board, activeDayISO, updatedDayLists);
        await saveBoard(updatedBoard);
      } else {
        const updatedBoard = {
          ...board,
          lists: {
            ...board.lists,
            [list]: [...board.lists[list], meal],
          },
          version: board.version + 1,
          meta: {
            ...board.meta,
            lastUpdatedAt: new Date().toISOString(),
          },
        };
        setBoard(updatedBoard);
        await saveBoard(updatedBoard);
      }

      try {
        window.dispatchEvent(
          new CustomEvent("board:updated", { detail: { weekStartISO } }),
        );
        window.dispatchEvent(new Event("macros:updated"));
      } catch {}
    } catch (error) {
      console.error("Failed to add meal:", error);
      toast({
        title: "Failed to add meal",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }

  const openPicker = (list: "breakfast" | "lunch" | "dinner" | "snacks") => {
    setPickerList(list);
    setPickerOpen(true);
  };

  const openManualModal = (
    list: "breakfast" | "lunch" | "dinner" | "snacks",
  ) => {
    setManualModalList(list);
    setManualModalOpen(true);
  };

  // Get coach-set macro targets from ProCare
  const coachMacroTargets = useMemo(() => {
    const targets = proStore.getTargets(clientId);
    return {
      calories: targets.kcal || 0,
      protein: targets.protein || 0,
      carbs: targets.carbs || 0,
      fat: targets.fat || 0,
    };
  }, [clientId]);

  // Handle Set Macros to Biometrics
  const handleSetMacrosToBiometrics = useCallback(() => {
    if (coachMacroTargets.calories < 100) {
      toast({
        title: "Cannot Set Empty Macros",
        description: "Please have your coach set macro targets first",
        variant: "destructive",
      });
      return;
    }

    // Save macros to localStorage with "anon" user (default biometrics key)
    setMacroTargets({
      calories: coachMacroTargets.calories,
      protein_g: coachMacroTargets.protein,
      carbs_g: coachMacroTargets.carbs,
      fat_g: coachMacroTargets.fat,
    }); // Use default "anon" user instead of clientId

    // Link the current user to this clientId for ProCare integration
    linkUserToClient("anon", clientId);

    // Save clientId for "Came From" dropdown routing
    saveLastAthleteClientId(clientId);

    toast({
      title: "Macros Set to Biometrics!",
      description: `${coachMacroTargets.calories} kcal coach-set targets saved`,
    });

    setLocation("/my-biometrics?from=athlete-meal-board&view=macros");
  }, [coachMacroTargets, clientId, toast, setLocation]);

  // Show error toast if board load fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Connection Issue",
        description:
          "Showing cached meal plan. Changes will sync when you're back online.",
        variant: "default",
        duration: 5000,
      });
    }
  }, [error, toast]);

  if (loading && !board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-2xl h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Athlete Meal Board...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Failed to load board</p>
        </div>
      </div>
    );
  }

  // Determine current lists based on mode
  const currentLists =
    FEATURES.dayPlanning === "alpha" && planningMode === "day" && activeDayISO
      ? getDayLists(board, activeDayISO)
      : board.lists;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 text-white pb-40"
    >
      {/* Fixed Back to Dashboard Button - Top Left */}
      <Button
        size="sm"
        onClick={() => setLocation("/dashboard")}
        className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-black/60 backdrop-blur-none rounded-2xl border border-white/20 text-white hover:bg-black/80 px-3 sm:px-4 py-2"
        data-testid="button-back-dashboard"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Dashboard
      </Button>

      {/* Fixed Client Dashboard Button - Top Right (only in ProCare mode) */}
      {mode === "procare" && (
        <Button
          size="sm"
          onClick={() => setLocation(`/pro/clients/${clientId}`)}
          className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 bg-black/60 backdrop-blur-none rounded-2xl border border-white/20 text-white hover:bg-black/80 px-3 sm:px-4 py-2"
          data-testid="button-client-dashboard"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Client Dashboard
        </Button>
      )}

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center mt-16">
            <div className="bg-black/60 backdrop-blur-none border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3">
              <h1 className="text-xl font-bold">
                Competition + Beachbody Meal Board
              </h1>

              <div className="flex gap-2">
                {saving && (
                  <span className="text-sm text-white/60">Saving...</span>
                )}
                {justSaved && (
                  <span className="text-sm text-emerald-400 flex items-center gap-1">
                    <Check className="h-4 w-4" /> Saved
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="mt-4 flex items-center justify-between">
            <Button
              size="sm"
              onClick={onPrevWeek}
              className="bg-black/60 backdrop-blur-sm rounded-2xl border border-white/20 text-white hover:bg-black/80"
              data-testid="button-prev-week"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev Week
            </Button>

            <div className="text-center">
              <div className="text-lg font-semibold">
                {formatWeekLabel(weekStartISO)}
              </div>
              <div className="text-xs text-white/60">
                Week of {weekStartISO}
              </div>
            </div>

            <Button
              size="sm"
              onClick={onNextWeek}
              className="bg-black/60 backdrop-blur-sm rounded-2xl border border-white/20 text-white hover:bg-black/80"
              data-testid="button-next-week"
            >
              Next Week
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day/Week Toggle & Day Chips */}
          {FEATURES.dayPlanning === "alpha" && (
            <>
              <div className="mt-4 flex justify-center">
                <DayWeekToggle
                  mode={planningMode}
                  onModeChange={setPlanningMode}
                />
              </div>

              {planningMode === "day" && (
                <div className="mt-4">
                  <DayChips
                    weekDates={weekDatesList}
                    activeDayISO={activeDayISO}
                    onDayChange={setActiveDayISO}
                  />
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Button
              size="sm"
              onClick={() => setShowOverview(true)}
              className="bg-black/60 backdrop-blur-sm rounded-2xl border border-white/20 text-white hover:bg-black/80"
              data-testid="button-overview"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Week Overview
            </Button>

            {FEATURES.dayPlanning === "alpha" && planningMode === "day" && (
              <Button
                size="sm"
                onClick={() => setShowDuplicateDayModal(true)}
                className="bg-black/60 backdrop-blur-sm rounded-2xl border border-white/20 text-white hover:bg-black/80"
                data-testid="button-duplicate-day"
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Day
              </Button>
            )}

            {FEATURES.dayPlanning === "alpha" && (
              <Button
                size="sm"
                onClick={() => setShowDuplicateWeekModal(true)}
                className="bg-black/60 backdrop-blur-sm rounded-2xl border border-white/20 text-white hover:bg-black/80"
                data-testid="button-duplicate-week"
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Week
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Macro Totals Display & Red Button - Right Above Meal Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="rounded-2xl border border-white/30 bg-black/60 backdrop-blur-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Coach-Set Macro Targets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70">Calories</div>
              <div className="text-2xl font-bold text-white">
                {coachMacroTargets.calories}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70">Protein</div>
              <div className="text-2xl font-bold text-white">
                {coachMacroTargets.protein}g
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70">Carbs</div>
              <div className="text-2xl font-bold text-white">
                {coachMacroTargets.carbs}g
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-sm text-white/70">Fat</div>
              <div className="text-2xl font-bold text-white">
                {coachMacroTargets.fat}g
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <Button
            onClick={handleSetMacrosToBiometrics}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 text-lg py-3 shadow-2xl hover:shadow-red-500/50 transition-all duration-200 animate-pulse"
            data-testid="button-set-macros-biometrics-red"
          >
            <Target className="h-5 w-5 mr-2" />
            Set Macros to Biometrics
          </Button>
        </div>
      </div>

      {/* Meal Cards Grid */}
      <div className="container mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Render Meal Slots (Meal 1-7) */}
          {ATHLETE_MEAL_SLOTS.map(({ label, slot }, index) => {
            const meals = currentLists[slot];

            return (
              <section
                key={label}
                className="rounded-2xl border border-purple-500/30 bg-purple-900/20 backdrop-blur-lg p-6"
              >
                {/* ✅ Vertical layout: title on top, buttons stacked below */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white mb-3">
                    {label}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => openPicker(slot)}
                      className="bg-black/60 backdrop-blur-sm rounded-2xl border border-white/20 text-white hover:bg-black/80"
                      data-testid={`button-add-${label.toLowerCase().replace(" ", "-")}`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add from Menu
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openManualModal(slot)}
                      className="bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-black/80"
                      data-testid={`button-manual-${label.toLowerCase().replace(" ", "-")}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {meals.map((meal: Meal, idx: number) => (
                    <MealCard
                      key={meal.id}
                      date={activeDayISO || "board"}
                      slot={slot}
                      meal={meal}
                      onUpdated={(m) => {
                        if (m === null) {
                          // Remove meal
                          if (!board) return;

                          if (
                            FEATURES.dayPlanning === "alpha" &&
                            planningMode === "day" &&
                            activeDayISO
                          ) {
                            const dayLists = getDayLists(board, activeDayISO);
                            const updatedDayLists = {
                              ...dayLists,
                              [slot]: dayLists[slot].filter(
                                (item: Meal) => item.id !== meal.id,
                              ),
                            };
                            const updatedBoard = setDayLists(
                              board,
                              activeDayISO,
                              updatedDayLists,
                            );
                            setBoard(updatedBoard);
                            saveBoard(updatedBoard).catch(console.error);
                          } else {
                            const updatedBoard = {
                              ...board,
                              lists: {
                                ...board.lists,
                                [slot]: board.lists[slot].filter(
                                  (item: Meal) => item.id !== meal.id,
                                ),
                              },
                              version: board.version + 1,
                              meta: {
                                ...board.meta,
                                lastUpdatedAt: new Date().toISOString(),
                              },
                            };
                            setBoard(updatedBoard);
                            saveBoard(updatedBoard).catch(console.error);
                          }
                        } else {
                          // Update meal
                          if (
                            FEATURES.dayPlanning === "alpha" &&
                            planningMode === "day" &&
                            activeDayISO
                          ) {
                            const dayLists = getDayLists(board, activeDayISO);
                            const updatedDayLists = {
                              ...dayLists,
                              [slot]: dayLists[slot].map((item: Meal) =>
                                item.id === meal.id ? m : item,
                              ),
                            };
                            const updatedBoard = setDayLists(
                              board,
                              activeDayISO,
                              updatedDayLists,
                            );
                            setBoard(updatedBoard);
                            saveBoard(updatedBoard).catch(console.error);
                          } else {
                            const updatedBoard = {
                              ...board,
                              lists: {
                                ...board.lists,
                                [slot]: board.lists[slot].map((item: Meal) =>
                                  item.id === meal.id ? m : item,
                                ),
                              },
                              version: board.version + 1,
                            };
                            setBoard(updatedBoard);
                            saveBoard(updatedBoard).catch(console.error);
                          }
                        }
                      }}
                    />
                  ))}
                  {meals.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-purple-700 text-white/50 p-6 text-center text-sm">
                      <p>No meals for {label}</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}

          {/* Daily Totals Summary */}
          <div className="col-span-full">
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/95 backdrop-blur-lg p-6">
              <h3 className="text-white font-semibold text-lg mb-4 text-center">
                {planningMode === "day" && activeDayISO
                  ? `${new Date(activeDayISO + "T00:00:00Z").toLocaleDateString(undefined, { weekday: "long" })} Totals`
                  : "Daily Totals"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-semi-bold text-white">
                    {Math.round(
                      (() => {
                        if (
                          FEATURES.dayPlanning === "alpha" &&
                          planningMode === "day" &&
                          activeDayISO &&
                          board
                        ) {
                          const dayLists = getDayLists(board, activeDayISO);
                          return [
                            ...dayLists.breakfast,
                            ...dayLists.lunch,
                            ...dayLists.dinner,
                            ...dayLists.snacks,
                          ].reduce(
                            (sum, meal) =>
                              sum + (meal.nutrition?.calories ?? 0),
                            0,
                          );
                        }
                        return [
                          ...board.lists.breakfast,
                          ...board.lists.lunch,
                          ...board.lists.dinner,
                          ...board.lists.snacks,
                        ].reduce(
                          (sum, meal) => sum + (meal.nutrition?.calories ?? 0),
                          0,
                        );
                      })(),
                    )}
                  </div>
                  <div className="text-xs uppercase tracking-wide text--200/70 mt-1">
                    Calories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semi-bold text-white">
                    {Math.round(
                      (() => {
                        if (
                          FEATURES.dayPlanning === "alpha" &&
                          planningMode === "day" &&
                          activeDayISO &&
                          board
                        ) {
                          const dayLists = getDayLists(board, activeDayISO);
                          return [
                            ...dayLists.breakfast,
                            ...dayLists.lunch,
                            ...dayLists.dinner,
                            ...dayLists.snacks,
                          ].reduce(
                            (sum, meal) => sum + (meal.nutrition?.protein ?? 0),
                            0,
                          );
                        }
                        return [
                          ...board.lists.breakfast,
                          ...board.lists.lunch,
                          ...board.lists.dinner,
                          ...board.lists.snacks,
                        ].reduce(
                          (sum, meal) => sum + (meal.nutrition?.protein ?? 0),
                          0,
                        );
                      })(),
                    )}
                    g
                  </div>
                  <div className="text-xs uppercase tracking-wide text-white-200/70 mt-1">
                    Protein
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semi-bold text-white">
                    {Math.round(
                      (() => {
                        if (
                          FEATURES.dayPlanning === "alpha" &&
                          planningMode === "day" &&
                          activeDayISO &&
                          board
                        ) {
                          const dayLists = getDayLists(board, activeDayISO);
                          return [
                            ...dayLists.breakfast,
                            ...dayLists.lunch,
                            ...dayLists.dinner,
                            ...dayLists.snacks,
                          ].reduce(
                            (sum, meal) => sum + (meal.nutrition?.carbs ?? 0),
                            0,
                          );
                        }
                        return [
                          ...board.lists.breakfast,
                          ...board.lists.lunch,
                          ...board.lists.dinner,
                          ...board.lists.snacks,
                        ].reduce(
                          (sum, meal) => sum + (meal.nutrition?.carbs ?? 0),
                          0,
                        );
                      })(),
                    )}
                    g
                  </div>
                  <div className="text-xs uppercase tracking-wide text-white-200/70 mt-1">
                    Carbs
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semi-bold text-white">
                    {Math.round(
                      (() => {
                        if (
                          FEATURES.dayPlanning === "alpha" &&
                          planningMode === "day" &&
                          activeDayISO &&
                          board
                        ) {
                          const dayLists = getDayLists(board, activeDayISO);
                          return [
                            ...dayLists.breakfast,
                            ...dayLists.lunch,
                            ...dayLists.dinner,
                            ...dayLists.snacks,
                          ].reduce(
                            (sum, meal) => sum + (meal.nutrition?.fat ?? 0),
                            0,
                          );
                        }
                        return [
                          ...board.lists.breakfast,
                          ...board.lists.lunch,
                          ...board.lists.dinner,
                          ...board.lists.snacks,
                        ].reduce(
                          (sum, meal) => sum + (meal.nutrition?.fat ?? 0),
                          0,
                        );
                      })(),
                    )}
                    g
                  </div>
                  <div className="text-xs uppercase tracking-wide text-white-200/70 mt-1">
                    Fat
                  </div>
                </div>
              </div>

              {/* Coach-Set Macro Targets for Biometrics */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h4 className="text-white/80 text-sm mb-3 text-center">
                  Coach-Set Macro Targets
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white-300">
                      {coachMacroTargets.calories}
                    </div>
                    <div className="text-xs text-white/60">Calories/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white-300">
                      {coachMacroTargets.protein}g
                    </div>
                    <div className="text-xs text-white/60">Protein/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white-300">
                      {coachMacroTargets.carbs}g
                    </div>
                    <div className="text-xs text-white/60">Carbs/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white-300">
                      {coachMacroTargets.fat}g
                    </div>
                    <div className="text-xs text-white/60">Fat/day</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Macro Bridge Footer - Day Mode Only */}
          {board &&
            FEATURES.dayPlanning === "alpha" &&
            planningMode === "day" &&
            activeDayISO && (
              <div className="col-span-full">
                <MacroBridgeFooter
                  items={(() => {
                    const dayLists = getDayLists(board, activeDayISO);
                    return [
                      ...dayLists.breakfast.map((m) => ({
                        protein: m.nutrition?.protein || 0,
                        carbs: m.nutrition?.carbs || 0,
                        fat: m.nutrition?.fat || 0,
                        calories: m.nutrition?.calories || 0,
                      })),
                      ...dayLists.lunch.map((m) => ({
                        protein: m.nutrition?.protein || 0,
                        carbs: m.nutrition?.carbs || 0,
                        fat: m.nutrition?.fat || 0,
                        calories: m.nutrition?.calories || 0,
                      })),
                      ...dayLists.dinner.map((m) => ({
                        protein: m.nutrition?.protein || 0,
                        carbs: m.nutrition?.carbs || 0,
                        fat: m.nutrition?.fat || 0,
                        calories: m.nutrition?.calories || 0,
                      })),
                      ...dayLists.snacks.map((m) => ({
                        protein: m.nutrition?.protein || 0,
                        carbs: m.nutrition?.carbs || 0,
                        fat: m.nutrition?.fat || 0,
                        calories: m.nutrition?.calories || 0,
                      })),
                    ];
                  })()}
                  dateISO={activeDayISO}
                  variant="day"
                  source="athlete-meal-board"
                />
              </div>
            )}
        </div>
      </div>

      {/* Modals */}
      <AthleteMealPickerDrawer
        open={pickerOpen}
        list={pickerList}
        onClose={() => {
          setPickerOpen(false);
          setPickerList(null);
        }}
        onPick={(meal) => {
          if (pickerList) {
            quickAdd(pickerList, meal);
          }
          setPickerOpen(false);
          setPickerList(null);
        }}
      />

      <ManualMealModal
        open={manualModalOpen}
        onClose={() => {
          setManualModalOpen(false);
          setManualModalList(null);
        }}
        onSave={(meal) => {
          if (manualModalList) {
            quickAdd(manualModalList, meal);
          }
          setManualModalOpen(false);
          setManualModalList(null);
        }}
      />

      <AddSnackModal
        open={showSnackModal}
        onClose={() => setShowSnackModal(false)}
        onSave={onSaveSnack}
      />

      <WeeklyOverviewModal
        open={showOverview}
        onClose={() => setShowOverview(false)}
        weekStartISO={weekStartISO}
        board={board}
        onJumpToDay={undefined}
      />

      {FEATURES.dayPlanning === "alpha" && (
        <DuplicateDayModal
          isOpen={showDuplicateDayModal}
          onClose={() => setShowDuplicateDayModal(false)}
          onConfirm={handleDuplicateDay}
          sourceDateISO={activeDayISO}
          availableDates={weekDatesList.filter((date) => date !== activeDayISO)}
        />
      )}

      {FEATURES.dayPlanning === "alpha" && (
        <DuplicateWeekModal
          isOpen={showDuplicateWeekModal}
          onClose={() => setShowDuplicateWeekModal(false)}
          onConfirm={handleDuplicateWeek}
          sourceWeekStartISO={weekStartISO}
        />
      )}

      <ShoppingListPreviewModal
        isOpen={shoppingListModal.isOpen}
        onClose={() => setShoppingListModal({ isOpen: false, meal: null })}
        meal={shoppingListModal.meal}
      />

      {/* Shopping List Buttons */}
      {board &&
        (() => {
          const allMeals =
            planningMode === "day" && activeDayISO
              ? (() => {
                  const dayLists = getDayLists(board, activeDayISO);
                  return [
                    ...dayLists.breakfast,
                    ...dayLists.lunch,
                    ...dayLists.dinner,
                    ...dayLists.snacks,
                  ];
                })()
              : [
                  ...board.lists.breakfast,
                  ...board.lists.lunch,
                  ...board.lists.dinner,
                  ...board.lists.snacks,
                ];

          const ingredients = allMeals.flatMap((meal) =>
            normalizeIngredients(meal.ingredients || []),
          );

          if (ingredients.length === 0) return null;

          // DAY MODE: Show dual buttons
          if (
            FEATURES.dayPlanning === "alpha" &&
            planningMode === "day" &&
            activeDayISO
          ) {
            const dayName = new Date(
              activeDayISO + "T00:00:00Z",
            ).toLocaleDateString(undefined, { weekday: "long" });

            return (
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-indigo-900/95 via-purple-800/95 to-black/95 backdrop-blur-xl border-t border-white/20 shadow-2xl">
                <div className="container mx-auto px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <div className="text-white text-sm font-semibold">
                      Shopping List Ready - {ingredients.length} ingredients
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          handleAddToShoppingList();
                          setTimeout(
                            () =>
                              setLocation(
                                "/shopping-list-v2?from=athlete-meal-board",
                              ),
                            100,
                          );
                        }}
                        className="flex-1 min-h-[44px] bg-orange-600 hover:bg-orange-700 text-white border border-white/30"
                        data-testid="button-send-day-shopping"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Send {dayName}
                      </Button>
                      <Button
                        onClick={() => {
                          handleAddEntireWeekToShoppingList();
                          setTimeout(
                            () =>
                              setLocation(
                                "/shopping-list-v2?from=athlete-meal-board",
                              ),
                            100,
                          );
                        }}
                        className="flex-1 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white border border-white/30"
                        data-testid="button-send-week-shopping"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Send Entire Week
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // WEEK MODE: Use ShoppingAggregateBar
          return (
            <ShoppingAggregateBar
              ingredients={ingredients}
              source="Athlete Meal Board"
              sourceSlug="athlete-meal-board"
            />
          );
        })()}
    </motion.div>
  );
}

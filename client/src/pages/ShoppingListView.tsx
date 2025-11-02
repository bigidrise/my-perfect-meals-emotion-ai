import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, RefreshCw, Home, EyeOff, Eye, X } from "lucide-react";
import { getShoppingList, getCurrentWeekBoard } from "@/lib/boardApi";
import TrashButton from "@/components/ui/TrashButton";
import { getWeekStartISO, prevWeekISO, nextWeekISO, formatWeekRange } from "@/utils/week";
import { FEATURES } from "@/utils/features";
import { WhyChip } from "@/components/WhyChip";
import { WhyDrawer } from "@/components/WhyDrawer";
import { getShoppingListWhy } from "@/utils/reasons";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Helper functions for creating stable keys
function keyGroceries(row: {name:string; amount?:string}) {
  return `${row.name}||${row.amount ?? ''}`; // stable key per line
}
function keyPantry(name: string) {
  return `pantry||${name}`;
}

export default function ShoppingListView() {
  const params = useParams();
  const paramWeek = params.weekStartISO;
  const [, setLocation] = useLocation();
  const [currentWeek, setCurrentWeek] = useState<string>("");
  const { toast } = useToast();
  
  // Hidden items state
  const [showHidden, setShowHidden] = useState(false);
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  
  // Why drawer state
  const [shoppingWhyOpen, setShoppingWhyOpen] = useState(false);

  // Determine which week to show
  useEffect(() => {
    // if route has :weekStartISO, use it; else default to current week
    const wk = paramWeek && paramWeek.length ? paramWeek : getWeekStartISO();
    setCurrentWeek(wk);

    // If user is on "/shopping-list" (no param), push canonical path once
    if (!paramWeek) {
      setLocation(`/shopping-list/${wk}`);
    }
  }, [paramWeek, setLocation]);

  // Load/save hidden items per week in localStorage
  useEffect(() => {
    if (!currentWeek) return;
    const raw = localStorage.getItem(`sl:hidden:${currentWeek}`);
    setHiddenKeys(new Set(raw ? JSON.parse(raw) : []));
  }, [currentWeek]);

  useEffect(() => {
    if (!currentWeek) return;
    localStorage.setItem(
      `sl:hidden:${currentWeek}`,
      JSON.stringify(Array.from(hiddenKeys))
    );
  }, [currentWeek, hiddenKeys]);

  // Hidden items helper functions
  function hideKey(k: string) {
    setHiddenKeys(prev => new Set(prev).add(k));
  }
  function unhideKey(k: string) {
    setHiddenKeys(prev => {
      const next = new Set(prev);
      next.delete(k);
      return next;
    });
  }
  function clearHidden() {
    setHiddenKeys(new Set());
  }

  // Query client for cache invalidation
  const qc = useQueryClient();

  // Fetch shopping list for current week
  const { data: shoppingListData, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['shopping-list', currentWeek],
    queryFn: () => getShoppingList(currentWeek),
    enabled: !!currentWeek,
    // optional but helpful:
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  // Delete mutation with optimistic updates
  const removeItemMutation = useMutation({
    mutationFn: async (vars: { 
      itemName: string;
      itemQuantity?: string;
      itemUnit?: string;
    }) => {
      // For weekly lists, use the week-board exclusion endpoint
      const amount = vars.itemQuantity && vars.itemUnit 
        ? `${vars.itemQuantity} ${vars.itemUnit}` 
        : undefined;
      
      const res = await fetch(`/api/shopping-list/${currentWeek}/item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "groceries",
          name: vars.itemName,
          amount: amount ?? null,
        }),
      });
      
      if (!res.ok) throw new Error("Failed to delete item");
      return res.json();
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ["shopping-list", currentWeek] });
      const prev = qc.getQueryData<any>(["shopping-list", currentWeek]);

      // Optimistic update
      if (prev?.list?.groceries) {
        const next = { 
          ...prev, 
          list: {
            ...prev.list,
            groceries: prev.list.groceries.filter(
              (item: any) => item.name !== vars.itemName
            )
          }
        };
        qc.setQueryData(["shopping-list", currentWeek], next);
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["shopping-list", currentWeek], ctx.prev);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Item removed",
        description: "Item successfully deleted from shopping list.",
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["shopping-list", currentWeek] });
    },
  });


  // Navigate to different weeks - always push canonical URL
  const goToPrevWeek = () => {
    if (!currentWeek) return;
    const prev = prevWeekISO(currentWeek);
    setCurrentWeek(prev);
    setLocation(`/shopping-list/${prev}`);
  };

  const goToNextWeek = () => {
    if (!currentWeek) return;
    const next = nextWeekISO(currentWeek);
    setCurrentWeek(next);
    setLocation(`/shopping-list/${next}`);
  };

  const handleRefresh = async () => {
    await qc.invalidateQueries({ queryKey: ["shopping-list", currentWeek] });
    await qc.refetchQueries({ queryKey: ["shopping-list", currentWeek] });
  };

  // Auto-refresh when page comes back into focus or visibility changes
  useEffect(() => {
    const onFocus = () => handleRefresh();
    const onVis = () => { 
      if (!document.hidden) handleRefresh(); 
    };
    
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [currentWeek]); // re-wire when week changes

  if (!currentWeek) {
    return <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 p-4">
      <div className="text-center text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Dashboard Button */}
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 shadow-lg rounded-2xl"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Navigation Controls - Mobile: extra spacing, Desktop: normal spacing */}
        <div className="mt-12 md:mt-4 flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToPrevWeek}
              className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-sm font-medium text-white/95 min-w-[120px] text-center bg-white/5 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10 shadow-lg">
              {currentWeek ? formatWeekRange(currentWeek) : "Loading…"}
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToNextWeek}
              className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 shadow-lg"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 shadow-lg"
              aria-busy={isFetching}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Shopping List Content - Mobile: extra spacing */}
        <div className="mt-12 md:mt-4">
          <Card className="border border-white/20 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold text-white/95 flex items-center gap-2">
                🛒 Shopping List
                <span className="text-sm font-normal text-white/70">
                  Week of {formatWeekRange(currentWeek)}
                </span>
              </CardTitle>
              {FEATURES.explainMode === 'alpha' && (
                <WhyChip onOpen={() => setShoppingWhyOpen(true)} label="ⓘ Why these items?" />
              )}
            </div>
            
            {/* Hide/Show Controls */}
            <div className="flex items-center gap-3 mt-3">
              <label className="text-sm flex items-center gap-2 text-white/80">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded bg-white/10 border-white/20"
                  checked={showHidden}
                  onChange={(e)=>setShowHidden(e.target.checked)}
                />
                {showHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Show hidden items
              </label>
              {hiddenKeys.size > 0 && (
                <button
                  type="button"
                  onClick={clearHidden}
                  className="text-xs underline text-white/60 hover:text-white/80 flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear hidden ({hiddenKeys.size})
                </button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-white/70" />
                <p className="text-white/70">Loading shopping list...</p>
              </div>
            ) : shoppingListData?.list?.groceries ? (
              <div className="space-y-6">
                {/* Shopping Items */}
                {shoppingListData.list.groceries.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
                      🛒 Shopping Items
                      <span className="text-xs text-white/60">
                        ({shoppingListData.list.groceries.length} items)
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {shoppingListData.list.groceries.map((item: any, idx: number) => {
                        const k = `${item.name}||${item.quantity || ''}${item.unit || ''}`;
                        const isHidden = hiddenKeys.has(k);
                        if (isHidden && !showHidden) return null;
                        
                        // Format display text: "30 oz chicken" or just "chicken" if no quantity
                        const displayText = item.quantity && item.unit 
                          ? `${item.quantity} ${item.unit} ${item.name}`
                          : item.quantity 
                            ? `${item.quantity} ${item.name}`
                            : item.name;
                        
                        return (
                          <div key={k} className={`flex items-center gap-3 p-3 bg-orange-500/10 backdrop-blur-sm rounded-lg border border-orange-400/20 ${isHidden ? 'opacity-50' : ''}`}>
                            <input type="checkbox" className="rounded" />
                            <div className="flex-1">
                              <span className={`text-white/90 font-medium ${isHidden ? 'line-through' : ''}`}>
                                {displayText}
                              </span>
                            </div>
                            {isHidden ? (
                              <button 
                                className="text-xs underline text-white/60 hover:text-white/80 px-2 py-1" 
                                onClick={()=>unhideKey(k)}
                              >
                                Unhide
                              </button>
                            ) : (
                              <button 
                                className="text-xs underline text-white/60 hover:text-white/80 px-2 py-1" 
                                onClick={()=>hideKey(k)}
                              >
                                Hide
                              </button>
                            )}
                            <TrashButton
                              size="sm"
                              onClick={() => removeItemMutation.mutate({
                                itemName: item.name,
                                itemQuantity: item.quantity,
                                itemUnit: item.unit
                              })}
                              confirm
                              confirmMessage="Delete this shopping list item?"
                              ariaLabel={`Delete ${displayText}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {shoppingListData.list.groceries.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🛒</div>
                    <h3 className="text-lg font-semibold text-white/90 mb-2">
                      No items needed this week
                    </h3>
                    <p className="text-white/70">
                      Add some meals to your weekly meal board to generate your shopping list.
                    </p>
                    <Button
                      onClick={() => setLocation("/weekly-meal-board")}
                      className="mt-4 bg-orange-500/20 backdrop-blur-xl border border-orange-400/30 hover:bg-orange-500/30 text-white shadow-lg"
                    >
                      Go to Meal Board
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">😕</div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">
                  Unable to load shopping list
                </h3>
                <p className="text-white/70 mb-4">
                  There was an error loading your shopping list for this week.
                </p>
                <Button 
                  onClick={handleRefresh} 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 shadow-lg"
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setLocation("/weekly-meal-board")}
            variant="outline"
            className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 shadow-lg"
          >
            📅 Edit Meal Board
          </Button>
          
          <Button
            onClick={() => setLocation("/plan-builder-hub")}
            variant="outline"
            className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 shadow-lg"
          >
            🍽️ Plan Builder Hub
          </Button>
        </div>
      </div>
      
      {/* Why Drawer */}
      {FEATURES.explainMode === 'alpha' && (
        <WhyDrawer 
          open={shoppingWhyOpen} 
          onClose={() => setShoppingWhyOpen(false)}
          title="Why these shopping items?"
          reasons={getShoppingListWhy()}
        />
      )}
    </div>
  );
}
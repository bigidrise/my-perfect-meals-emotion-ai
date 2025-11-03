import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Edit2, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useLocation } from "wouter";
import TrashButton from "@/components/ui/TrashButton";
import { readList, setItems, toggleChecked, deleteItems, updateItem, clearAll, clearChecked, ShopItem, readOptions, writeOptions, setWeekScope } from "@/stores/shoppingListStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MACRO_SOURCES, getMacroSourceBySlug } from "@/lib/macroSourcesConfig";
import AddOtherItems from "@/components/AddOtherItems";
import { readOtherItems } from "@/stores/otherItemsStore";

export default function ShoppingListMasterView() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Extract "from" query parameter once on mount
  const [fromSlug, setFromSlug] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('from') || '';
  });
  
  const [items, setLocalItems] = useState<ShopItem[]>(() => readList().items);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quickAddText, setQuickAddText] = useState("");
  const [opts, setOpts] = useState(() => readOptions());
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [purchasedOpen, setPurchasedOpen] = useState(true);

  useEffect(() => {
    const onUpd = () => setLocalItems(readList().items);
    window.addEventListener("shopping:list:updated", onUpd);
    return () => window.removeEventListener("shopping:list:updated", onUpd);
  }, []);

  useEffect(() => {
    const onOpt = () => setOpts(readOptions());
    window.addEventListener("shopping:options:updated", onOpt);
    return () => window.removeEventListener("shopping:options:updated", onOpt);
  }, []);

  function toggleOpt<K extends keyof typeof opts>(key: K) {
    const next = { ...opts, [key]: !opts[key] };
    writeOptions(next);
    if (key === "scopeByWeek") setWeekScope(next.scopeByWeek);
  }

  const counts = useMemo(()=>({
    total: items.length,
    checked: items.filter(i=>i.checked).length
  }), [items]);

  function onInlineEdit(id: string, field: "qty"|"unit"|"name") {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = field === "qty" ? Number(e.target.value) : e.target.value;
      updateItem(id, field === "qty" ? { qty: Number.isFinite(v as number) ? (v as number) : undefined } : { [field]: v } as any);
    };
  }

  function onClearChecked() {
    if (!confirm("Clear all checked items?")) return;
    clearChecked();
  }

  function onClearAll() {
    if (!confirm("Clear entire shopping list?")) return;
    clearAll();
  }

  function onQuickAdd() {
    if (!quickAddText.trim()) return;
    const name = quickAddText.trim();
    const store = readList();
    const merged = [...store.items];
    merged.push({
      id: `itm_${Math.random().toString(36).slice(2,10)}${Date.now().toString(36)}`,
      name,
      checked: false
    });
    setItems(merged);
    setQuickAddText("");
    toast({ title: "Item added", description: name });
  }

  async function onCopyToClipboard() {
    const mealItems = items
      .filter(i => !i.checked)
      .map(i => `• ${i.name}${i.qty ? ` — ${i.qty}${i.unit ? ' ' + i.unit : ''}` : ''}`);
    
    const otherItems = readOtherItems().items
      .filter(i => !i.checked)
      .map(i => `• ${i.brand ? i.brand + ' ' : ''}${i.name} — ${i.qty} ${i.unit} (${i.category})`);
    
    const sections = [];
    if (mealItems.length > 0) {
      sections.push("Meal Ingredients:\n" + mealItems.join("\n"));
    }
    if (otherItems.length > 0) {
      sections.push("Other Items:\n" + otherItems.join("\n"));
    }
    
    const text = sections.join("\n\n");
    const totalCount = mealItems.length + otherItems.length;
    
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard", description: `${totalCount} items copied` });
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      toast({ title: "Copied to clipboard", description: `${totalCount} items copied` });
    }
  }

  const uncheckedItems = useMemo(() => items.filter(i => !i.checked), [items]);
  const checkedItems = useMemo(() => items.filter(i => i.checked), [items]);

  const groupedUnchecked = useMemo(()=>{
    if (!opts.groupByAisle) return { All: uncheckedItems };
    const map: Record<string,ShopItem[]> = {};
    for (const it of uncheckedItems) {
      const k = it.cat || "Other";
      (map[k] ||= []).push(it);
    }
    return map;
  }, [uncheckedItems, opts.groupByAisle]);

  const groupedChecked = useMemo(()=>{
    if (!opts.groupByAisle) return { All: checkedItems };
    const map: Record<string,ShopItem[]> = {};
    for (const it of checkedItems) {
      const k = it.cat || "Other";
      (map[k] ||= []).push(it);
    }
    return map;
  }, [checkedItems, opts.groupByAisle]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pb-24"
    >
      <Button
        onClick={() => setLocation("/dashboard")}
        className="fixed top-4 left-4 z-50 bg-black/30 hover:bg-black/50 text-white rounded-2xl border border-white/10 backdrop-blur-none"
        size="sm"
        data-testid="button-back-dashboard"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="container mx-auto p-4 max-w-4xl space-y-4 pt-16">
        {/* Header */}
        <div className="rounded-2xl bg-white/5 border border-white/20 p-4 backdrop-blur">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-white text-2xl font-md flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Master Shopping List
              </h1>
              <div className="text-white/70 text-sm mt-1">
                {counts.total} items • {counts.checked} checked
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                className="bg-emerald-600/20 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-600/30" 
                onClick={onCopyToClipboard}
                disabled={items.filter(i => !i.checked).length === 0}
                data-testid="button-copy-list"
              >
                Copy List
              </Button>
            </div>
          </div>

          {/* Quick Add */}
          <div className="mt-4 flex gap-2">
            <Input
              value={quickAddText}
              onChange={(e) => setQuickAddText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onQuickAdd()}
              placeholder="Quick add item..."
              className="bg-black/30 border-white/30 text-white placeholder:text-white/50"
              data-testid="input-quick-add"
            />
            <Button 
              onClick={onQuickAdd} 
              disabled={!quickAddText.trim()}
              className="bg-blue-600/20 border border-blue-400/30 text-blue-200 hover:bg-blue-600/30"
              data-testid="button-quick-add"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Options */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-white/80 text-sm" data-testid="option-group-by-aisle">
              <Checkbox 
                checked={opts.groupByAisle} 
                onCheckedChange={()=>toggleOpt("groupByAisle")} 
                className="h-3 w-3 border-white/40"
              />
              <span>Group by aisle</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm" data-testid="option-exclude-pantry">
              <Checkbox 
                checked={opts.excludePantryStaples} 
                onCheckedChange={()=>toggleOpt("excludePantryStaples")} 
                className="h-3 w-3 border-white/40"
              />
              <span>Exclude pantry staples</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm" data-testid="option-scope-week">
              <Checkbox 
                checked={opts.scopeByWeek} 
                onCheckedChange={()=>toggleOpt("scopeByWeek")} 
                className="h-3 w-3 border-white/40"
              />
              <span>Scope to this week</span>
            </div>
            <select
              value={opts.rounding}
              onChange={(e)=>writeOptions({ ...opts, rounding: e.target.value as "none" | "friendly" })}
              className="bg-white/10 border border-white/20 text-white/90 text-sm rounded-md px-2 py-1"
              title="Rounding"
              data-testid="select-rounding"
            >
              <option value="friendly">Rounding: Friendly</option>
              <option value="none">Rounding: None</option>
            </select>
          </div>
        </div>

        {/* "Came from" Strip */}
        <div className="rounded-2xl border border-white/20 bg-black/60 text-white px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-white/70 text-sm whitespace-nowrap">Came from:</span>
              <Select value={fromSlug} onValueChange={(value) => {
                setFromSlug(value);
                if (value) {
                  const source = getMacroSourceBySlug(value);
                  if (source) {
                    setLocation(source.route);
                  }
                }
              }}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white hover:bg-white/20 flex-1">
                  <SelectValue placeholder="Select a meal builder" />
                </SelectTrigger>
                <SelectContent>
                  {MACRO_SOURCES.map(source => (
                    <SelectItem key={source.slug} value={source.slug}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fromSlug && (() => {
                const source = getMacroSourceBySlug(fromSlug);
                return source ? (
                  <Button
                    onClick={() => setLocation(source.route)}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 whitespace-nowrap"
                    data-testid="button-back-to-source"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back
                  </Button>
                ) : null;
              })()}
            </div>
        </div>

        {/* Add Other Items Section */}
        <AddOtherItems />

        {/* Access / Entitlement Card */}
        <div className="rounded-2xl border border-white/20 bg-black/60 text-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">Shopping Delivery</div>
              <div className="text-sm text-white/80">$29.99 / month</div>
            </div>

            {/* Locked state (show this by default) */}
            <button className="rounded-xl px-4 py-2 border border-white/30 bg-white/10 hover:bg-white/20 text-white transition-colors">
              Unlock Shopping Delivery
            </button>

            {/* Active state (swap the two elements when entitled) */}
            {/* <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-emerald-500/20 border border-emerald-300/40 text-emerald-200 text-xs">Active — Shopping Delivery</div>
            <button className="rounded-xl px-3 py-2 border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm">
              Manage Subscription
            </button> */}
          </div>
        </div>

        {/* Grocery Services Dropdown (black theme) */}
        <details className="rounded-2xl border border-white/20 bg-black/60 text-white">
          <summary className="list-none cursor-pointer select-none px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
            <span className="text-sm font-semibold">Grocery Delivery Options</span>
            <ChevronDown className="h-4 w-4 text-white/70" />
          </summary>

          <div className="px-4 pb-4 pt-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Walmart (Primary) */}
              <div className="rounded-xl border border-white/20 bg-black/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Walmart</div>
                  <span className="text-[11px] rounded-full px-2 py-0.5 bg-emerald-500/20 border border-emerald-300/40 text-emerald-200">Active (MVP)</span>
                </div>
                <div className="text-xs text-white/70 mt-1">Cart prefill via Affiliate Add-to-Cart.</div>
                <div className="mt-3 flex flex-col gap-2">
                  <button className="rounded-lg px-3 py-2 border border-white/30 bg-white/10 hover:bg-white/20 text-sm transition-colors">
                    Shop at Walmart
                  </button>
                  {/* Visible later once OPD approved */}
                  <button className="rounded-lg px-3 py-2 border border-white/20 bg-white/5 text-white/60 text-sm cursor-not-allowed" disabled>
                    Pickup & Delivery (OPD)
                  </button>
                </div>
              </div>

              {/* Instacart */}
              <div className="rounded-xl border border-white/20 bg-black/50 p-4">
                <div className="font-medium">Instacart</div>
                <div className="text-xs text-white/70 mt-1">Shoppable list (Developer Platform).</div>
                <div className="mt-3">
                  <button className="rounded-lg px-3 py-2 border border-white/20 bg-white/5 text-white/60 text-sm cursor-not-allowed" disabled>
                    Shop via Instacart
                  </button>
                </div>
              </div>

              {/* Kroger */}
              <div className="rounded-xl border border-white/20 bg-black/50 p-4">
                <div className="font-medium">Kroger</div>
                <div className="text-xs text-white/70 mt-1">Cart API (free with key).</div>
                <div className="mt-3">
                  <button className="rounded-lg px-3 py-2 border border-white/20 bg-white/5 text-white/60 text-sm cursor-not-allowed" disabled>
                    Shop at Kroger
                  </button>
                </div>
              </div>

              {/* Target */}
              <div className="rounded-xl border border-white/20 bg-black/50 p-4">
                <div className="font-medium">Target</div>
                <div className="text-xs text-white/70 mt-1">Affiliate deep link to products.</div>
                <div className="mt-3">
                  <button className="rounded-lg px-3 py-2 border border-white/20 bg-white/5 text-white/60 text-sm cursor-not-allowed" disabled>
                    Shop at Target
                  </button>
                </div>
              </div>

              {/* Amazon */}
              <div className="rounded-xl border border-white/20 bg-black/50 p-4">
                <div className="font-medium">Amazon</div>
                <div className="text-xs text-white/70 mt-1">Amazon Associates product links.</div>
                <div className="mt-3">
                  <button className="rounded-lg px-3 py-2 border border-white/20 bg-white/5 text-white/60 text-sm cursor-not-allowed" disabled>
                    Shop on Amazon
                  </button>
                </div>
              </div>

              {/* Shipt */}
              <div className="rounded-xl border border-white/20 bg-black/50 p-4">
                <div className="font-medium">Shipt</div>
                <div className="text-xs text-white/70 mt-1">Affiliate now; Platform API later.</div>
                <div className="mt-3">
                  <button className="rounded-lg px-3 py-2 border border-white/20 bg-white/5 text-white/60 text-sm cursor-not-allowed" disabled>
                    Shop via Shipt
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/60 pt-2 border-t border-white/10">
              We never mark up grocery prices. Retailer delivery/pickup fees apply at checkout.
            </p>
          </div>
        </details>

        {/* How to Use Instructions Dropdown */}
        <div className="rounded-2xl bg-white/5 border border-white/20 overflow-hidden backdrop-blur">
          <button
            onClick={() => setInstructionsOpen(!instructionsOpen)}
            className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
          >
            <span className="font-semibold">
              <span className="text-emerald-400">How to Use</span>{" "}
              <span className="text-white">This Shopping List</span>
            </span>
            {instructionsOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {instructionsOpen && (
            <div className="px-4 pb-4 text-white/90 text-sm space-y-3">
              <div>
                <span className="font-semibold text-emerald-400">1. Your List</span> - Items from your meal plans automatically appear here, grouped by store aisle for easy shopping.
              </div>
              <div>
                <span className="font-semibold text-emerald-400">2. Add Items</span> - Type in the "Quick add" box to manually add anything you need.
              </div>
              <div>
                <span className="font-semibold text-emerald-400">3. Check It Off</span> - When you buy an item in the store, check the box. It gets crossed out so you know it's done.
              </div>
              <div>
                <span className="font-semibold text-emerald-400">4. Purchased Items</span> - Checked items move to a "Purchased Today" section at the bottom so you can still see what you bought.
              </div>
              <div>
                <span className="font-semibold text-emerald-400">5. Copy Your List</span> - Hit "Copy List" to get a clean text version you can paste into notes, text to someone, or print.
              </div>
              <div>
                <span className="font-semibold text-emerald-400">6. Clear It Out</span> - "Clear Purchased" removes checked items. "Clear All" empties the whole list to start fresh.
              </div>
              <div>
                <span className="font-semibold text-emerald-400">7. Smart Options</span> - Toggle "Group by aisle" to organize by store sections, or "Scope to this week" to only see items for this week's meals.
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {(counts.checked > 0 || counts.total > 0) && (
          <div className="flex flex-wrap gap-2">
            {counts.checked > 0 && (
              <Button
                onClick={onClearChecked}
                className="bg-orange-600/20 border border-orange-400/30 text-orange-200 hover:bg-orange-600/30"
                size="sm"
                data-testid="button-clear-purchased"
              >
                Clear Purchased
              </Button>
            )}
            {counts.total > 0 && (
              <Button
                onClick={onClearAll}
                variant="destructive"
                size="sm"
                data-testid="button-clear-all"
              >
                Clear All
              </Button>
            )}
          </div>
        )}

        {/* Shopping List - Unchecked Items */}
        {uncheckedItems.length === 0 && checkedItems.length === 0 ? (
          <div className="rounded-2xl bg-white/5 border border-white/20 p-12 text-center backdrop-blur">
            <ShoppingCart className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Your shopping list is empty</p>
            <p className="text-white/40 text-sm mt-2">Paste items or quick add to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedUnchecked).map(([cat, arr])=>(
              <div key={cat} className="rounded-2xl bg-white/5 border border-white/20 p-4 backdrop-blur">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{cat}</h3>
                    <span className="text-white/50 text-xs">{arr.length} items</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      className="h-9 px-3 text-sm bg-white/10 border border-white/25 text-white active:scale-[.98]"
                      onClick={() => {
                        const updated = items.map(i => i.cat === cat ? {...i, checked: true} : i);
                        setItems(updated);
                        setLocalItems(updated);
                      }}
                      data-testid={`button-check-all-${cat}`}
                    >
                      Check all
                    </Button>
                    <Button 
                      size="sm"
                      className="h-9 px-3 text-sm bg-white/10 border border-white/25 text-white active:scale-[.98]"
                      onClick={() => {
                        const updated = items.map(i => i.cat === cat ? {...i, checked: false} : i);
                        setItems(updated);
                        setLocalItems(updated);
                      }}
                      data-testid={`button-uncheck-all-${cat}`}
                    >
                      Uncheck
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {arr.map(item => (
                    <div 
                      key={item.id} 
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        item.checked ? 'bg-white/5 opacity-50' : 'bg-white/10'
                      }`}
                    >
                      <Checkbox
                        checked={item.checked || false}
                        onCheckedChange={() => toggleChecked(item.id)}
                        className="border-white/30"
                        data-testid={`checkbox-bought-${item.id}`}
                      />
                      
                      {editingId === item.id ? (
                        <>
                          <Input
                            defaultValue={item.name}
                            onBlur={(e) => {
                              updateItem(item.id, { name: e.target.value });
                              setEditingId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateItem(item.id, { name: (e.target as HTMLInputElement).value });
                                setEditingId(null);
                              }
                            }}
                            className="flex-1 bg-black/30 border-white/30 text-white h-8"
                            autoFocus
                          />
                          <Input
                            defaultValue={item.qty ?? ""}
                            onChange={onInlineEdit(item.id, "qty")}
                            className="w-16 bg-black/30 border-white/30 text-white h-8"
                            placeholder="Qty"
                          />
                          <Input
                            defaultValue={item.unit ?? ""}
                            onChange={onInlineEdit(item.id, "unit")}
                            className="w-20 bg-black/30 border-white/30 text-white h-8"
                            placeholder="Unit"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                            className="text-white hover:bg-white/10"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className={`flex-1 text-white ${item.checked ? 'line-through' : ''}`}>
                            {item.name}
                          </div>
                          <div className="text-white/70 text-sm shrink-0">
                            {item.qty} {item.unit}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(item.id)}
                            className="text-white hover:bg-white/10"
                            data-testid={`button-edit-${item.id}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <TrashButton
                            size="sm"
                            onClick={() => deleteItems([item.id])}
                            confirm
                            confirmMessage="Delete this shopping list item?"
                            ariaLabel="Delete item"
                            title="Delete item"
                            data-testid={`button-delete-${item.id}`}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Purchased Today Section */}
            {checkedItems.length > 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/20 overflow-hidden backdrop-blur mt-6">
                <button
                  onClick={() => setPurchasedOpen(!purchasedOpen)}
                  className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold">
                      Purchased Today ({checkedItems.length})
                    </span>
                  </div>
                  {purchasedOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                {purchasedOpen && (
                  <div className="p-4 pt-0 space-y-4">
                    {Object.entries(groupedChecked).map(([cat, arr])=>(
                      <div key={cat}>
                        <h4 className="text-white/70 text-sm font-semibold mb-2">{cat}</h4>
                        <div className="space-y-2">
                          {arr.map(item => (
                            <div 
                              key={item.id} 
                              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 opacity-60"
                            >
                              <Checkbox
                                checked={item.checked || false}
                                onCheckedChange={() => toggleChecked(item.id)}
                                className="border-white/30"
                                data-testid={`checkbox-purchased-${item.id}`}
                              />
                              <div className="flex-1 text-white line-through">
                                {item.name}
                              </div>
                              <div className="text-white/70 text-sm shrink-0">
                                {item.qty} {item.unit}
                              </div>
                              <TrashButton
                                size="sm"
                                onClick={() => deleteItems([item.id])}
                                confirm
                                confirmMessage="Delete this purchased item?"
                                ariaLabel="Delete item"
                                title="Delete item"
                                data-testid={`button-delete-purchased-${item.id}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

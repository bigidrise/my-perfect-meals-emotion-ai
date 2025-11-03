import { useState } from "react";
import { ShoppingCart, Copy } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addItems } from "@/stores/shoppingListStore";

type Ingredient = {
  name: string;
  qty?: number | string;
  unit?: string;
};

type Props = {
  ingredients: Ingredient[];
  source?: string;
  sourceSlug?: string; // NEW: slug for back navigation
};

function formatQty(qty?: number | string): string {
  if (!qty) return '';
  const num = typeof qty === 'number' ? qty : parseFloat(String(qty));
  if (isNaN(num)) return String(qty);
  
  // Round to 2 decimal places max, remove trailing zeros
  const rounded = Math.round(num * 100) / 100;
  return rounded.toString().replace(/\.?0+$/, '');
}

export default function ShoppingAggregateBar({ ingredients, source, sourceSlug }: Props) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);

  async function onCopyList() {
    if (ingredients.length === 0) return;
    
    setCopying(true);
    const text = ingredients
      .map(i => `• ${i.name}${i.qty ? ` — ${formatQty(i.qty)}${i.unit ? ' ' + i.unit : ''}` : ''}`)
      .join("\n");
    
    try {
      await navigator.clipboard.writeText(text);
      toast({ 
        title: "Copied to clipboard", 
        description: `${ingredients.length} ingredients copied. Open Master Shopping List to paste.` 
      });
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      toast({ 
        title: "Copied to clipboard", 
        description: `${ingredients.length} ingredients copied` 
      });
    } finally {
      setCopying(false);
    }
  }

  function onAddToList() {
    if (ingredients.length === 0) return;
    
    const items = ingredients.map(i => ({
      name: i.name,
      qty: typeof i.qty === 'number' ? i.qty : (i.qty ? parseFloat(String(i.qty)) : undefined),
      unit: i.unit,
      note: source
    }));
    
    addItems(items);
    toast({ 
      title: "Added to Shopping List", 
      description: `${ingredients.length} items added to your master list` 
    });
    
    // Navigate with source parameter for back navigation
    const url = sourceSlug ? `/shopping-list-v2?from=${sourceSlug}` : "/shopping-list-v2";
    setLocation(url);
  }

  if (ingredients.length === 0) return null;

  return (
    <div className="fixed bottom-8 make me a cookies that I have chocolate peanut butter and walnuts using protein powder left-0 right-0 z-[60] bg-black/95 backdrop-blur-xl border-t border-white/20 shadow-2xl safe-area-inset-bottom">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <div className="flex-1 text-white">
            <div className="font-semibold text-sm sm:text-base">Shopping List Ready</div>
            <div className="text-xs sm:text-sm text-white/80">{ingredients.length} ingredients</div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onCopyList}
              disabled={copying}
              className="flex-1 sm:flex-none min-h-[44px] bg-white/20 hover:bg-white/30 text-white border border-white/30"
              data-testid="button-copy-shopping-list"
            >
              <Copy className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Copy List</span>
            </Button>
            <Button
              onClick={onAddToList}
              className="flex-1 sm:flex-none min-h-[44px] bg-black hover:bg-zinc-900 text-white border border-white/30"
              data-testid="button-go-to-shopping-list"
            >
              <ShoppingCart className="h-5 w-5 sm:mr-2" />
              <span>Add & View List</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

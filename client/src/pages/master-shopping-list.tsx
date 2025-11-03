import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function MasterShoppingList() {
  const [, setLocation] = useLocation();

  return (
    <div
      className="
        min-h-screen
        text-white
        px-4 py-8 sm:px-6
        bg-gradient-to-br
        from-black
        via-black
        to-orange-600
      "
    >
      {/* Fixed Back/Home button */}
      <Button
        onClick={() => setLocation("/dashboard")}
        variant="ghost"
        className="
          fixed top-4 left-4 z-50
          flex items-center gap-2
          rounded-2xl
          bg-black/40
          backdrop-blur-lg
          border border-orange-400/50
          text-orange-400
          hover:bg-orange-500/20
          hover:text-orange-300
          transition
        "
        data-testid="button-back-dashboard"
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Button>

      <div className="max-w-4xl mx-auto">

        {/* Main content card */}
        <div
          className="
            rounded-3xl
            bg-black/60
            backdrop-blur-xl
            border border-orange-400/40
            shadow-[0_0_30px_rgba(251,146,60,0.4)]
            p-8
          "
        >
          <h1 className="text-3xl font-bold mb-4 text-orange-400">
            Master Shopping List
          </h1>

          <p className="text-white/90 mb-8 text-base leading-relaxed">
            One place for everything you buy. We remember what you shop for,
            help you restock fast, and keep it aligned with your meal plan.
          </p>

          <div className="text-center py-10 rounded-2xl bg-black/40 border border-white/10">
            <h2 className="text-xl font-semibold mb-3 text-orange-300">
              Smart Shopping Management
            </h2>

            <p className="text-white/80 max-w-xl mx-auto text-sm leading-relaxed">
              Automatic grocery list builder. Tracks your repeat items. Knows
              what’s left on your plan. No more “what do we need?” guessing.
            </p>

            <div className="mt-6 text-xs text-white/50">
              Coming soon: household sharing, cost tracking, and “restock this
              week” suggestions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

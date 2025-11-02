import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Home, ClipboardEdit, Users } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/glass/GlassCard";

export default function ProPortal() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 via-indigo-600 to-black/80 p-4 sm:p-6">
      {/* Back to Dashboard */}
      <button
        onClick={() => setLocation("/dashboard")}
        className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-black/10 backdrop-blur-none border border-white/20 hover:bg-black/20 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold text-sm sm:text-base transition-all"
      >
        <Home className="h-4 w-4" />
        Dashboard
      </button>

      <div className="max-w-6xl mx-auto pt-14 sm:pt-16 space-y-6">
        {/* Header */}
        <GlassCard>
          <GlassCardContent className="p-6">
            <div className="flex items-center gap-3">
              <ClipboardEdit className="h-6 w-6 text-white/90" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Pro Portal
                </h1>
                <p className="text-white/70 text-sm">
                  Manage your client's meal plans, view their progress, and collaborate on their health journey.
                </p>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="border-2 border-indigo-500/40 cursor-pointer hover:border-indigo-400/60 transition-all">
            <GlassCardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-300" />
                <h2 className="text-xl font-bold text-white">
                  Client Dashboard
                </h2>
              </div>
              <p className="text-sm text-white/70">
                View your client's current meal plan, macro targets, and daily progress.
              </p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard className="border-2 border-teal-500/40 cursor-pointer hover:border-teal-400/60 transition-all">
            <GlassCardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ClipboardEdit className="h-5 w-5 text-teal-300" />
                <h2 className="text-xl font-bold text-white">
                  Add Meals
                </h2>
              </div>
              <p className="text-sm text-white/70">
                Create and assign meals to your client's meal plan based on their preferences.
              </p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard className="border-2 border-emerald-500/40 cursor-pointer hover:border-emerald-400/60 transition-all">
            <GlassCardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ClipboardEdit className="h-5 w-5 text-emerald-300" />
                <h2 className="text-xl font-bold text-white">
                  Edit Plan
                </h2>
              </div>
              <p className="text-sm text-white/70">
                Modify meal plans, adjust macro targets, and customize dietary preferences.
              </p>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Coming Soon Notice */}
        <GlassCard className="border-2 border-purple-500/40">
          <GlassCardContent className="p-6">
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-white">Pro Portal Features Coming Soon</h3>
              <p className="text-white/70 text-sm max-w-2xl mx-auto">
                The Pro Portal is currently under development. You'll soon be able to manage client meal plans, 
                track their progress, add custom meals, and collaborate seamlessly on their health journey.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setLocation("/care-team")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Back to Care Team
                </button>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
}

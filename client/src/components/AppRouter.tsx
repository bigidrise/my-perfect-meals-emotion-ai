import GameHub from "@/pages/GameHub";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import IngredientsTetris from "@/pages/IngredientsTetris";
import { useLocation, Switch, Route } from "wouter";
import DisclaimerModal from "./DisclaimerModal";
import EmotionalGate from "./EmotionalGate";
import { justFinished } from "@/lib/completion";
// Removed weeklyPlanApi import as meal calendar functionality was removed

// ✅ Import your TrackWater page
import TrackWater from "@/pages/track-water";

// ✅ Import WeeklyMealBoard
import WeeklyMealBoard from "@/pages/WeeklyMealBoard";

// Import FastFoodHub and FastFoodRestaurant
import FastFoodHub from "@/pages/FastFoodHub";
import FastFoodRestaurant from "@/pages/FastFoodRestaurant";
import DiabeticHub from "@/pages/DiabeticHub";
import DiabeticMenuBuilder from "@/pages/DiabeticMenuBuilder";
import DiabeticMenuBoard from "@/pages/DiabeticMenuBoard";
import DiabetesSupport from "@/pages/DiabetesSupport";
import MedicalDietHub from "@/pages/MedicalDietHub";
import SmartMenuBuilder from "@/pages/SmartMenuBuilder";
import GLP1Hub from "@/pages/GLP1Hub";

interface AppRouterProps {
  children: React.ReactNode;
}

export default function AppRouter({ children }: AppRouterProps) {
  const [location, setLocation] = useLocation();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showEmotionalGate, setShowEmotionalGate] = useState(false);

  // Weekly plan generation removed as meal calendar functionality was disabled

  useEffect(() => {
    // Guard bypass: Skip all checks for 3 seconds after onboarding completion
    if (justFinished()) {
      console.log("⏰ Bypassing all guards - just finished onboarding");
      setShowDisclaimer(false);
      setShowEmotionalGate(false);
      return;
    }

    const onboardingCompleted = localStorage.getItem("onboardingCompleted") === "true";
    const disclaimerAccepted = localStorage.getItem("disclaimerAccepted") === "true";

    console.log("🎯 AppRouter: Checking flow state", {
      onboardingCompleted,
      disclaimerAccepted,
      currentLocation: location
    });

    // Exempt certain public routes from gates
    const publicRoutes = ["/", "/pricing", "/affiliates", "/auth", "/competition-beachbody-board"];
    const locationPath = location.split('?')[0]; // Strip query params for route matching
    if (publicRoutes.includes(locationPath)) {
      setShowDisclaimer(false);
      setShowEmotionalGate(false);
      return;
    }

    // Show disclaimer if not accepted (for new accounts)
    if (!disclaimerAccepted && !onboardingCompleted) {
      console.log("📋 Showing disclaimer");
      setShowDisclaimer(true);
      setShowEmotionalGate(false);
      return;
    }

    // Route to onboarding if disclaimer accepted but onboarding not completed
    if (disclaimerAccepted && !onboardingCompleted) {
      console.log("📝 Routing to /onboarding");
      setShowDisclaimer(false);
      setShowEmotionalGate(false);
      if (location !== "/onboarding") {
        setLocation("/onboarding");
      }
      return;
    }

    // All gates passed - show normal app
    console.log("✅ All gates passed, showing main app");
    setShowDisclaimer(false);
    setShowEmotionalGate(false);

    // If at root and everything is complete, go to main dashboard (logged in users)
    if (location === "/" && onboardingCompleted) {
      const isLoggedIn = localStorage.getItem("isAuthenticated") === "true";
      if (isLoggedIn) {
        console.log("🔄 Authenticated user at root - redirecting to dashboard");
        setLocation("/dashboard");
        // Ensure we start at top of dashboard on fresh app loads
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
        }, 100);
      }
    }
  }, [location, setLocation]);

  const handleDisclaimerAccept = () => {
    console.log("✅ Disclaimer accepted");
    localStorage.setItem("disclaimerAccepted", "true");
    setShowDisclaimer(false);
    setLocation("/onboarding");
  };

  const handleEmotionalGateComplete = () => {
    console.log("✅ Emotional gate completed");
    setShowEmotionalGate(false);
    setLocation("/onboarding");
  };

  // Show disclaimer modal
  if (showDisclaimer) {
    return (
      <>
        <DisclaimerModal onAccept={handleDisclaimerAccept} />
      </>
    );
  }

  // Show emotional gate
  if (showEmotionalGate) {
    return (
      <>
        <EmotionalGate />
      </>
    );
  }

  // Show normal app
  return (
    <>
      {children}
    </>
  );
}
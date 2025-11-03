import React, { lazy } from "react";
import { Switch, Route, useLocation } from "wouter";
import ScrollRestorer from "@/components/ScrollRestorer";
import BottomNav from "@/components/BottomNav";
// import MealLogHistoryPage from "@/pages/MealLogHistoryPage"; // TEMPORARILY DISABLED - File missing
import ABTestingDemo from "@/pages/ABTestingDemo";
import { FEATURES } from "@/utils/features";
import ComingSoon from "@/pages/ComingSoon";

// Plan Builder Pages
// DELETED: PlanBuilderTurbo, PlanBuilderHub, CompetitionBeachbodyBoard, AthleteBoard
import WeeklyMealBoard from "@/pages/WeeklyMealBoard";
import MacroCounter from "@/pages/MacroCounter";
// DELETED: AdultBeverageHubPage
import EmotionAIHub from "@/pages/EmotionAIHub";

// New Simple Plan page
// Page imports
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DashboardNew from "@/pages/DashboardNew";
import Learn from "@/pages/Learn";
import ProfileNew from "@/pages/Profile";
import Onboarding from "@/pages/onboarding"; // Legacy onboarding
import OnboardingV2 from "@/pages/OnboardingV2"; // New V2 onboarding
import Welcome from "@/pages/Welcome";
import Auth from "@/pages/Auth";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import PricingPage from "@/pages/PricingPage";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import FamilyInfoPage from "@/pages/FamilyInfoPage";
import AdminModerationPage from "@/pages/admin-moderation";
// DELETED: CommunityTestPage, CommunityPage (no page component exists)

// Additional component imports
// DELETED: MealPlanningHubRevised (comprehensive-meal-planning-revised)
import CravingCreator from "@/pages/craving-creator";
import FridgeRescuePage from "@/pages/fridge-rescue";
import RestaurantGuidePage from "@/pages/restaurant-guide";
// DELETED: PotluckPlanner, ToddlersMealsHub, CampingMealsHubPage, TailgatingHub, SmartWeekBuilder, MealsForKidsHubPage, KidsDrinksHubPage, KidsLunchboxPlanner, KidsIMadeItMyself
import {
  BreakfastMealsHub,
  LunchMealsHub,
  DinnerMealsHub,
  SnacksMealsHub,
} from "@/features/meals/MealHubFactory";

// DELETED: GameHub, AlcoholHub, WhyVsWhat

// Dashboard navigation pages
import TutorialHub from "@/pages/TutorialHub";
import MyBiometrics from "@/pages/my-biometrics";
import BodyComposition from "@/pages/biometrics/body-composition";
import Sleep from "@/pages/biometrics/sleep";
import GetInspiration from "@/pages/GetInspiration";

// DELETED: All non-MVP pages (hubs, specialty features, etc.)

// ✅ NEW: Unified Food Logging
// import FoodLogToday from "@/pages/FoodLogToday"; // TEMPORARILY DISABLED - File missing
// import FoodLogHistory from "@/pages/FoodLogHistory"; // TEMPORARILY DISABLED - File missing

// DELETED: WomensHealthHub, WomensHealthHubEducational, MensHealthHubEducational, WellnessHub, DailyJournalPage

// Shopping List (core MVP feature)
import ShoppingListView from "@/pages/ShoppingListView";
import ShoppingListMasterView from "@/pages/ShoppingListMasterView";

// Pro Portal (core MVP feature)
import CareTeam from "@/pages/CareTeam";
import ProPortal from "@/pages/ProPortal";
import ProClients from "@/pages/pro/ProClients";
import ProClientDashboard from "@/pages/pro/ProClientDashboard";
import AthleteBoard from "@/pages/pro/AthleteBoard";

// Physician Hub Pages
import DiabeticSupportHub from "@/pages/physician/DiabeticSupportHub";
import DiabetesSupportPage from "@/pages/physician/DiabetesSupportPage";
import DiabeticMenuBuilder from "@/pages/physician/DiabeticMenuBuilder";
import GLP1Hub from "@/pages/physician/GLP1Hub";
import GLP1MealBuilder from "@/pages/physician/GLP1MealBuilder";
import MedicalDietsHub from "@/pages/physician/MedicalDietsHub";

// Craving pages
import CravingHub from "@/pages/CravingHub";
import CravingPresets from "@/pages/CravingPresets";

// Founders page
import FoundersPage from "@/pages/Founders";

// DELETED: AffiliatesPage

// Vitals Logger - Creating a placeholder for this route
const VitalsLogger = () => <div>Vitals Logger - Coming Soon</div>;

export default function Router() {
  const [location] = useLocation();

  // Add fallback protection
  if (!location) {
    return <DashboardNew />;
  }

  // Pages where BottomNav should NOT appear (pre-login/onboarding pages + shopping list generators)
  const hideBottomNavRoutes = [
    '/',
    '/auth',
    '/welcome',
    '/forgot-password',
    '/reset-password',
    '/onboarding',
    '/onboarding-v2',
    '/onboarding-legacy',
    '/pricing',
    '/checkout/success',
    '/weekly-meal-board',
    '/weekly',
    '/athlete-board',
  ];

  // Check for dynamic routes (e.g., /pro/clients/:id/athlete-board)
  const shouldShowBottomNav = !hideBottomNavRoutes.includes(location) && !location.includes('/athlete-board');

  // The rest of the original routes are kept below.

  return (
    <>
      <ScrollRestorer />
      <Switch>
        {/* Core Routes */}
        <Route path="/" component={Welcome} />
        <Route path="/home" component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/checkout/success" component={CheckoutSuccess} />
        <Route path="/family-info" component={FamilyInfoPage} />
        <Route path="/admin-moderation" component={AdminModerationPage} />
        {/* DELETED: CommunityTestPage, CommunityPage routes */}
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/onboarding-v2" component={OnboardingV2} />
        <Route path="/onboarding-legacy" component={Onboarding} />
        <Route path="/dashboard" component={DashboardNew} />
        <Route path="/tutorials" component={TutorialHub} />
        <Route path="/learn" component={Learn} />
        <Route path="/get-inspiration" component={GetInspiration} />
        <Route path="/profile" component={ProfileNew} />
        {/* DELETED: AffiliatesPage, FoundersPage, FoundersSubmit, Changelog routes */}

        {/* DELETED: MealPlanning, LowGlycemicCarbPage, AiMealCreatorPage, MealPlanningHubRevised routes */}
        <Route path="/emotion-ai" component={EmotionAIHub} />
        <Route path="/craving-creator" component={CravingCreator} />
        <Route path="/fridge-rescue" component={FridgeRescuePage} />
        <Route path="/ab-testing-demo" component={ABTestingDemo} />
        {/* DELETED: HolidayFeastPlannerPage, MealFinderPage, BreakfastMealsHub, LunchMealsHub, DinnerMealsHub, SnacksMealsHub, CulturalCuisinesPage, VegetableFiberInfo, PotluckPlanner routes */}
        <Route path="/restaurant-guide" component={RestaurantGuidePage} />

        {/* DELETED: SmartWeekBuilder, AdultBeverageHubPage routes */}
        <Route path="/macro-counter" component={MacroCounter} />

        {/* DELETED: All kids meal routes, all alcohol hub routes */}

        <Route path="/my-biometrics" component={MyBiometrics} />

        {/* Biometric sub-pages */}
        <Route path="/biometrics" component={MyBiometrics} />
        <Route path="/biometrics/body-composition" component={BodyComposition} />
        <Route path="/biometrics/sleep" component={Sleep} />

        {/* ✅ NEW: Unified Food Logging Routes */}
        {/* <Route path="/food" component={FoodLogToday} /> */} {/* TEMPORARILY DISABLED - File missing */}
        {/* <Route path="/food/history" component={FoodLogHistory} /> */} {/* TEMPORARILY DISABLED - File missing */}

        {/* 🔄 REDIRECTS: Old meal logging URLs to new unified system */}
        <Route path="/meal-log/history">
          {() => {
            window.location.href = "/food/history";
            return null;
          }}
        </Route>
        <Route path="/meal-log">
          {() => {
            window.location.href = "/food";
            return null;
          }}
        </Route>

        {/* DELETED: WellnessHub, DailyJournalPage, WomensHealthHubEducational, MensHealthHubEducational routes */}

        {/* DELETED: Redirects to deleted hormone hub pages */}

        {/* DELETED: InspirationJournal, DailyJournal, WeeklyNewsletter, TrackWater routes */}

        {/* DELETED: All meal planning hub pages, specialty routes: MasterShoppingList, VoiceSettings, SimplePlanPage, SupplementHub, LabValueSupport, LearnToCook, KidsMealsHub, BloodSugarHub, BodyComposition, CycleTracking, Calendar, SupplementEducation, SuccessStories, DailySummary, WinePairing, MealPairingAI, UpgradePage, WellnessCompanion, StressEatingSolution, PlanBuilderHub */}
        {/* Cafeteria Setup route: show page if enabled; otherwise Coming Soon */}
        <Route path="/cafeteria-setup">
          <ComingSoon
            title="Cafeteria Setup"
            blurb="We'll auto-generate meals from your onboarding preferences here."
            hint="For now, use Add from Menu or Fridge Rescue."
            ctaLabel="Open Weekly Meal Board"
            ctaHref="/weekly-meal-board"
          />
        </Route>

        {/* DELETED: TemplateHub route */}
        <Route path="/weekly" component={WeeklyMealBoard} />
        {/* DELETED: PlanBuilderTurbo, ProteinPlannerPage, PlanBuilderHub, CompetitionBeachbodyBoard routes */}
        <Route path="/weekly-meal-board" component={WeeklyMealBoard} />

        {/* Legacy redirects - redirect Classic Builder to Weekly Meal Board */}
        <Route path="/plan-builder/classic" component={WeeklyMealBoard} />
        <Route path="/builder/classic" component={WeeklyMealBoard} />
        {/* DELETED: PlanBuilderTurbo route */}

        {/* DELETED: CravingHub, CravingPresetsPage, SearchPage, PhysicianReportView, SmartMenuBuilder routes */}

        {/* DELETED: GLP1Hub, GLP1MealBuilder, SpecialtyDietsHub, HormonePresetDetail, HormonePreviewWeeklyBoard, ToughDayCompanion, DiabetesSupport routes */}

        {/* Health Support Routes */}

        {/* Meal Log History Route */}
        {/* <Route path="/meal-log-history" component={MealLogHistoryPage} /> */} {/* TEMPORARILY DISABLED - File missing */}

        {/* Shopping List Routes */}
        <Route path="/shopping-list-v2" component={ShoppingListMasterView} />
        <Route path="/shopping-list" component={ShoppingListView} />
        <Route
          path="/shopping-list/:weekStartISO"
          component={ShoppingListView}
        />

        {/* ProCare Feature Routes (Care Team → Pro Portal → Client Dashboard → Athlete Board) */}
        <Route path="/care-team" component={CareTeam} />
        <Route path="/pro-portal" component={ProPortal} />
        <Route path="/pro/clients" component={ProClients} />
        <Route path="/pro/clients/:id" component={ProClientDashboard} />
        <Route path="/pro-client-dashboard" component={ProClientDashboard} />
        <Route path="/athlete-board" component={AthleteBoard} />
        <Route path="/pro/clients/:id/athlete-board">
          {() => <AthleteBoard mode="procare" />}
        </Route>

        {/* Physician Hub Routes (Diabetic, GLP-1, Medical Diets, Clinical Lifestyle) */}
        <Route path="/diabetic-hub" component={DiabeticSupportHub} />
        <Route path="/diabetes-support" component={DiabetesSupportPage} />
        <Route path="/diabetic-menu-builder" component={DiabeticMenuBuilder} />
        <Route path="/glp1-hub" component={GLP1Hub} />
        <Route path="/glp1-meal-builder" component={GLP1MealBuilder} />
        <Route path="/medical-diets-hub" component={MedicalDietsHub} />

        {/* Craving Creator Routes */}
        <Route path="/craving-hub" component={CravingHub} />
        <Route path="/craving-presets" component={CravingPresets} />

        {/* Founders Route */}
        <Route path="/founders" component={FoundersPage} />

        {/* 404 fallback */}
        <Route component={NotFound} />
      </Switch>
      {shouldShowBottomNav && <BottomNav />}
    </>
  );
}
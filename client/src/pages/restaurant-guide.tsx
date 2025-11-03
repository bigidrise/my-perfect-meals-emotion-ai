// 🔒🔒🔒 RESTAURANT GUIDE FINAL LOCKDOWN (AUGUST 30, 2025) 🔒🔒🔒
// STATUS: Production-ready, permanently locked for testing phase
// USER COMMAND: "lockdown the restaurant guide... we dont have to change anything it working great"
// FEATURES LOCKED: ✅ AI meal generation ✅ Animated progress bar ✅ Medical badges ✅ Image generation ✅ Caching system
// 
// ⚠️ ZERO-TOLERANCE LOCKDOWN POLICY ⚠️
// DO NOT MODIFY ANY CODE IN THIS FILE WITHOUT EXPLICIT USER APPROVAL
// ALL FEATURES ARE PRODUCTION-READY AND LOCKED FOR TESTING DEPLOYMENT
// 
// 🔒 PROTECTED SYSTEMS:
// - AI restaurant meal generation with GPT-5 integration
// - Animated "power bar" progress system (3-5 minute generation time)
// - Medical compatibility badge system
// - DALL-E image generation for meal visualization  
// - Persistent caching system (survives navigation/refresh)
// - Real-time progress ticker (0-90% with visual feedback)
// - Medical personalization with user health data integration
//
// BACKUP: Restaurant Guide system working perfectly - NO CHANGES NEEDED
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Home, Sparkles, Clock, Users, ArrowUp, ArrowLeft, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import HealthBadgesDropdown from "@/components/badges/HealthBadgesDropdown";
import {
  generateMedicalBadges,
  getUserMedicalProfile,
} from "@/utils/medicalPersonalization";
import PhaseGate from "@/components/PhaseGate";

// ---- Persist the generated restaurant meal so it never "disappears" ----
const CACHE_KEY = "restaurantGuide.cache.v1";

type CachedRestaurantState = {
  restaurantData: any;
  restaurant: string;
  cuisine: string;
  generatedAtISO: string;
};

function saveRestaurantCache(state: CachedRestaurantState) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(state));
  } catch {}
}

function loadRestaurantCache(): CachedRestaurantState | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Minimal sanity checks
    if (!parsed?.restaurantData?.meals || !Array.isArray(parsed.restaurantData.meals)) return null;
    return parsed as CachedRestaurantState;
  } catch {
    return null;
  }
}

function clearRestaurantCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
}

const cuisineTips: Record<string, string[]> = {
  Mexican: [
    "Choose grilled meats over fried",
    "Ask for corn tortillas instead of flour",
    "Skip the chips or share them with the table",
    "Opt for beans and veggies as sides instead of rice",
  ],
  Italian: [
    "Choose red sauces over creamy ones",
    "Order grilled fish or chicken entrees",
    "Ask for dressing on the side with salads",
    "Limit the bread basket – or skip it",
  ],
  American: [
    "Look for grilled or baked options",
    "Ask to swap fries for a side salad",
    "Watch for added sauces and condiments",
    "Split large portions or take half to-go",
  ],
  Mediterranean: [
    "Opt for lean proteins like chicken, lamb, or fish",
    "Use olive oil sparingly",
    "Add hummus, tabbouleh, or grilled veggies",
    "Ask for half-rice or salad plates",
  ],
  Chinese: [
    "Choose steamed dishes over fried",
    "Ask for sauce on the side",
    "Opt for brown rice instead of white",
    "Load up on vegetables and lean proteins",
  ],
  Indian: [
    "Choose tandoori or grilled options",
    "Ask for less oil in curries",
    "Opt for dal (lentils) for protein",
    "Choose naan sparingly or skip it",
  ],
  Japanese: [
    "Go for sashimi or grilled fish over tempura",
    "Choose miso soup and edamame for starters",
    "Pick cucumber or avocado rolls over fried rolls",
    "Limit sauces like eel sauce or mayo-based toppings",
  ],
};

const cuisineKeywords: Record<string, string> = {
  // Fast Food American
  mcdonalds: "American",
  "mcdonald's": "American",
  "mc donald's": "American",
  burger: "American",
  king: "American",
  "burger king": "American",
  kfc: "American",
  popeyes: "American",
  "chick-fil-a": "American",
  chick: "American",
  fil: "American",
  wendys: "American",
  "wendy's": "American",
  subway: "American",
  grill: "American",
  bbq: "American",
  diner: "American",

  // Mexican
  taco: "Mexican",
  burrito: "Mexican",
  chipotle: "Mexican",
  "taco bell": "Mexican",
  bell: "Mexican",

  // Italian
  pizza: "Italian",
  pasta: "Italian",
  garden: "Italian",
  bistro: "Italian",
  olive: "Italian",
  "olive garden": "Italian",

  // Indian
  curry: "Indian",
  tandoori: "Indian",
  masala: "Indian",

  // Chinese
  panda: "Chinese",
  wok: "Chinese",
  express: "Chinese",
  "panda express": "Chinese",

  // Japanese
  sushi: "Japanese",
  hibachi: "Japanese",
  ramen: "Japanese",
  teriyaki: "Japanese",

  // Mediterranean
  pita: "Mediterranean",
  hummus: "Mediterranean",
  shawarma: "Mediterranean",
  gyro: "Mediterranean",
};

export default function RestaurantGuidePage() {
  const [, setLocation] = useLocation();
  const [restaurantInput, setRestaurantInput] = useState("");
  const [matchedCuisine, setMatchedCuisine] = useState<string | null>(null);
  const [generatedMeals, setGeneratedMeals] = useState<any[]>([]);
  const { toast } = useToast();

  // 🔋 Progress bar state (real-time ticker like HolidayFeast)
  const [progress, setProgress] = useState(0);
  const tickerRef = useRef<number | null>(null);

  // Restore cached restaurant meals on mount (so generated meals come back)
  useEffect(() => {
    const cached = loadRestaurantCache();
    if (cached?.restaurantData?.meals?.length) {
      setGeneratedMeals(cached.restaurantData.meals);
      setRestaurantInput(cached.restaurant || "");
      setMatchedCuisine(cached.cuisine || null);
      toast({
        title: "🔄 Restaurant Guide Restored",
        description: "Your generated restaurant meals will remain saved on this page until you search again.",
      });
    }
  }, []); // Only run once on mount

  // Auto-save whenever relevant state changes (so it's always fresh)
  useEffect(() => {
    if (generatedMeals.length > 0) {
      saveRestaurantCache({
        restaurantData: { meals: generatedMeals },
        restaurant: restaurantInput,
        cuisine: matchedCuisine || "",
        generatedAtISO: new Date().toISOString(),
      });
    }
  }, [generatedMeals, restaurantInput, matchedCuisine]);

  const startProgressTicker = () => {
    if (tickerRef.current) return;
    setProgress(0); // Reset progress
    tickerRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p < 90) {
          const next = p + Math.max(1, Math.floor((90 - p) * 0.07));
          return Math.min(next, 90);
        }
        return p;
      });
    }, 150);
  };

  const stopProgressTicker = () => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    setProgress(100); // Complete progress
  };

  // Restaurant meal generation mutation
  const generateMealsMutation = useMutation({
    mutationFn: async (params: { restaurantName: string; cuisine: string }) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch("/api/restaurants/analyze-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: params.restaurantName,
          cuisine: params.cuisine,
          userId: localStorage.getItem("userId") || "1",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to generate restaurant meals");
      }

      return response.json();
    },
    onMutate: () => {
      startProgressTicker();
    },
    onSuccess: (data) => {
      stopProgressTicker();
      setGeneratedMeals(data.recommendations || []);
      
      // Immediately cache the new restaurant meals so they survive navigation/refresh
      saveRestaurantCache({
        restaurantData: data,
        restaurant: restaurantInput,
        cuisine: matchedCuisine || "",
        generatedAtISO: new Date().toISOString(),
      });
      
      toast({
        title: "🍽️ Restaurant Meals Generated!",
        description: `Found ${data.recommendations?.length || 0} healthy options for you.`,
      });
    },
    onError: (error: Error) => {
      stopProgressTicker();
      toast({
        title: "Generation Failed",
        description:
          error.name === "AbortError"
            ? "Request timed out. Please try again."
            : error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!restaurantInput.trim()) {
      toast({
        title: "Please enter a restaurant name",
        description: "Type a restaurant or cuisine to get started.",
        variant: "destructive",
      });
      return;
    }

    const lowerInput = restaurantInput.toLowerCase();

    const keywordMatch = Object.keys(cuisineKeywords).find((keyword) =>
      lowerInput.includes(keyword),
    );

    const match = keywordMatch
      ? cuisineKeywords[keywordMatch]
      : Object.keys(cuisineTips).find((cuisine) =>
          lowerInput.includes(cuisine.toLowerCase()),
        );

    setMatchedCuisine(match || null);

    // Generate meals if cuisine is matched
    if (match) {
      generateMealsMutation.mutate({
        restaurantName: restaurantInput,
        cuisine: match,
      });
    } else {
      generateMealsMutation.mutate({
        restaurantName: restaurantInput,
        cuisine: "American",
      });
    }
  };

  const handleGoBack = () => {
    setLocation("/emotion-ai");
  };

  return (
    <PhaseGate phase="PHASE_1_CORE" feature="restaurant-guide">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Portal-like button positioned outside the main stacking context */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleGoBack}
        className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-black/10 backdrop-blur-none border border-white/20 hover:bg-black/30 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold text-sm sm:text-base transition-all"
        style={{ 
          zIndex: 2147483647,
          position: 'fixed',
          isolation: 'isolate',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <ArrowLeft className="h-4 w-4 text-white" />
      
      </Button>

      <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 p-4 sm:p-6 overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          <div className="flex items-center gap-4 mb-6">

          </div>

        <div className="bg-black/20 backdrop-blur-none border border-white/20 shadow-xl rounded-2xl text-center mb-6 sm:mb-8 p-6 mb-2 mt-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
          Restaurant Guide
          </h1>
          <p className="text-sm sm:text-lg text-white/80">
            Get healthy ordering tips for any restaurant
          </p>
        </div>

        {/* Find Meals Near Me Card - MOVED TO TOP */}
        <Card className="bg-black/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5" />
              Find Meals Near Me
            </CardTitle>
            <CardDescription className="text-white/80">
              Search for meals you're craving at nearby restaurants by ZIP code
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4 text-white/90">
              Enter what you're craving and your location to find healthy restaurant options near you.
            </p>
            <Button
              onClick={() => setLocation("/craving-finder")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Find Meals Near Me
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5" />
              Restaurant Meal Generator
            </CardTitle>
            <CardDescription className="text-white/80">
              Find your restaurant by food type or restaurant name
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4 text-white/90">
              Type the name of a restaurant or cuisine to get healthy ordering
              tips that work with your goals.
            </p>

            <div className="mb-4 p-3 bg-black/20 border border-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-blue-200">
                <Clock className="inline h-4 w-4 mr-1" />
                <strong>Generation Time:</strong>  AI searching for Meal recommendations can take 60-90 seconds
                  to generate. Please be patient.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="relative">
                <Input
                  placeholder="e.g. Olive Garden, Panda Express, Chipotle"
                  value={restaurantInput}
                  onChange={(e) => setRestaurantInput(e.target.value)}
                  className="w-full pr-10 bg-black/40 backdrop-blur-lg border border-white/20 text-white placeholder:text-white/50"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                {restaurantInput && (
                  <button
                    onClick={() => setRestaurantInput("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>
              <Button
                onClick={handleSearch}
                disabled={generateMealsMutation.isPending}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                {generateMealsMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Generating 3 Options...
                  </div>
                ) : (
                  "Get 2 Options"
                )}
              </Button>
            </div>

            {/* Generated Meals Section */}
            {generatedMeals.length > 0 && (
              <div className="space-y-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  🍽️ Recommended {matchedCuisine} Meals:
                </h2>
                <div className="grid gap-4">
                  {generatedMeals.map((meal, index) => (
                    <Card
                      key={meal.id || index}
                      className="overflow-hidden shadow-lg hover:shadow-orange-500/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-black/40 backdrop-blur-lg border border-white/20"
                    >
                      <div className="grid md:grid-cols-3 gap-4">
                        {/* Meal Image */}
                        <div className="relative h-48 md:h-auto">
                          {meal.imageUrl ? (
                            <img
                              src={meal.imageUrl}
                              alt={meal.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-black/20 backdrop-blur-lg flex items-center justify-center">
                              <div className="text-4xl">🍽️</div>
                            </div>
                          )}
                        </div>

                        {/* Meal Details */}
                        <div className="md:col-span-2 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {meal.name || meal.meal}
                            </h3>
                            <span className="text-sm text-white/90 bg-orange-600 px-2 py-1 rounded font-medium">
                              {meal.calories} cal
                            </span>
                          </div>

                          <p className="text-white/80 mb-3">
                            {meal.description || meal.reason}
                          </p>

                          {/* Medical Badges */}
                          {(() => {
                            // Generate medical badges client-side like weekly meal calendar
                            const userProfile = getUserMedicalProfile(1);
                            const mealForBadges = {
                              name: meal.name || meal.meal,
                              calories: meal.calories,
                              protein: meal.protein,
                              carbs: meal.carbs,
                              fat: meal.fat,
                              ingredients:
                                meal.ingredients?.map((ing: any) => ({
                                  name: ing,
                                  amount: 1,
                                  unit: "serving",
                                })) || [],
                            };
                            const medicalBadges = generateMedicalBadges(
                              mealForBadges as any,
                              userProfile,
                            );
                            // Convert complex badge objects to simple strings for HealthBadgesDropdown
                            const badgeStrings = medicalBadges.map((b: any) => b.badge || b.label || b.id);
                            return (
                              badgeStrings &&
                              badgeStrings.length > 0 && (
                                <div className="mb-3">
                                  <HealthBadgesDropdown badges={badgeStrings} className="mt-2" />
                                </div>
                              )
                            );
                          })()}

                          {/* Nutrition Info */}
                          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                            <div className="text-center">
                              <div className="font-semibold text-blue-400">
                                {meal.protein}g
                              </div>
                              <div className="text-white/60">Protein</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-green-400">
                                {meal.carbs}g
                              </div>
                              <div className="text-white/60">Carbs</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-yellow-400">
                                {meal.fat}g
                              </div>
                              <div className="text-white/60">Fat</div>
                            </div>
                          </div>

                          {/* Why It's Healthy */}
                          <div className="bg-black/20 border border-white/10 rounded-lg p-3 mb-3 backdrop-blur-sm">
                            <h4 className="font-medium text-green-300 text-sm mb-1">
                              Why This is Healthy:
                            </h4>
                            <p className="text-green-200 text-sm">
                              {meal.reason}
                            </p>
                          </div>

                          {/* Modifications */}
                          <div className="bg-black/20 border border-white/10 rounded-lg p-3 backdrop-blur-sm">
                            <h4 className="font-medium text-orange-300 text-sm mb-1">
                              Ask For:
                            </h4>
                            <p className="text-orange-200 text-sm">
                              {meal.modifications || meal.orderInstructions}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State with Power Bar */}
            {generateMealsMutation.isPending && (
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-2 text-orange-600 mb-4">
                  <Sparkles className="h-6 w-6 animate-spin" />
                  <span className="text-lg font-medium">
                    Generating personalized meals...
                  </span>
                </div>
                
                {/* Animated Progress Bar */}
                <div className="max-w-md mx-auto mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">AI Analysis Progress</span>
                    <span className="text-sm text-white/80">{Math.round(progress)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-3 bg-black/30 border border-white/20" 
                  />
                </div>
                
                <p className="text-white/60 text-sm">
                  AI searching for Meal recommendations can take 60-90 seconds
                  to generate. Please be patient.
                </p>
              </div>
            )}

            {matchedCuisine &&
            !generateMealsMutation.isPending &&
            generatedMeals.length === 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-orange-400">
                  {matchedCuisine} Cuisine Tips:
                </h2>
                <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-lg p-4">
                  <ul className="space-y-2">
                    {cuisineTips[matchedCuisine].map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">•</span>
                        <span className="text-white/80">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-black/20 border border-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-orange-200 text-sm">
                    💡 <strong>Pro Tip:</strong> These recommendations are
                    tailored to help you stay on track with your health goals
                    while still enjoying dining out!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-white mb-2">
                  Try typing a restaurant name or cuisine type above
                </p>
                <p className="text-sm text-white">
                  Supported cuisines: Mexican, Italian, American, Mediterranean,
                  Chinese, Indian, Japanese
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/20">
              <h3 className="font-semibold text-white mb-2">
                Quick Access:
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(cuisineTips).map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => {
                      setRestaurantInput(cuisine);
                      setMatchedCuisine(cuisine);
                      generateMealsMutation.mutate({
                        restaurantName: `${cuisine} Restaurant`,
                        cuisine: cuisine,
                      });
                    }}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-sm transition-colors font-medium"
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Floating Back-to-Top Arrow */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-black/30 backdrop-blur-lg border border-white/20 hover:bg-black/40 shadow-xl hover:shadow-2xl transition-all duration-200 rounded-full p-3"
            size="sm"
          >
            <ArrowUp className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
    </motion.div>
    </PhaseGate>
  );
}

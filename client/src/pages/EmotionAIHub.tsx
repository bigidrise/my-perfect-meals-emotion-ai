import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefrigeratorIcon, Utensils } from "lucide-react";
import EmotionAIFooter from "@/components/EmotionAIFooter";

interface AIFeature {
  title: string;
  description: string;
  icon: any;
  route: string;
  gradient: string;
  testId: string;
}

export default function EmotionAIHub() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Emotion AI Eats | My Perfect Meals";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const aiFeatures: AIFeature[] = [
    {
      title: "Craving Creator",
      description: "AI-powered personalized meal suggestions based on your cravings",
      icon: Sparkles,
      route: "/craving-hub",
      gradient: "from-purple-500/20 to-pink-500/20",
      testId: "card-craving-creator",
    },
    {
      title: "Fridge Rescue",
      description: "Transform ingredients in your kitchen into delicious meals",
      icon: RefrigeratorIcon,
      route: "/fridge-rescue",
      gradient: "from-emerald-500/20 to-teal-500/20",
      testId: "card-fridge-rescue",
    },
    {
      title: "Restaurant Guide",
      description: "Make smart choices when eating out with AI guidance",
      icon: Utensils,
      route: "/restaurant-guide",
      gradient: "from-pink-500/20 to-purple-500/20",
      testId: "card-restaurant-guide",
    },
  ];

  const handleCardClick = (route: string) => {
    setLocation(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2b2b2b] pb-20 flex flex-col">
      {/* Main Content - Centered 3-Feature Grid */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20">
        <div className="max-w-4xl w-full">
          {/* AI Features Grid - 3 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.testId}
                  className={`bg-black/30 backdrop-blur-lg border-2 border-white/10 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 hover:border-orange-500/50 rounded-2xl shadow-md`}
                  onClick={() => handleCardClick(feature.route)}
                  data-testid={feature.testId}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Icon className="h-10 w-10 md:h-12 md:w-12 text-white" />
                      <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/90 leading-snug">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Emotion AI Footer */}
      <EmotionAIFooter />
    </div>
  );
}

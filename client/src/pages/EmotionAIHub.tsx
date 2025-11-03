import { useLocation } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefrigeratorIcon, Utensils } from "lucide-react";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2b2b2b] pb-20 flex flex-col"
    >
      {/* Main Content - Vertical Button Stack */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 pt-20">
        <div className="max-w-2xl w-full">
          {/* AI Features - Vertical Stack */}
          <div className="flex flex-col gap-3">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.testId}
                  className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 bg-black/30 backdrop-blur-lg border border-white/10 hover:border-orange-500/50 rounded-xl shadow-md"
                  onClick={() => handleCardClick(feature.route)}
                  data-testid={feature.testId}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-white flex-shrink-0" />
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-white/80">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

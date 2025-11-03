import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  ShoppingCart,
  Lightbulb,
  Users,
  User,
  Activity,
} from "lucide-react";
import { ProfileSheet } from "@/components/ProfileSheet";

interface FeatureCard {
  title: string;
  description: string;
  icon: any;
  route: string;
  gradient: string;
  testId: string;
}

export default function DashboardNew() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Home | My Perfect Meals";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Get user profile for greeting
  const { data: fullUserData } = useQuery<{ name?: string; email?: string }>({
    queryKey: ["/api/users/1"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const userName = fullUserData?.name || "there";

  const features: FeatureCard[] = [
    {
      title: "Macro Calculator",
      description: "Track nutrition & biometrics",
      icon: Calculator,
      route: "/macro-counter",
      gradient: "",
      testId: "card-macro-calculator",
    },
    {
      title: "My Biometrics",
      description: "Track your health metrics",
      icon: Activity,
      route: "/my-biometrics",
      gradient: "",
      testId: "card-biometrics",
    },
    {
      title: "Master Shopping List",
      description: "Organize your groceries",
      icon: ShoppingCart,
      route: "/shopping-list",
      gradient: "",
      testId: "card-shopping-list",
    },
    {
      title: "Get Inspiration",
      description: "Daily Motivation and Journaling",
      icon: Lightbulb,
      route: "/get-inspiration",
      gradient: "",
      testId: "card-inspiration",
    },
    {
      title: "Care Team",
      description: "Manage your support team",
      icon: Users,
      route: "/care-team",
      gradient: "",
      testId: "card-care-team",
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
      {/* Fixed Profile Avatar - Top Right */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
        <ProfileSheet>
          <button
            className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            data-testid="button-profile-avatar"
          >
            <User className="h-6 w-6 text-white" />
          </button>
        </ProfileSheet>
      </div>

      {/* Main Content - Vertical Button Stack */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          {/* Feature Cards - Vertical Stack */}
          <div className="flex flex-col gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.testId}
                  className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95 bg-black/30 backdrop-blur-lg border border-white/10 hover:border-orange-500/50 rounded-xl shadow-md ${feature.testId === 'card-care-team' ? 'hidden' : ''}`}
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

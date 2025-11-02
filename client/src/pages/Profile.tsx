import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Activity,
  Settings,
  ChefHat,
  LogOut,
  Bell,
  Shield,
  Heart,
  TrendingUp,
  Target,
  CreditCard,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import EmotionAIFooter from "@/components/EmotionAIFooter";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    document.title = "Profile | My Perfect Meals";
  }, []);

  // Get user data
  const { data: fullUserData } = useQuery<{ name?: string; email?: string }>({
    queryKey: ["/api/users/1"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const userName = fullUserData?.name || "User";
  const userEmail = fullUserData?.email || "user@example.com";

  const profileSections = [
    {
      title: "My Biometrics",
      description: "Track your health metrics and progress",
      icon: Activity,
      route: "/my-biometrics",
      testId: "profile-biometrics",
    },
    {
      title: "ProCare Support",
      description: "Connect with nutrition experts",
      icon: ChefHat,
      route: "/pro-team",
      testId: "profile-procare",
    },
    {
      title: "Account Settings",
      description: "Manage your account preferences",
      icon: Settings,
      route: "/settings",
      testId: "profile-settings",
    },
    {
      title: "Notifications",
      description: "Control your notification preferences",
      icon: Bell,
      route: "/notifications",
      testId: "profile-notifications",
    },
    {
      title: "Privacy & Security",
      description: "Manage your privacy settings",
      icon: Shield,
      route: "/privacy",
      testId: "profile-privacy",
    },
    {
      title: "Subscription",
      description: "Manage your plan & billing",
      icon: CreditCard,
      route: "/pricing",
      testId: "profile-subscription",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/60 via-orange-900 to-black/80 pb-20">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-primary shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {userName}
              </h1>
              <p className="text-sm text-white/90">
                {userEmail}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="bg-black/30 backdrop-blur-lg border border-white/10">
            <CardContent className="p-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-white" />
              <div>
                <p className="text-sm text-white/90">Daily Goal</p>
                <p className="text-lg font-bold text-white">75%</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/30 backdrop-blur-lg border border-white/10">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-white" />
              <div>
                <p className="text-sm text-white/90">Streak</p>
                <p className="text-lg font-bold text-white">7 days</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/30 backdrop-blur-lg border border-white/10">
            <CardContent className="p-4 flex items-center gap-3">
              <Heart className="h-6 w-6 text-white" />
              <div>
                <p className="text-sm text-white/90">Favorites</p>
                <p className="text-lg font-bold text-white">12</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Sections */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Manage Your Account
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {profileSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card
                  key={section.testId}
                  className="cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] active:scale-95 bg-black/30 backdrop-blur-lg border border-white/10 hover:border-purple-400/50 rounded-2xl shadow-md"
                  onClick={() => setLocation(section.route)}
                  data-testid={section.testId}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <Icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                      <h3 className="text-base md:text-lg font-semibold text-white">
                        {section.title}
                      </h3>
                      <p className="text-xs md:text-sm text-white/90 leading-snug">
                        {section.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sign Out */}
        <Card className="mt-6 bg-black/90 backdrop-blur-lg border border-white/10">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white hover:bg-red-900/20"
              onClick={() => {
                logout();
                setUser(null);
                setLocation("/auth");
              }}
              data-testid="button-signout"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Emotion AI Footer */}
      <EmotionAIFooter />
    </div>
  );
}

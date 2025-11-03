import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileSheetProps {
  children: React.ReactNode;
}

export function ProfileSheet({ children }: ProfileSheetProps) {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();

  const { data: fullUserData } = useQuery<{ name?: string; email?: string }>({
    queryKey: ["/api/users/1"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const userName = fullUserData?.name || "User";
  const userEmail = fullUserData?.email || "user@example.com";

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setLocation("/");
  };

  const menuItems = [
    {
      title: "Account Settings",
      description: "Manage your account preferences",
      icon: Settings,
      route: "/settings",
      testId: "menu-settings",
    },
    {
      title: "Subscription",
      description: "Manage your plan & billing",
      icon: CreditCard,
      route: "/pricing",
      testId: "menu-subscription",
    },
    {
      title: "Notifications",
      description: "Control your notification preferences",
      icon: Bell,
      route: "/notifications",
      testId: "menu-notifications",
    },
    {
      title: "Privacy & Security",
      description: "Manage your privacy settings",
      icon: Shield,
      route: "/privacy",
      testId: "menu-privacy",
    },
    {
      title: "About My Perfect Meals",
      description: "Message from our founders",
      icon: MessageCircle,
      route: "/founders",
      testId: "menu-about",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-gradient-to-br from-black/95 via-orange-900/40 to-black/95 border-l border-white/10 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="text-white">Profile & Settings</SheetTitle>
          <SheetDescription className="text-white/70">
            Manage your account and preferences
          </SheetDescription>
        </SheetHeader>

        {/* User Info Section */}
        <div className="mt-6 p-4 bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">{userName}</h3>
              <p className="text-white/70 text-sm truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                onClick={() => setLocation(item.route)}
                className="w-full flex items-center gap-2 p-2 bg-black/20 hover:bg-black/40 border border-white/10 rounded-lg transition-all group"
                data-testid={item.testId}
              >
                <Icon className="h-4 w-4 text-orange-400" />
                <div className="flex-1 text-left">
                  <p className="text-white font-medium text-xs">{item.title}</p>
                  <p className="text-white/60 text-[10px]">{item.description}</p>
                </div>
                <ChevronRight className="h-3 w-3 text-white/40 group-hover:text-white/70 transition-colors" />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-orange-700/90 hover:bg-orange-800 border-orange-600 text-white hover:text-white"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

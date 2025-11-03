import { useLocation } from "wouter";
import { Home, Calendar, Sparkles, Crown } from "lucide-react";

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/dashboard",
    },
    {
      id: "planner",
      label: "Planner",
      icon: Calendar,
      path: "/weekly-meal-board",
    },
    {
      id: "emotion-ai",
      label: "Emotion AI",
      icon: Sparkles,
      path: "/emotion-ai",
    },
    {
      id: "procare",
      label: "ProCare",
      icon: Crown,
      path: "/care-team",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location === "/" || location === "/dashboard";
    }
    return location === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-t border-white/10 shadow-2xl">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => setLocation(item.path)}
                style={{ flexDirection: 'column' }}
                className={`flex items-center justify-center flex-1 h-full transition-all duration-300 ${
                  active
                    ? "text-orange-500"
                    : "text-gray-400 hover:text-white"
                }`}
                data-testid={`nav-${item.id}`}
              >
                <div className={`relative ${active ? "animate-pulse" : ""}`}>
                  {active && (
                    <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full"></div>
                  )}
                  <Icon className={`relative h-4 w-4 transition-all duration-300 ${active ? "scale-100 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" : ""}`} />
                </div>
                <span className={`text-[10px] mt-0.5 font-medium transition-all duration-300 ${active ? "font-bold text-orange-500" : ""}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

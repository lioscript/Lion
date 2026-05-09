import { Link, useLocation } from "wouter";
import { Gamepad2, Store, Gift, Star, UserCircle } from "lucide-react";

export function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { name: "Games", path: "/games", icon: Gamepad2 },
    { name: "Store", path: "/store", icon: Store },
    { name: "My gifts", path: "/my-gifts", icon: Gift },
    { name: "Season", path: "/season", icon: Star },
    { name: "Profile", path: "/profile", icon: UserCircle },
  ];

  // Hide nav on onboarding
  if (location === "/") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel pb-safe pt-2 px-2 z-50">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location === tab.path || (location === "/" && tab.path === "/store");
          return (
            <Link key={tab.path} href={tab.path} className="flex-1 flex flex-col items-center justify-center gap-1">
              <Icon 
                className={`w-6 h-6 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

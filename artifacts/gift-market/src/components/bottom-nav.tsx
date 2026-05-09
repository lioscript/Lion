import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const StoreIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const GiftIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
    <polyline points="20,12 20,22 4,22 4,12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
  </svg>
);

const SeasonIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

export function BottomNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  if (location === "/") return null;

  const tabs = [
    { name: "Store", path: "/store", Icon: StoreIcon },
    { name: "My gifts", path: "/my-gifts", Icon: GiftIcon },
    { name: "Season", path: "/season", Icon: SeasonIcon },
  ];

  const isProfileActive = location === "/profile" || location === "/admin";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 pb-safe"
      style={{
        height: 64,
        background: "linear-gradient(to top, #0a0a12 80%, transparent)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
      }}
    >
      {tabs.map(({ name, path, Icon }) => {
        const active = location === path;
        return (
          <Link
            key={path}
            href={path}
            className="flex flex-col items-center gap-1 flex-1"
          >
            <span className={active ? "text-white" : "text-white/35"}>
              <Icon active={active} />
            </span>
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? "#fff" : "rgba(255,255,255,0.35)" }}
            >
              {name}
            </span>
          </Link>
        );
      })}

      {/* Profile avatar */}
      <Link href="/profile" className="flex flex-col items-center gap-1 flex-1">
        <div
          className="w-7 h-7 rounded-full overflow-hidden border-2 transition-all"
          style={{ borderColor: isProfileActive ? "#fff" : "rgba(255,255,255,0.2)" }}
        >
          {user?.photoUrl ? (
            <img src={user.photoUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-[11px] font-bold"
              style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff" }}
            >
              {user?.firstName?.[0] || "?"}
            </div>
          )}
        </div>
        <span
          className="text-[10px] font-medium"
          style={{ color: isProfileActive ? "#fff" : "rgba(255,255,255,0.35)" }}
        >
          Profile
        </span>
      </Link>
    </div>
  );
}

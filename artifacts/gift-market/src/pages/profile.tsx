import { useAuth } from "@/hooks/use-auth";
import { TonIcon } from "@/components/ton-icon";
import { ChevronRight, ShieldAlert, Menu } from "lucide-react";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="w-full flex flex-col min-h-full pb-8" style={{ background: "#0a0a0f" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-40" style={{ background: "#0a0a0f" }}>
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <Menu className="w-4 h-4 text-white" />
        </button>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <TonIcon className="w-4 h-4" />
          <span className="text-sm font-semibold text-white">0 TON</span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Profile row */}
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white/20">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-xl font-bold"
                style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff" }}
              >
                {user?.firstName?.[0] || "?"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: "rgba(255,215,0,0.15)", color: "#ffd700" }}>
                #1000+ ✦
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>@{user?.username || "unknown"}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold text-white/40">Inventory</p>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-sm font-bold text-white">0 🎁</span>
              <ChevronRight className="w-3 h-3 text-white/30" />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="rounded-2xl p-4 flex items-center gap-0"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {[
            { label: "Inventory Cost", value: "0 TON" },
            { label: "Bought/Sold", value: "0/0" },
            { label: "Total Volume", value: "0 TON" },
          ].map((stat, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center border-r last:border-r-0" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <p className="text-sm font-bold text-white">{stat.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{stat.label}</p>
            </div>
          ))}
          <ChevronRight className="w-4 h-4 text-white/20 ml-2 shrink-0" />
        </div>

        {/* Admin panel */}
        {user?.isAdmin && (
          <Link href="/admin">
            <div
              className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-red-400">Admin Dashboard</p>
                <p className="text-xs mt-0.5 text-red-400/60">Manage marketplace gifts</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400/40" />
            </div>
          </Link>
        )}

        {/* Cashback + Season row */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
              Cashback Bonus
            </p>
            <p className="text-base font-black text-white">0% <span style={{ color: "rgba(255,255,255,0.5)" }}>/</span> <span style={{ color: "rgba(255,255,255,0.7)" }}>Level 0</span></p>
            {/* Progress bar */}
            <div className="mt-3 relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="absolute left-0 top-0 h-full w-0 rounded-full" style={{ background: "linear-gradient(90deg,#22c55e,#16a34a)" }} />
            </div>
            <div className="flex justify-between mt-1">
              {["0%", "5%", "10%", "15%"].map((v) => (
                <span key={v} className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{v}</span>
              ))}
            </div>
            <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>Available to claim 0 <TonIcon className="w-2.5 h-2.5 inline" /></p>
          </div>

          <div
            className="rounded-2xl p-4 flex flex-col justify-between"
            style={{ background: "rgba(255,180,0,0.08)", border: "1px solid rgba(255,180,0,0.15)" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,180,0,0.6)" }}>
              Season #2
            </p>
            <div className="text-2xl font-black text-white mt-2">0 ✦</div>
            <div className="flex gap-1 mt-2">
              {["🐱", "🏆", "🎁"].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: "rgba(255,255,255,0.07)" }}>
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invite friends */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
            Invite friends and earn TON <TonIcon className="w-3 h-3 inline" />
          </p>
          <div
            className="rounded-2xl p-4 flex items-start gap-3 mb-3"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: "#22c55e" }}>
              👥
            </div>
            <div>
              <p className="text-sm font-bold text-white">Get More Benefits</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                Earn to 50% referral commissions Claim 10% season points and 50% cashback
              </p>
            </div>
          </div>
          <button
            className="w-full h-13 rounded-2xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)", height: 52 }}
          >
            Invite friends
          </button>
        </div>
      </div>
    </div>
  );
}

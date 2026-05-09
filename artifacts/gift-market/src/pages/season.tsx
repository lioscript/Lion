import { useState } from "react";
import { TonIcon } from "@/components/ton-icon";
import { ChevronRight } from "lucide-react";

export default function SeasonPage() {
  const [leaderTab, setLeaderTab] = useState("global");
  const [contentTab, setContentTab] = useState("tasks");

  const tasks = [
    { icon: "✈️", color: "#2979ff", title: "Subscribe to @giftmarket", reward: 200, done: false },
    { icon: "👥", color: "#9c27b0", title: "Invite friend", reward: 250, done: false },
    { icon: "🎁", color: "#f57c00", title: "Buy first gift", reward: 500, done: false },
  ];

  return (
    <div className="w-full flex flex-col min-h-full pb-8" style={{ background: "#0a0a0f" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-40" style={{ background: "#0a0a0f" }}>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold"
          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)" }}
        >
          Rules <span className="text-xs text-white/40">ⓘ</span>
        </button>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <TonIcon className="w-4 h-4" />
          <span className="text-sm font-semibold text-white">0 TON</span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-5">
        {/* Season hero */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="text-6xl mb-3">🚀</div>
          <h1 className="text-2xl font-black text-white">Season #2</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Earn points & climb the leaderboard</p>
        </div>

        {/* Leaderboard period toggle */}
        <div
          className="flex rounded-2xl p-1"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {["Global", "Season 1", "Season 2"].map((t) => (
            <button
              key={t}
              onClick={() => setLeaderTab(t.toLowerCase().replace(" ", "_"))}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: leaderTab === t.toLowerCase().replace(" ", "_") ? "#fff" : "transparent",
                color: leaderTab === t.toLowerCase().replace(" ", "_") ? "#0a0a0f" : "rgba(255,255,255,0.4)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Stats card */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
              Earned this period ⓘ
            </span>
            <ChevronRight className="w-4 h-4 text-white/30" />
          </div>
          <div className="text-2xl font-black text-white">0 ✦</div>
          {[
            { label: "Purchase", val: "0 🎁 / 0 ✦" },
            { label: "Sold", val: "0 🎁 / 0 ✦" },
            { label: "Referral", val: "0 👥 / 0 ✦" },
            { label: "Tasks", val: "0 ✓ / 0 ✦" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{row.label}</span>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{row.val}</span>
            </div>
          ))}
        </div>

        {/* Tasks / Leaderboard tabs */}
        <div className="flex items-center gap-5 mt-1">
          {["Tasks", "Leaderboard"].map((t) => (
            <button
              key={t}
              onClick={() => setContentTab(t.toLowerCase())}
              className="text-base font-bold transition-colors"
              style={{ color: contentTab === t.toLowerCase() ? "#fff" : "rgba(255,255,255,0.3)" }}
            >
              {t} {t === "Leaderboard" && <span className="text-xs text-white/30">ⓘ</span>}
            </button>
          ))}
        </div>

        {contentTab === "tasks" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
              One-time · {tasks.length}
            </p>
            {tasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: task.color }}
                >
                  {task.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{task.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-bold text-yellow-400">✦ {task.reward}</span>
                  </div>
                </div>
                <button
                  className="px-4 py-1.5 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
                >
                  Check
                </button>
              </div>
            ))}
          </div>
        )}

        {contentTab === "leaderboard" && (
          <div className="flex flex-col items-center py-8">
            <div className="text-5xl mb-3">🏆</div>
            <p className="text-white/40 text-sm">No data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

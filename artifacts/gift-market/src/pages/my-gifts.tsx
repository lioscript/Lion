import { useState } from "react";
import { AppHeader } from "./store";
import { Plus, ArrowUp, Send, DollarSign } from "lucide-react";

export default function MyGiftsPage() {
  const [mainTab, setMainTab] = useState("gifts");
  const [subTab, setSubTab] = useState("unlisted");
  const [showAddInfo, setShowAddInfo] = useState(false);

  return (
    <div className="w-full flex flex-col min-h-full" style={{ background: "#0a0a0f" }}>
      <AppHeader />

      <div className="px-4 flex flex-col gap-0 pb-8">
        {/* Main tabs */}
        <div className="flex items-center gap-5 py-2">
          {["Gifts", "Offers", "My activity"].map((t) => (
            <button
              key={t}
              onClick={() => setMainTab(t.toLowerCase().replace(" ", "_"))}
              className="text-base font-bold transition-colors"
              style={{
                color:
                  mainTab === t.toLowerCase().replace(" ", "_")
                    ? "#fff"
                    : "rgba(255,255,255,0.3)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {mainTab === "gifts" && (
          <>
            {/* Unlisted / Listed toggle */}
            <div
              className="flex rounded-2xl p-1 mt-2 mb-4"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              {[
                { key: "unlisted", label: "Unlisted", count: 0 },
                { key: "listed", label: "Listed", count: 0 },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSubTab(tab.key)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: subTab === tab.key ? "#fff" : "transparent",
                    color: subTab === tab.key ? "#0a0a0f" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {tab.label} {tab.count}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { Icon: Plus, label: "Add", onClick: () => setShowAddInfo(true) },
                { Icon: ArrowUp, label: "Withdraw", onClick: () => {} },
                { Icon: Send, label: "Send", onClick: () => {} },
                { Icon: DollarSign, label: "Sell", onClick: () => {} },
              ].map(({ Icon, label, onClick }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                  onClick={onClick}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Empty state */}
            <div
              className="flex flex-col items-center text-center py-12 rounded-3xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="text-6xl mb-4">🐸</div>
              <h3 className="text-lg font-bold text-white mb-1">Any Telegram gifts?</h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                You can add them through our bot
              </p>
              <button
                onClick={() => setShowAddInfo(true)}
                className="px-6 py-2.5 rounded-2xl text-sm font-semibold text-white"
                style={{ border: "1.5px solid rgba(255,255,255,0.3)", background: "transparent" }}
              >
                How do I add gifts?
              </button>
            </div>
          </>
        )}

        {mainTab !== "gifts" && (
          <div className="flex flex-col items-center text-center py-16">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-white/40 text-sm">Nothing here yet</p>
          </div>
        )}
      </div>

      {/* Add gift info sheet */}
      {showAddInfo && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowAddInfo(false)}
        >
          <div
            className="w-full rounded-t-3xl pb-8 overflow-hidden"
            style={{ background: "#1a1a2a" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            </div>

            {/* Illustration */}
            <div
              className="mx-4 rounded-2xl p-8 flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)" }}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">🐸</div>
                <span className="text-white/60 text-2xl">›</span>
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl font-black" style={{ color: "#1d6ae5" }}>G</div>
              </div>
            </div>

            <div className="px-4 flex flex-col gap-3 mb-6">
              {[
                { icon: "✈️", title: "Go to the bot using the button below", sub: "Username of the bot @GiftMarketBot" },
                { icon: "🎁", title: "Send your gift to the bot", sub: "Quantity unlimited" },
                { icon: "✅", title: "The gift will appear in Unlisted", sub: "Processing time takes no more than 2 minutes" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{step.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4">
              <button
                className="w-full h-14 rounded-2xl font-bold text-base"
                style={{ background: "#fff", color: "#0a0a0f" }}
                onClick={() => setShowAddInfo(false)}
              >
                Add gift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

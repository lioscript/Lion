import { useState } from "react";
import { Header } from "./store";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, Send, Search } from "lucide-react";

export default function MyGiftsPage() {
  const [activeTab, setActiveTab] = useState("gifts");
  const [subTab, setSubTab] = useState("unlisted");

  return (
    <div className="w-full flex flex-col min-h-full">
      <Header />
      
      <div className="px-4 py-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">My Inventory</h1>

        {/* Main Tabs */}
        <div className="flex bg-card p-1 rounded-xl border border-white/5">
          {["Gifts", "Offers", "My activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.toLowerCase() 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2 py-2">
          <ActionButton icon={<Plus className="w-5 h-5" />} label="Add" />
          <ActionButton icon={<ArrowUpRight className="w-5 h-5" />} label="Withdraw" />
          <ActionButton icon={<Send className="w-5 h-5" />} label="Send" />
          <ActionButton icon={<div className="w-5 h-5 flex items-center justify-center border-2 border-current rounded-full text-[10px] font-bold">$$</div>} label="Sell" />
        </div>

        {/* Sub Tabs */}
        {activeTab === "gifts" && (
          <div className="flex gap-4 border-b border-white/5 pb-2 mt-2">
            {["Unlisted", "Listed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab.toLowerCase())}
                className={`text-sm font-semibold relative ${
                  subTab === tab.toLowerCase()
                    ? "text-primary"
                    : "text-muted-foreground hover:text-white transition-colors"
                }`}
              >
                {tab}
                {subTab === tab.toLowerCase() && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        <div className="mt-8 flex flex-col items-center justify-center text-center p-8 bg-card border border-white/5 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
          <div className="w-24 h-24 mb-4 relative z-10">
            {/* Frog placeholder */}
            <div className="w-full h-full bg-green-500/20 rounded-3xl flex items-center justify-center border border-green-500/30">
              <span className="text-4xl">🐸</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Any Telegram gifts?</h3>
          <p className="text-sm text-muted-foreground mb-6">
            You don't have any gifts yet. Add your Telegram gifts to start trading.
          </p>
          <Button className="bg-primary text-white rounded-xl h-12 px-8 font-semibold w-full">
            Add Gift
          </Button>
        </div>

      </div>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl bg-card border-white/5 hover:bg-white/10 text-white">
        {icon}
      </Button>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

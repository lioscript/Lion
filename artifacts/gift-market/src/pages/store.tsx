import { useListGifts } from "@workspace/api-client-react";
import { TonIcon } from "@/components/ton-icon";
import { Search, SlidersHorizontal, Star, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export function AppHeader() {
  const { user } = useAuth();
  return (
    <div className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between" style={{ background: "#0a0a0f" }}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold text-white">0</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <TonIcon className="w-4 h-4" />
        <span className="text-sm font-semibold text-white">0 TON</span>
      </div>
    </div>
  );
}

// Keep the old Header export for other pages that use it
export function Header() {
  return <AppHeader />;
}

const CARD_COLORS = [
  "#1a7a6a", "#a06020", "#1a3a8a", "#6a1a8a",
  "#8a4a1a", "#1a6a3a", "#7a1a4a", "#2a5a8a",
];

export function GiftCard({ gift }: { gift: any }) {
  const colorIndex = gift.id % CARD_COLORS.length;
  const bg = CARD_COLORS[colorIndex];
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      style={{ background: "#16161f", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="aspect-square relative flex items-center justify-center p-4"
        style={{ background: bg }}
      >
        {gift.imageUrl ? (
          <img
            src={gift.imageUrl}
            alt={gift.name}
            className="w-3/4 h-3/4 object-contain drop-shadow-2xl z-10"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-3/4 h-3/4 bg-white/10 rounded-2xl" />
        )}
        <div
          className="absolute top-2 left-2 text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          #{gift.id.toString().padStart(5, "0")}
        </div>
      </div>

      <div className="px-3 pt-2 pb-3 flex flex-col gap-2">
        <p className="text-sm font-semibold text-white truncate">{gift.name}</p>
        <div className="flex items-center gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)" }}
          >
            {Number(gift.price).toFixed(2)} <TonIcon className="w-3.5 h-3.5" />
          </button>
          <button
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StorePage() {
  const [search, setSearch] = useState("");
  const { data: gifts, isLoading } = useListGifts({ search: search || undefined });

  return (
    <div className="w-full flex flex-col min-h-full" style={{ background: "#0a0a0f" }}>
      <AppHeader />

      <div className="px-4 flex flex-col gap-4 pb-8">
        {/* Banner */}
        <div
          className="w-full rounded-2xl relative overflow-hidden flex items-center justify-between p-5"
          style={{
            background: "linear-gradient(135deg, #1254cc 0%, #0f3d9e 100%)",
            minHeight: 100,
          }}
        >
          <div>
            <div className="text-2xl font-black text-white leading-tight">GiftMarket</div>
            <div
              className="inline-block text-xs font-bold px-2 py-0.5 rounded-md mt-1"
              style={{ background: "#0a9396", color: "#fff" }}
            >
              Best price
            </div>
          </div>
          <div className="text-5xl">🎁</div>
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
          >
            <TonIcon className="w-3 h-3" /> Best price
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-5">
          <button className="text-lg font-black text-white">All items</button>
          <button className="text-lg font-semibold text-white/35">Collections</button>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              placeholder="Quick find"
              className="w-full h-10 pl-9 pr-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <SlidersHorizontal className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {isLoading
            ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="w-full aspect-square rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <Skeleton className="h-4 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <Skeleton className="h-8 w-full rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
              ))
            : gifts && gifts.length > 0
            ? gifts.map((gift) => <GiftCard key={gift.id} gift={gift} />)
            : (
              <div
                className="col-span-2 py-16 flex flex-col items-center justify-center text-center rounded-2xl"
                style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
              >
                <div className="text-5xl mb-3">🎁</div>
                <p className="text-white/40 text-sm font-medium">No gifts found</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

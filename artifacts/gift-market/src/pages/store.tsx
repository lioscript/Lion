import { useListGifts } from "@workspace/api-client-react";
import { TonIcon } from "@/components/ton-icon";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { PromoModal } from "@/components/promo-modal";
import { GiftDetailSheet } from "@/components/gift-detail-sheet";

interface GiftAttr {
  name: string;
  rarity?: number;
}
interface ParsedAttrs {
  bgColor?: string;
  number?: number;
  backdrop?: GiftAttr;
}

function parseAttrs(raw?: string | null): ParsedAttrs {
  if (!raw) return {};
  try { return JSON.parse(raw) as ParsedAttrs; } catch { return {}; }
}

function giftNumber(slug: string): string | null {
  const m = slug.match(/-(\d+)$/);
  return m ? m[1] : null;
}

function GiftCard({ gift, onClick }: { gift: any; onClick: () => void }) {
  const attrs = parseAttrs(gift.attributes);
  const num = attrs.number ?? (giftNumber(gift.giftSlug) ? parseInt(giftNumber(gift.giftSlug)!) : gift.id);
  const bgColor = attrs.bgColor ?? (() => {
    const COLORS = ["#C87850","#3E6EA8","#8A4CA0","#3A8A58","#A84840","#4A7888","#6A5898","#887840"];
    let h = 0; for (let i = 0; i < gift.name.length; i++) h = ((h << 5) - h + gift.name.charCodeAt(i)) | 0;
    return COLORS[Math.abs(h) % COLORS.length];
  })();

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer active:scale-[0.97] transition-transform"
      style={{ background: "#13131c", border: "1px solid rgba(255,255,255,0.07)" }}
      onClick={onClick}
    >
      {/* Image area with colored bg */}
      <div
        className="relative overflow-hidden"
        style={{ background: bgColor, aspectRatio: "1/1" }}
      >
        {/* Repeating pattern in background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Ctext x='50%25' y='50%25' font-size='22' text-anchor='middle' dominant-baseline='central' opacity='0.5'%3E🎁%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
        {/* Shamrock badge top-left */}
        <div
          className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center z-20"
          style={{ background: "#4a8a5a", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
        >
          <span className="text-sm">🍀</span>
        </div>
        {/* Gift image */}
        {gift.imageUrl ? (
          <img
            src={gift.imageUrl}
            alt={gift.name}
            className="absolute inset-0 w-full h-full object-contain p-4 z-10"
            style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.5))" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-5xl">🎁</span>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="px-3 pt-3 pb-3 flex flex-col gap-1.5">
        <p className="text-sm font-black text-white truncate leading-tight">{gift.name}</p>
        <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
          #{String(num).padStart(6, "0")}
        </p>

        {/* Price + cart row */}
        <div className="flex items-center gap-2 mt-1">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-[14px] text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)" }}
            onClick={(e) => { e.stopPropagation(); }}
          >
            {Number(gift.price).toFixed(2)}
            <TonIcon className="w-3.5 h-3.5" />
          </button>
          <button
            className="w-9 h-9 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={(e) => { e.stopPropagation(); }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppHeader({ onTonClick }: { onTonClick?: () => void }) {
  return (
    <div className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between" style={{ background: "#0a0a0f" }}>
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-semibold text-white">0</span>
      </div>
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
        style={{ background: "rgba(255,255,255,0.08)" }}
        onClick={onTonClick}
      >
        <TonIcon className="w-4 h-4" />
        <span className="text-sm font-semibold text-white">0 TON</span>
      </button>
    </div>
  );
}

export function Header({ onTonClick }: { onTonClick?: () => void }) {
  return <AppHeader onTonClick={onTonClick} />;
}

export default function StorePage() {
  const [search, setSearch] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const { data: gifts, isLoading } = useListGifts({ search: search || undefined });

  return (
    <div className="w-full flex flex-col min-h-full" style={{ background: "#0a0a0f" }}>
      <AppHeader onTonClick={() => setPromoOpen(true)} />

      <div className="px-4 flex flex-col gap-4 pb-8">
        {/* Banner */}
        <div
          className="w-full rounded-2xl relative overflow-hidden flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(135deg,#1254cc 0%,#0f3d9e 100%)", minHeight: 90 }}
        >
          <div>
            <div className="text-2xl font-black text-white">GiftMarket</div>
            <div
              className="inline-block text-xs font-bold px-2 py-0.5 rounded-md mt-1"
              style={{ background: "#0a9396", color: "#fff" }}
            >
              Best price ▽
            </div>
          </div>
          <div className="text-5xl">🎁</div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-5">
          <button className="text-lg font-black text-white border-b-2 border-white pb-0.5">All items</button>
          <button className="text-lg font-semibold text-white/30">Collections</button>
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
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="w-full aspect-square rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <Skeleton className="h-4 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <Skeleton className="h-9 w-full rounded-[14px]" style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
              ))
            : gifts && gifts.length > 0
            ? gifts.map((gift) => (
                <GiftCard
                  key={gift.id}
                  gift={gift}
                  onClick={() => setSelectedGift(gift)}
                />
              ))
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

      <PromoModal isOpen={promoOpen} onClose={() => setPromoOpen(false)} />

      {selectedGift && (
        <GiftDetailSheet
          gift={selectedGift}
          isOpen={!!selectedGift}
          onClose={() => setSelectedGift(null)}
        />
      )}
    </div>
  );
}

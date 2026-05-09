import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Share2, ExternalLink } from "lucide-react";
import { TonIcon } from "./ton-icon";

interface GiftAttr {
  name: string;
  rarity?: number;
}

interface ParsedAttrs {
  number?: number;
  bgColor?: string;
  model?: GiftAttr;
  symbol?: GiftAttr;
  backdrop?: GiftAttr;
}

interface GiftDetailSheetProps {
  gift: {
    id: number;
    name: string;
    giftSlug: string;
    imageUrl: string;
    price: number;
    telegramLink?: string | null;
    attributes?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

function parseAttrs(raw?: string | null): ParsedAttrs {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ParsedAttrs;
  } catch {
    return {};
  }
}

function giftNumber(slug: string): string | null {
  const m = slug.match(/-(\d+)$/);
  return m ? m[1] : null;
}

function RarityBadge({ rarity }: { rarity?: number }) {
  if (rarity == null) return null;
  return (
    <span
      className="text-[10px] font-bold px-1.5 py-0.5 rounded ml-1"
      style={{ background: "rgba(29,106,229,0.2)", color: "#60a5fa" }}
    >
      {rarity}%
    </span>
  );
}

export function GiftDetailSheet({ gift, isOpen, onClose }: GiftDetailSheetProps) {
  const attrs = parseAttrs(gift.attributes);
  const number = attrs.number ?? (giftNumber(gift.giftSlug) ? parseInt(giftNumber(gift.giftSlug)!) : null);
  const bgColor = attrs.bgColor ?? "#1a1a2a";
  const purchaseReward = Math.round(gift.price * 100);
  const luckyBuyPrice = (gift.price * 0.5).toFixed(2);
  const floorPrice = (gift.price * 0.3).toFixed(2);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={onClose}
        >
          <motion.div
            className="w-full rounded-t-3xl overflow-hidden"
            style={{ background: "#111118", maxHeight: "92vh", overflowY: "auto" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            </div>

            {/* Image with colored background */}
            <div
              className="relative mx-4 mt-2 rounded-3xl overflow-hidden"
              style={{ background: bgColor, aspectRatio: "1/1" }}
            >
              {/* Subtle repeating pattern overlay */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' dominant-baseline='central' opacity='0.4'%3E🎁%3C/text%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                }}
              />
              <img
                src={gift.imageUrl}
                alt={gift.name}
                className="absolute inset-0 w-full h-full object-contain p-6 z-10"
                style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {/* Top-right actions */}
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                {gift.telegramLink && (
                  <a
                    href={gift.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                )}
                <button
                  className="w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm"
                  style={{ background: "rgba(0,0,0,0.45)" }}
                >
                  <Share2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Name + number */}
            <div className="px-5 pt-4 pb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{gift.name}</h2>
                {gift.telegramLink && (
                  <ExternalLink className="w-3.5 h-3.5 text-white/30" />
                )}
              </div>
              {number != null && (
                <p className="text-sm font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  #{String(number).padStart(6, "0")}
                </p>
              )}
            </div>

            {/* Attributes card */}
            <div className="mx-4 mt-3 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                { label: "Model", attr: attrs.model, price: (gift.price * 0.65).toFixed(2) },
                { label: "Symbol", attr: attrs.symbol, price: (gift.price * 0.55).toFixed(2) },
                { label: "Backdrop", attr: attrs.backdrop, price: (gift.price * 0.6).toFixed(2) },
              ].filter(r => r.attr?.name).map((row, i) => (
                <div
                  key={i}
                  className="flex items-center px-4 py-3 border-b last:border-b-0"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <span className="text-sm w-20 shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>{row.label}</span>
                  <div className="flex-1 flex items-center">
                    <span className="text-sm font-semibold text-blue-400">{row.attr?.name}</span>
                    <RarityBadge rarity={row.attr?.rarity} />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-white">
                    {row.price} <TonIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
              {/* Floor price row */}
              <div className="flex items-center px-4 py-3">
                <span className="text-sm w-20 shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>Floor Price</span>
                <div className="flex-1" />
                <div className="flex items-center gap-1 text-sm font-semibold text-white">
                  {floorPrice} <TonIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="mx-4 mt-2 px-4 py-3 rounded-2xl flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Purchase reward</span>
                <span className="text-sm font-bold" style={{ color: "#f59e0b" }}>{purchaseReward} ✦</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Cashback <span className="text-xs text-white/30">ⓘ</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-white">0</span>
                  <TonIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="px-4 pt-3 pb-8 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="h-14 rounded-2xl flex flex-col items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <span className="text-sm font-bold text-white">Make an offer</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>0.01</span>
                    <TonIcon className="w-3 h-3" />
                  </div>
                </button>
                <button
                  className="h-14 rounded-2xl flex flex-col items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#1a6a30,#22863a)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">Lucky Buy</span>
                    <span>🍀</span>
                  </div>
                  <span className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>For {luckyBuyPrice} TON</span>
                </button>
              </div>

              <button
                className="w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)" }}
                onClick={onClose}
              >
                Buy gift
                <div className="flex items-center gap-1">
                  <span className="text-sm">{Number(gift.price).toFixed(2)}</span>
                  <TonIcon className="w-4 h-4" />
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

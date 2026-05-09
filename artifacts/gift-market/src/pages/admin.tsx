import { useState } from "react";
import {
  useAdminListGifts,
  usePreviewGift,
  useCreateGift,
  useUpdateGift,
  useDeleteGift,
  useAdminListPromos,
  useAdminCreatePromo,
  useAdminDeletePromo,
} from "@workspace/api-client-react";
import { TonIcon } from "@/components/ton-icon";
import { ArrowLeft, Plus, Link as LinkIcon, Trash2, Eye, EyeOff, Pencil, Check, X, Tag, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function AdminPage() {
  const { toast } = useToast();

  // Gifts state
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [activeTab, setActiveTab] = useState<"gifts" | "promos">("gifts");

  // Promo state
  const [promoCode, setPromoCode] = useState(randomCode());
  const [promoDiscount, setPromoDiscount] = useState("10");
  const [promoMaxUses, setPromoMaxUses] = useState("1");

  const { data: gifts, refetch: refetchGifts } = useAdminListGifts();
  const { data: promos, refetch: refetchPromos } = useAdminListPromos();

  const previewMutation = usePreviewGift();
  const createMutation = useCreateGift();
  const updateMutation = useUpdateGift();
  const deleteMutation = useDeleteGift();
  const createPromoMutation = useAdminCreatePromo();
  const deletePromoMutation = useAdminDeletePromo();

  const handlePreview = () => {
    if (!link.trim()) return;
    previewMutation.mutate(
      { data: { link: link.trim() } },
      {
        onError: (err: any) => {
          const msg = err?.data?.error || "Could not fetch gift details";
          toast({ title: "Error", description: msg, variant: "destructive" });
        },
      }
    );
  };

  const handleCreate = () => {
    if (!previewMutation.data || !price) return;
    const p = previewMutation.data;
    createMutation.mutate(
      {
        data: {
          name: p.name,
          giftSlug: p.giftSlug,
          telegramLink: link,
          imageUrl: p.imageUrl,
          attributes: p.attributes ?? undefined,
          price: parseFloat(price),
          isListed: true,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Published!", description: `${p.name} added to store` });
          setIsAddOpen(false);
          setLink("");
          setPrice("");
          previewMutation.reset();
          refetchGifts();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to create gift", variant: "destructive" });
        },
      }
    );
  };

  const toggleListed = (id: number, current: boolean) => {
    updateMutation.mutate(
      { id, data: { isListed: !current } },
      { onSuccess: () => refetchGifts(), onError: () => toast({ title: "Error", variant: "destructive" }) }
    );
  };

  const startEditPrice = (id: number, p: number) => { setEditingId(id); setEditPrice(p.toString()); };

  const savePrice = (id: number) => {
    if (!editPrice || isNaN(parseFloat(editPrice))) return;
    updateMutation.mutate(
      { id, data: { price: parseFloat(editPrice) } },
      {
        onSuccess: () => { setEditingId(null); refetchGifts(); toast({ title: "Price updated" }); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteMutation.mutate(
      { id },
      { onSuccess: () => { refetchGifts(); toast({ title: "Deleted" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) }
    );
  };

  const handleCreatePromo = () => {
    const d = parseFloat(promoDiscount);
    const m = parseInt(promoMaxUses, 10);
    if (!promoCode || isNaN(d) || isNaN(m)) return;
    createPromoMutation.mutate(
      { data: { code: promoCode, discountPercent: d, maxUses: m } },
      {
        onSuccess: () => {
          toast({ title: "Promo created!", description: `Code: ${promoCode}` });
          setPromoCode(randomCode());
          refetchPromos();
        },
        onError: (err: any) => {
          const msg = err?.data?.error || "Failed to create promo";
          toast({ title: "Error", description: msg, variant: "destructive" });
        },
      }
    );
  };

  const handleDeletePromo = (id: number, code: string) => {
    if (!confirm(`Delete promo "${code}"?`)) return;
    deletePromoMutation.mutate(
      { id },
      { onSuccess: () => { refetchPromos(); toast({ title: "Promo deleted" }); }, onError: () => toast({ title: "Error", variant: "destructive" }) }
    );
  };

  const listed = gifts?.filter((g) => g.isListed) ?? [];
  const unlisted = gifts?.filter((g) => !g.isListed) ?? [];

  // parse bgColor from attributes for preview
  const previewBgColor = (() => {
    if (!previewMutation.data?.attributes) return "#2a3050";
    try { return (JSON.parse(previewMutation.data.attributes) as any)?.bgColor ?? "#2a3050"; } catch { return "#2a3050"; }
  })();
  const previewNumber = previewMutation.data?.giftNumber;

  return (
    <div className="w-full flex flex-col min-h-screen pb-8" style={{ background: "#0a0a0f" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{ background: "#0a0a0f", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)" }}>
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
          </Link>
          <h1 className="font-bold text-base text-white">Admin Panel</h1>
        </div>
        {activeTab === "gifts" && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)" }}
          >
            <Plus className="w-4 h-4" /> Add Gift
          </button>
        )}
      </div>

      {/* Tab toggle */}
      <div className="px-4 pt-3">
        <div className="flex rounded-2xl p-1" style={{ background: "rgba(255,255,255,0.06)" }}>
          {(["gifts", "promos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all flex items-center justify-center gap-1.5"
              style={{ background: activeTab === t ? "#fff" : "transparent", color: activeTab === t ? "#0a0a0f" : "rgba(255,255,255,0.4)" }}
            >
              {t === "gifts" ? <><Plus className="w-3.5 h-3.5" /> Gifts ({gifts?.length ?? 0})</> : <><Tag className="w-3.5 h-3.5" /> Promos</>}
            </button>
          ))}
        </div>
      </div>

      {/* ─────────── GIFTS TAB ─────────── */}
      {activeTab === "gifts" && (
        <>
          {/* Stats */}
          <div className="px-4 py-3 grid grid-cols-3 gap-3">
            {[{ label: "Total", value: gifts?.length ?? 0 }, { label: "Listed", value: listed.length }, { label: "Hidden", value: unlisted.length }].map((s) => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="px-4 flex flex-col gap-2">
            {!gifts || gifts.length === 0 ? (
              <div className="text-center py-12 rounded-2xl" style={{ border: "1px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
                <div className="text-4xl mb-2">📭</div>
                <p className="text-sm">No gifts yet. Add the first one!</p>
              </div>
            ) : (
              gifts.map((gift) => (
                <div
                  key={gift.id}
                  className="rounded-2xl p-3 flex items-center gap-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                    {gift.imageUrl && (
                      <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{gift.name}</p>
                    {editingId === gift.id ? (
                      <div className="flex items-center gap-1 mt-1">
                        <TonIcon className="w-3.5 h-3.5 shrink-0" />
                        <input
                          type="number" step="0.01" value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-20 text-sm font-bold text-white bg-transparent border-b outline-none"
                          style={{ borderColor: "rgba(255,255,255,0.3)" }}
                          autoFocus
                        />
                        <button onClick={() => savePrice(gift.id)} className="text-green-400"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="text-white/40"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold" style={{ color: "rgba(29,106,229,0.9)" }}>{Number(gift.price).toFixed(2)}</span>
                        <TonIcon className="w-3 h-3" />
                        <button onClick={() => startEditPrice(gift.id, gift.price)} className="opacity-40 hover:opacity-80"><Pencil className="w-3 h-3 text-white" /></button>
                        <span className="text-[10px] px-1.5 py-0.5 rounded ml-1" style={{ background: gift.isListed ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)", color: gift.isListed ? "#4ade80" : "rgba(255,255,255,0.4)" }}>
                          {gift.isListed ? "Listed" : "Hidden"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleListed(gift.id, gift.isListed)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: gift.isListed ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.07)" }}>
                      {gift.isListed ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4 text-white/40" />}
                    </button>
                    <button onClick={() => handleDelete(gift.id, gift.name)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)" }}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ─────────── PROMOS TAB ─────────── */}
      {activeTab === "promos" && (
        <div className="px-4 pt-3 flex flex-col gap-4">
          {/* Create promo form */}
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-sm font-bold text-white">Generate Promo Code</p>

            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  placeholder="Code"
                  className="w-full h-11 pl-9 pr-10 rounded-xl text-sm font-mono font-bold text-white uppercase outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", letterSpacing: "0.1em" }}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  maxLength={20}
                />
              </div>
              <button
                onClick={() => setPromoCode(randomCode())}
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                title="Generate random code"
              >
                <RefreshCw className="w-4 h-4 text-white/60" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: "rgba(255,255,255,0.35)" }}>Discount %</label>
                <input
                  type="number" min="1" max="100" value={promoDiscount}
                  onChange={(e) => setPromoDiscount(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl text-sm font-bold text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: "rgba(255,255,255,0.35)" }}>Max Uses</label>
                <input
                  type="number" min="1" value={promoMaxUses}
                  onChange={(e) => setPromoMaxUses(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl text-sm font-bold text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
            </div>

            <button
              onClick={handleCreatePromo}
              disabled={!promoCode || createPromoMutation.isPending}
              className="h-11 rounded-xl font-bold text-sm text-white disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)" }}
            >
              {createPromoMutation.isPending ? "Creating..." : "Create Promo Code"}
            </button>
          </div>

          {/* Promo list */}
          {!promos || promos.length === 0 ? (
            <div className="text-center py-10 rounded-2xl" style={{ border: "1px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
              <div className="text-4xl mb-2">🏷️</div>
              <p className="text-sm">No promo codes yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>Active codes</p>
              {promos.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black font-mono text-white tracking-widest">{p.code}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80" }}>
                        -{p.discountPercent}%
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {p.usedCount}/{p.maxUses} uses
                      {p.expiresAt && <> · expires {new Date(p.expiresAt).toLocaleDateString()}</>}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePromo(p.id, p.code)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(239,68,68,0.1)" }}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Gift Sheet */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => { setIsAddOpen(false); previewMutation.reset(); }}
        >
          <div
            className="w-full rounded-t-3xl pb-8 overflow-y-auto"
            style={{ background: "#1a1a2a", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            </div>

            <div className="px-5">
              <h2 className="text-xl font-black text-white mb-5">Import Telegram Gift</h2>

              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "rgba(255,255,255,0.4)" }}>Gift Link</label>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    placeholder="https://t.me/nft/..."
                    className="w-full h-11 pl-9 pr-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePreview()}
                  />
                </div>
                <button
                  onClick={handlePreview}
                  disabled={!link.trim() || previewMutation.isPending}
                  className="px-4 h-11 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {previewMutation.isPending ? "..." : "Preview"}
                </button>
              </div>

              {previewMutation.data && (
                <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {/* Image preview with real bg color */}
                  <div
                    className="relative w-full flex items-center justify-center"
                    style={{ background: previewBgColor, aspectRatio: "1/1" }}
                  >
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ctext x='50%25' y='50%25' font-size='26' text-anchor='middle' dominant-baseline='central' opacity='0.5'%3E🎁%3C/text%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                      }}
                    />
                    <div
                      className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center z-20"
                      style={{ background: "#4a8a5a" }}
                    >
                      <span className="text-base">🍀</span>
                    </div>
                    {previewMutation.data.imageUrl && (
                      <img
                        src={previewMutation.data.imageUrl}
                        alt={previewMutation.data.name}
                        className="absolute inset-0 w-full h-full object-contain p-8 z-10"
                        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <p className="font-black text-white text-lg">{previewMutation.data.name}</p>
                    {previewNumber != null && (
                      <p className="text-xs font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                        #{String(previewNumber).padStart(6, "0")}
                      </p>
                    )}

                    <div className="mt-3">
                      <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Listing Price (TON)
                      </label>
                      <div className="relative">
                        <TonIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number" step="0.01" min="0" placeholder="0.00"
                          className="w-full h-12 pl-10 pr-3 rounded-xl text-lg font-bold text-white outline-none"
                          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCreate}
                      disabled={!price || createMutation.isPending}
                      className="w-full mt-3 h-13 rounded-2xl font-bold text-white disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)", height: 52 }}
                    >
                      {createMutation.isPending ? "Publishing..." : "Publish to Store"}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-xs text-center mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                Example: https://t.me/nft/InstantRamen-366835
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

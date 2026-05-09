import { useState } from "react";
import {
  useAdminListGifts,
  usePreviewGift,
  useCreateGift,
  useUpdateGift,
  useDeleteGift,
} from "@workspace/api-client-react";
import { TonIcon } from "@/components/ton-icon";
import { ArrowLeft, Plus, Link as LinkIcon, Trash2, Eye, EyeOff, Pencil, Check, X } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const { toast } = useToast();
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const { data: gifts, refetch: refetchGifts } = useAdminListGifts();

  const previewMutation = usePreviewGift();
  const createMutation = useCreateGift();
  const updateMutation = useUpdateGift();
  const deleteMutation = useDeleteGift();

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
    createMutation.mutate(
      {
        data: {
          name: previewMutation.data.name,
          giftSlug: previewMutation.data.giftSlug,
          telegramLink: link,
          imageUrl: previewMutation.data.imageUrl,
          attributes: previewMutation.data.attributes,
          price: parseFloat(price),
          isListed: true,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Added!", description: `${previewMutation.data?.name} published to store` });
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
      {
        onSuccess: () => refetchGifts(),
        onError: () => toast({ title: "Error", description: "Failed to update", variant: "destructive" }),
      }
    );
  };

  const startEditPrice = (id: number, currentPrice: number) => {
    setEditingId(id);
    setEditPrice(currentPrice.toString());
  };

  const savePrice = (id: number) => {
    if (!editPrice || isNaN(parseFloat(editPrice))) return;
    updateMutation.mutate(
      { id, data: { price: parseFloat(editPrice) } },
      {
        onSuccess: () => {
          setEditingId(null);
          refetchGifts();
          toast({ title: "Price updated" });
        },
        onError: () => toast({ title: "Error", description: "Failed to update price", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          refetchGifts();
          toast({ title: "Deleted" });
        },
        onError: () => toast({ title: "Error", description: "Failed to delete", variant: "destructive" }),
      }
    );
  };

  const listed = gifts?.filter((g) => g.isListed) ?? [];
  const unlisted = gifts?.filter((g) => !g.isListed) ?? [];

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
          <div>
            <h1 className="font-bold text-base text-white">Admin Panel</h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              {gifts?.length ?? 0} gifts total · {listed.length} listed
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)" }}
        >
          <Plus className="w-4 h-4" /> Add Gift
        </button>
      </div>

      {/* Stats bar */}
      <div className="px-4 py-3 grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: gifts?.length ?? 0 },
          { label: "Listed", value: listed.length },
          { label: "Hidden", value: unlisted.length },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Gift list */}
      <div className="px-4 flex flex-col gap-2">
        {!gifts || gifts.length === 0 ? (
          <div
            className="text-center py-12 rounded-2xl"
            style={{ border: "1px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}
          >
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
              {/* Image */}
              <div
                className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                {gift.imageUrl && (
                  <img
                    src={gift.imageUrl}
                    alt={gift.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{gift.name}</p>

                {/* Price edit */}
                {editingId === gift.id ? (
                  <div className="flex items-center gap-1 mt-1">
                    <TonIcon className="w-3.5 h-3.5 shrink-0" />
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
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
                    <span className="text-xs font-bold" style={{ color: "rgba(29,106,229,0.9)" }}>
                      {Number(gift.price).toFixed(2)}
                    </span>
                    <TonIcon className="w-3 h-3" />
                    <button
                      onClick={() => startEditPrice(gift.id, gift.price)}
                      className="opacity-40 hover:opacity-80"
                    >
                      <Pencil className="w-3 h-3 text-white" />
                    </button>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded ml-1"
                      style={{
                        background: gift.isListed ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)",
                        color: gift.isListed ? "#4ade80" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {gift.isListed ? "Listed" : "Hidden"}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleListed(gift.id, gift.isListed)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: gift.isListed ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.07)" }}
                >
                  {gift.isListed
                    ? <Eye className="w-4 h-4 text-green-400" />
                    : <EyeOff className="w-4 h-4 text-white/40" />}
                </button>
                <button
                  onClick={() => handleDelete(gift.id, gift.name)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.1)" }}
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Gift Modal */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => { setIsAddOpen(false); previewMutation.reset(); }}
        >
          <div
            className="w-full rounded-t-3xl pb-8 max-h-[90vh] overflow-y-auto"
            style={{ background: "#1a1a2a" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            </div>

            <div className="px-5">
              <h2 className="text-xl font-black text-white mb-5">Import Telegram Gift</h2>

              {/* Link input */}
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "rgba(255,255,255,0.4)" }}>
                Telegram Gift Link
              </label>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
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

              {/* Preview result */}
              {previewMutation.data && (
                <div
                  className="rounded-2xl p-4 flex flex-col gap-4 mb-4"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      {previewMutation.data.imageUrl && (
                        <img
                          src={previewMutation.data.imageUrl}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white text-base">{previewMutation.data.name}</p>
                      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                        /{previewMutation.data.giftSlug}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Listing Price (TON)
                    </label>
                    <div className="relative">
                      <TonIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
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
                    className="w-full h-13 rounded-2xl font-bold text-white disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)", height: 52 }}
                  >
                    {createMutation.isPending ? "Publishing..." : "Publish to Store"}
                  </button>
                </div>
              )}

              {/* Format hint */}
              <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
                Example: https://t.me/nft/StellarRocket-85273
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

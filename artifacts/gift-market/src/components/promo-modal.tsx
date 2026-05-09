import { useState } from "react";
import { useApplyPromo } from "@workspace/api-client-react";
import { TonIcon } from "./ton-icon";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PromoModal({ isOpen, onClose }: PromoModalProps) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ valid: boolean; message: string; discount?: number } | null>(null);
  const applyMutation = useApplyPromo();

  const handleApply = () => {
    if (!code.trim()) return;
    setResult(null);
    applyMutation.mutate(
      { data: { code: code.trim() } },
      {
        onSuccess: (data) => {
          setResult({ valid: data.valid, message: data.message, discount: data.discountPercent });
        },
        onError: (err: any) => {
          const msg = err?.data?.message || err?.data?.error || "Invalid promo code";
          setResult({ valid: false, message: msg });
        },
      }
    );
  };

  const handleClose = () => {
    setCode("");
    setResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full rounded-t-3xl pb-8"
            style={{ background: "#14141e" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-5">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            </div>

            <div className="px-5 flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Your TON Balance</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <TonIcon className="w-5 h-5" />
                    <span className="text-2xl font-black text-white">0 TON</span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

              {/* Promo section */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Apply promo code
                </p>

                <div className="flex gap-2">
                  <input
                    placeholder="Enter promo code"
                    className="flex-1 h-12 px-4 rounded-xl text-sm font-mono font-bold text-white uppercase outline-none placeholder:normal-case placeholder:font-normal placeholder:text-white/30"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", letterSpacing: "0.08em" }}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setResult(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApply()}
                    maxLength={20}
                  />
                  <button
                    onClick={handleApply}
                    disabled={!code.trim() || applyMutation.isPending}
                    className="px-5 h-12 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg,#1d6ae5,#3b82f6)" }}
                  >
                    {applyMutation.isPending ? "..." : "Apply"}
                  </button>
                </div>

                {/* Result message */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl"
                      style={{
                        background: result.valid
                          ? "rgba(34,197,94,0.12)"
                          : "rgba(239,68,68,0.12)",
                        border: `1px solid ${result.valid ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                      }}
                    >
                      <span className="text-lg">{result.valid ? "🎉" : "❌"}</span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: result.valid ? "#4ade80" : "#f87171" }}>
                          {result.message}
                        </p>
                        {result.valid && result.discount !== undefined && (
                          <p className="text-xs mt-0.5" style={{ color: "rgba(74,222,128,0.7)" }}>
                            Your next purchase gets {result.discount}% off
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Deposit/Withdraw placeholder */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}
                >
                  <span className="text-base">↓</span> Deposit
                </button>
                <button
                  className="h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                >
                  <span className="text-base">↑</span> Withdraw
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

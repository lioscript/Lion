import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCompleteOnboarding } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── tiny icon helpers ──────────────────────────────────── */
const GiftIcon = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 40 40" fill="none">
    <rect x="5" y="18" width="30" height="20" rx="3" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="13" width="34" height="7" rx="2" fill="currentColor" fillOpacity=".25" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M20 13v25" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M20 13c0 0-5-6 0-8s0 8 0 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 13c0 0 5-6 0-8s0 8 0 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

/* ─── Slide visuals ──────────────────────────────────────── */

function Slide1Visual() {
  const orbs = [
    { angle: 0, delay: 0, size: 56, color: "#4f8ef7" },
    { angle: 72, delay: 0.3, size: 44, color: "#a78bfa" },
    { angle: 144, delay: 0.6, size: 52, color: "#60a5fa" },
    { angle: 216, delay: 0.9, size: 40, color: "#818cf8" },
    { angle: 288, delay: 1.2, size: 48, color: "#6ee7f7" },
  ];
  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      {orbs.map((orb, i) => {
        const rad = (orb.angle * Math.PI) / 180;
        const r = 90;
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;
        return (
          <motion.div
            key={i}
            className="absolute rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              width: orb.size, height: orb.size,
              background: `${orb.color}22`,
              border: `1.5px solid ${orb.color}55`,
              left: `calc(50% + ${x}px - ${orb.size / 2}px)`,
              top: `calc(50% + ${y}px - ${orb.size / 2}px)`,
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <GiftIcon className={`w-6 h-6`} style={{ color: orb.color } as React.CSSProperties} />
          </motion.div>
        );
      })}
      <motion.div
        className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl z-10"
        style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <GiftIcon className="w-10 h-10 text-white" />
      </motion.div>
    </div>
  );
}

function Slide2Visual() {
  const items = [
    { label: "Stellar Rocket", price: "2.5 TON", x: -90, y: -30, delay: 0 },
    { label: "Lucky Star", price: "1.2 TON", x: 80, y: -50, delay: 0.2 },
    { label: "Diamond Ring", price: "5.0 TON", x: -70, y: 55, delay: 0.4 },
    { label: "Gold Crown", price: "3.8 TON", x: 85, y: 45, delay: 0.6 },
  ];
  return (
    <div className="relative w-64 h-56 flex items-center justify-center">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute rounded-2xl px-3 py-2 text-xs font-medium shadow-lg"
          style={{
            background: "#1a2540",
            border: "1px solid #ffffff18",
            left: `calc(50% + ${item.x}px)`,
            top: `calc(50% + ${item.y}px)`,
            transform: "translate(-50%,-50%)",
            whiteSpace: "nowrap",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-white/70">{item.label}</span>
          <div className="text-[#4ade80] font-bold">{item.price}</div>
        </motion.div>
      ))}
      <motion.div
        className="z-10 flex items-center justify-center rounded-full w-20 h-20 font-black text-2xl shadow-2xl"
        style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff" }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        35%
      </motion.div>
    </div>
  );
}

function Slide3Visual() {
  const users = [
    { name: "Alex K.", amount: "+12.4", rank: 1 },
    { name: "Maria S.", amount: "+9.8", rank: 2 },
    { name: "You", amount: "+6.1", rank: 3, highlight: true },
  ];
  return (
    <div className="w-64 flex flex-col gap-3">
      {users.map((u, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{
            background: u.highlight ? "linear-gradient(90deg,#1d4ed8,#7c3aed)" : "#1a2540",
            border: u.highlight ? "1.5px solid #6366f1" : "1px solid #ffffff12",
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
            style={{ background: u.highlight ? "#6366f1" : "#2d3f6f", color: "#fff" }}
          >
            {u.name[0]}
          </div>
          <span className="flex-1 text-white font-medium text-sm">{u.name}</span>
          <span className="text-xs font-bold" style={{ color: "#60a5fa" }}>◈ {u.amount}</span>
          <span className="text-xs text-white/40">#{u.rank}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Slide4Visual() {
  const cards = [
    { label: "Buy gifts", icon: "🎁", reward: "+999K ✦", delay: 0 },
    { label: "Invite friends", icon: "👥", reward: "+999K ✦", delay: 0.15 },
    { label: "Complete tasks", icon: "⚡", reward: "+999K ✦", delay: 0.3 },
  ];
  return (
    <div className="w-64 flex flex-col gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay, duration: 0.45 }}
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: "#1a2540", border: "1px solid #ffffff12" }}
        >
          <span className="text-xl">{card.icon}</span>
          <span className="flex-1 text-white font-medium text-sm">{card.label}</span>
          <span className="text-xs font-bold text-yellow-400">{card.reward}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Slide5Visual() {
  return (
    <div className="flex flex-col items-center gap-4 w-64">
      <div className="flex gap-4">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 rounded-2xl px-5 py-4"
          style={{ background: "#1a2540", border: "1px solid #4ade8044" }}
        >
          <span className="text-2xl">⬆️</span>
          <span className="text-xs text-green-400 font-bold">Deposit</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 rounded-2xl px-5 py-4"
          style={{ background: "#1a2540", border: "1px solid #f87171aa" }}
        >
          <span className="text-2xl">⬇️</span>
          <span className="text-xs text-red-400 font-bold">Withdraw</span>
        </motion.div>
      </div>
      <div className="flex gap-3">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full px-4 py-1.5 text-sm font-bold"
          style={{ background: "#16a34a33", color: "#4ade80", border: "1px solid #4ade8055" }}
        >
          5% Cashback
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.5, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full px-4 py-1.5 text-sm font-bold"
          style={{ background: "#2563eb22", color: "#60a5fa", border: "1px solid #60a5fa55" }}
        >
          Instant
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Slide data ─────────────────────────────────────────── */
const SLIDES = [
  {
    glow: "radial-gradient(ellipse at 50% 40%, #1e3a8a55 0%, transparent 70%)",
    visual: <Slide1Visual />,
    title: "Welcome to GiftMarket",
    subtitle: "Discover, trade and collect exclusive Telegram NFT gifts",
    cta: "Let's go!",
  },
  {
    glow: "radial-gradient(ellipse at 50% 40%, #14532d55 0%, transparent 70%)",
    visual: <Slide2Visual />,
    title: "Loyalty & Cashback",
    subtitle: "Earn up to 35% cashback on every trade you make",
    cta: "Continue",
  },
  {
    glow: "radial-gradient(ellipse at 50% 40%, #1e3a8a55 0%, transparent 70%)",
    visual: <Slide3Visual />,
    title: "Invite & Earn Together",
    subtitle: "Refer friends, climb the leaderboard, earn bonus TON",
    cta: "Continue",
  },
  {
    glow: "radial-gradient(ellipse at 50% 40%, #78350f55 0%, transparent 70%)",
    visual: <Slide4Visual />,
    title: "Seasons & Events",
    subtitle: "Complete tasks every season and win massive rewards",
    cta: "Continue",
  },
  {
    glow: "radial-gradient(ellipse at 50% 40%, #1e3a8a33 0%, transparent 70%)",
    visual: <Slide5Visual />,
    title: "And There's More",
    subtitle: "Instant deposits & withdrawals with 5% cashback commission",
    cta: "Start now",
  },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function OnboardingPage() {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [, setLocation] = useLocation();
  const { user, updateUser } = useAuth();
  const completeMutation = useCompleteOnboarding();

  const finishOnboarding = () => {
    if (user?.telegramId) {
      completeMutation.mutate(
        { data: { telegramId: user.telegramId } },
        {
          onSuccess: (data) => {
            updateUser(data);
            setLocation("/store");
          },
          onError: () => {
            // Even on error, update locally and proceed
            updateUser({ ...user, onboardingComplete: true, isNewUser: false });
            setLocation("/store");
          },
        }
      );
    } else {
      setLocation("/store");
    }
  };

  const goNext = () => {
    if (slide < SLIDES.length - 1) {
      setDirection(1);
      setSlide((s) => s + 1);
    } else {
      finishOnboarding();
    }
  };

  const isLast = slide === SLIDES.length - 1;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center justify-between bg-background text-foreground overflow-hidden relative"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Background glow */}
      <motion.div
        key={`glow-${slide}`}
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{ background: SLIDES[slide].glow }}
      />

      {/* Skip button */}
      {!isLast && (
        <div className="w-full flex justify-end px-6 pt-6 z-10">
          <button
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
            onClick={finishOnboarding}
          >
            Skip
          </button>
        </div>
      )}
      {isLast && <div className="h-10" />}

      {/* Visual area */}
      <div className="flex-1 flex items-center justify-center w-full z-10 px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`visual-${slide}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-center"
          >
            {SLIDES[slide].visual}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text + dots + buttons */}
      <div className="w-full z-10 px-6 pb-8 flex flex-col items-center gap-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`text-${slide}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold mb-2 tracking-tight">{SLIDES[slide].title}</h1>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">
              {SLIDES[slide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: slide === i ? 24 : 6, opacity: slide === i ? 1 : 0.35 }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full bg-white"
              style={{ minWidth: 6 }}
            />
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={goNext}
          disabled={completeMutation.isPending}
          className="w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff" }}
        >
          <motion.span
            key={`cta-${slide}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {SLIDES[slide].cta}
          </motion.span>
          <StarIcon className="w-4 h-4 text-yellow-300" />
        </button>
      </div>
    </div>
  );
}

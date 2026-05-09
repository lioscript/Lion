import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCompleteOnboarding } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

import slide1Img from "@assets/IMG_3183_1778330625806.png";
import slide2Img from "@assets/IMG_3184_1778330625806.png";
import slide3Img from "@assets/IMG_3185_1778330625806.png";
import slide4Img from "@assets/IMG_3186_1778330625806.png";
import slide5Img from "@assets/IMG_3187_1778330625806.png";

const SLIDES = [
  {
    img: slide1Img,
    title: "Welcome to GiftMarket",
    subtitle: "Discover, trade, and collect gifts across Telegram",
    cta: "Let's go!",
    showBack: false,
    showSkip: true,
  },
  {
    img: slide2Img,
    title: "Loyalty & Cashback",
    subtitle: "The more you trade — the bigger your cashback. Up to 50% of marketplace commission returned",
    cta: "Continue",
    showBack: true,
    showSkip: false,
  },
  {
    img: slide3Img,
    title: "Invite & Earn Together",
    subtitle: "Invite friends and earn up to 50% commission from their trades",
    cta: "Continue",
    showBack: true,
    showSkip: false,
  },
  {
    img: slide4Img,
    title: "Seasons & Events",
    subtitle: "Collect. Compete. Earn Points. Get points for collecting gifts, completing tasks, and inviting friends",
    cta: "Continue",
    showBack: true,
    showSkip: false,
  },
  {
    img: slide5Img,
    title: "And There's More",
    subtitle: "Instant deposits and withdrawals. 5% commission. Start your collection now",
    cta: "Start now",
    showBack: true,
    showSkip: true,
  },
];

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

  const goBack = () => {
    if (slide > 0) {
      setDirection(-1);
      setSlide((s) => s - 1);
    }
  };

  const current = SLIDES[slide];

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Full-screen background image */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`bg-${slide}`}
          className="absolute inset-0"
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <img
            src={current.img}
            alt=""
            className="w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.92)" }}
          />
          {/* Gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.1) 60%, transparent 80%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-8 px-5">
        {/* Skip top-right */}
        {current.showSkip && slide < SLIDES.length - 1 && (
          <div className="absolute top-4 right-5">
            <button
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              onClick={finishOnboarding}
            >
              Skip
            </button>
          </div>
        )}

        {/* Title + subtitle */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`text-${slide}`}
            custom={direction}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="mb-6"
          >
            <h1 className="text-[28px] font-black text-white leading-tight mb-2">
              {current.title}
            </h1>
            <p className="text-sm text-white/60 leading-relaxed">
              {current.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center gap-2 mb-5">
          {SLIDES.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: slide === i ? 24 : 6, opacity: slide === i ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full bg-white"
              style={{ minWidth: 6 }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {current.showBack && (
            <button
              onClick={goBack}
              className="flex-1 h-14 rounded-2xl font-semibold text-sm text-white"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              Back
            </button>
          )}
          <button
            onClick={goNext}
            disabled={completeMutation.isPending}
            className="h-14 rounded-2xl font-bold text-base text-white disabled:opacity-60 transition-opacity"
            style={{
              flex: current.showBack ? 2 : 1,
              background: "linear-gradient(135deg,#1d6ae5,#3b82f6)",
            }}
          >
            {current.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

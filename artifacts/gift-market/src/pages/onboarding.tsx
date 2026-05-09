import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCompleteOnboarding } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, Gift, Trophy, Star, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
  const [slide, setSlide] = useState(0);
  const [, setLocation] = useLocation();
  const { user, refetchUser } = useAuth();
  const completeMutation = useCompleteOnboarding();

  const handleNext = () => {
    if (slide < 4) {
      setSlide(s => s + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    if (user?.telegramId) {
      completeMutation.mutate(
        { data: { telegramId: user.telegramId } },
        {
          onSuccess: () => {
            refetchUser();
            setLocation("/store");
          }
        }
      );
    } else {
      setLocation("/store");
    }
  };

  const slides = [
    {
      id: 0,
      color: "bg-blue-500/20",
      icon: <Gift className="w-16 h-16 text-blue-400" />,
      title: "Welcome to GiftMarket",
      subtitle: "Discover, trade, and collect gifts across Telegram"
    },
    {
      id: 1,
      color: "bg-green-500/20",
      icon: (
        <div className="relative">
          <Gift className="w-16 h-16 text-green-400" />
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">35%</div>
        </div>
      ),
      title: "Loyalty & Cashback",
      subtitle: "Earn cashback commission returned on your trades"
    },
    {
      id: 2,
      color: "bg-teal-500/20",
      icon: <Trophy className="w-16 h-16 text-teal-400" />,
      title: "Invite & Earn Together",
      subtitle: "Climb the leaderboard with friends"
    },
    {
      id: 3,
      color: "bg-yellow-500/20",
      icon: <Star className="w-16 h-16 text-yellow-400" />,
      title: "Seasons & Events",
      subtitle: "Complete tasks and earn massive rewards"
    },
    {
      id: 4,
      color: "bg-purple-500/20",
      icon: <Wallet className="w-16 h-16 text-purple-400" />,
      title: "And There's More",
      subtitle: "Instant deposits and withdrawals. Connect your wallet now.",
      isLast: true
    }
  ];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-[100px] rounded-full transition-colors duration-700 ${slides[slide].color} opacity-40 z-0 pointer-events-none`} />

      <div className="flex-1 w-full flex flex-col items-center justify-center p-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <div className="w-32 h-32 rounded-full glass-panel flex items-center justify-center mb-8 shadow-xl shadow-black/50">
              {slides[slide].icon}
            </div>
            
            <h1 className="text-3xl font-bold mb-4 tracking-tight">
              {slides[slide].title}
            </h1>
            <p className="text-muted-foreground text-lg mb-12">
              {slides[slide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full p-6 pb-safe z-10">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((s, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${slide === i ? "w-8 bg-primary" : "w-2 bg-muted"}`} 
            />
          ))}
        </div>

        <div className="flex gap-4">
          {slide > 0 && !slides[slide].isLast && (
            <Button 
              variant="outline" 
              className="flex-1 rounded-2xl h-14 bg-card/50 border-white/10"
              onClick={() => setSlide(s => s - 1)}
            >
              Back
            </Button>
          )}

          {slides[slide].isLast && (
            <Button 
              variant="outline" 
              className="flex-1 rounded-2xl h-14 bg-card/50 border-white/10"
              onClick={finishOnboarding}
            >
              Skip
            </Button>
          )}

          <Button 
            className="flex-1 rounded-2xl h-14 bg-primary hover:bg-primary/90 text-white font-semibold text-lg"
            onClick={handleNext}
            disabled={completeMutation.isPending}
          >
            {slides[slide].isLast ? (
              <span className="flex items-center gap-2">Connect Wallet <Wallet className="w-5 h-5" /></span>
            ) : slide === 0 ? (
              <span className="flex items-center gap-2">Let's go! <ArrowRight className="w-5 h-5" /></span>
            ) : (
              <span className="flex items-center gap-2">Continue <ChevronRight className="w-5 h-5" /></span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { PetData } from "../OnboardingWizard";

interface Props {
  petData: PetData;
  next: () => void;
}

const MESSAGES = [
  (name: string) => `Analyzing ${name}'s profile data...`,
  (_: string) => "Checking breed-specific care needs...",
  (_: string) => "Almost ready! Finalizing personalized profile...",
];

const DURATION = 3500; // ms total

const StepLoading = ({ petData, next }: Props) => {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setProgress(pct);

      if (pct < 40) setMsgIdx(0);
      else if (pct < 75) setMsgIdx(1);
      else setMsgIdx(2);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(next, 400);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [next]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="text-center flex flex-col items-center justify-center">
      {/* Glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/20 blur-3xl -z-10"
      />

      {/* Progress circle */}
      <div className="relative w-36 h-36 mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-100"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-black text-foreground">{progress}%</span>
        </div>
      </div>

      {/* Dynamic message */}
      <motion.p
        key={msgIdx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground font-medium text-sm max-w-xs"
      >
        {MESSAGES[msgIdx](petData.name)}
      </motion.p>
    </div>
  );
};

export default StepLoading;

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StepWelcome from "./onboarding/StepWelcome";
import StepBasics from "./onboarding/StepBasics";
import StepAgeWeight from "./onboarding/StepAgeWeight";
import StepPhoto from "./onboarding/StepPhoto";
import StepHealthContext from "./onboarding/StepHealthContext";
import StepAIConsent from "./onboarding/StepAIConsent";
import StepPermissions from "./onboarding/StepPermissions";
import StepReady from "./onboarding/StepReady";

export interface PetData {
  name: string;
  species: string;
  breed: string;
  ageRange: string;
  weightRange: string;
  weightValue: number;
  photoUrl: string | null;
  photoFile: File | null;
  health: string[];
  healthNote: string;
}

interface OnboardingWizardProps {
  onComplete: (data: PetData) => void;
}

const slide = {
  enter: (d: number) => ({ x: d > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -120 : 120, opacity: 0 }),
};

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [petData, setPetData] = useState<PetData>({
    name: "",
    species: "",
    breed: "",
    ageRange: "adult",
    weightRange: "medium",
    weightValue: 15,
    photoUrl: null,
    photoFile: null,
    health: [],
    healthNote: "",
  });

  // 0 Welcome, 1 Basics, 2 Age+Weight, 3 Photo, 4 Health, 5 AI, 6 Permissions, 7 Ready
  const TOTAL = 8;
  const progress = ((step + 1) / TOTAL) * 100;

  const next = useCallback(() => {
    setDirection(1);
    setStep((s) => {
      if (s + 1 >= TOTAL) {
        onComplete(petData);
        return s;
      }
      return s + 1;
    });
  }, [petData, onComplete]);

  const finish = useCallback(() => onComplete(petData), [petData, onComplete]);

  const back = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);
  const update = useCallback(
    (p: Partial<PetData>) => setPetData((d) => ({ ...d, ...p })),
    []
  );

  const showBack = step > 0 && step < TOTAL - 1;
  const isOptional = step === 2 || step === 3 || step === 4; // age+weight, photo, health

  const wrap = (key: string, content: React.ReactNode) => (
    <motion.div
      key={key}
      custom={direction}
      variants={slide}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm"
    >
      {content}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      <div className="px-6 pt-12 pb-2 flex items-center gap-3">
        {showBack ? (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={back}
            className="p-2 -ml-2 rounded-xl hover:bg-muted"
          >
            <ChevronLeft size={22} className="text-foreground" />
          </motion.button>
        ) : (
          <div className="w-9" />
        )}
        <div className="flex-1">
          <Progress value={progress} className="h-1.5 bg-muted" />
        </div>
        {isOptional ? (
          <button
            onClick={next}
            className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase whitespace-nowrap"
          >
            Skip
          </button>
        ) : (
          <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase whitespace-nowrap">
            {step + 1}/{TOTAL}
          </span>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto py-6">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && wrap("welcome", <StepWelcome next={next} skipAll={finish} />)}
          {step === 1 && wrap("basics", <StepBasics petData={petData} update={update} next={next} />)}
          {step === 2 && wrap("agewt", <StepAgeWeight petData={petData} update={update} next={next} />)}
          {step === 3 && wrap("photo", <StepPhoto petData={petData} update={update} next={next} />)}
          {step === 4 && wrap("health", <StepHealthContext petData={petData} update={update} next={next} />)}
          {step === 5 && wrap("ai", <StepAIConsent next={next} />)}
          {step === 6 && wrap("perm", <StepPermissions next={next} />)}
          {step === 7 && wrap("ready", <StepReady petData={petData} next={finish} />)}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OnboardingWizard;

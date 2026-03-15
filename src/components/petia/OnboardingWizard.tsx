import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, Camera } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import OnboardingStepName from "./onboarding/StepName";
import OnboardingStepSpecies from "./onboarding/StepSpecies";
import OnboardingStepAge from "./onboarding/StepAge";
import OnboardingStepWeight from "./onboarding/StepWeight";
import OnboardingStepPhoto from "./onboarding/StepPhoto";
import OnboardingStepAuth from "./onboarding/StepAuth";

export interface PetData {
  name: string;
  species: string;
  breed: string;
  ageRange: string;
  weightRange: string;
  weightValue: number;
  photoUrl: string | null;
  photoFile: File | null;
}

interface OnboardingWizardProps {
  onComplete: (data: PetData) => void;
}

const TOTAL_STEPS = 6;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
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
    weightValue: 25,
    photoUrl: null,
    photoFile: null,
  });

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const next = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const back = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const update = useCallback((patch: Partial<PetData>) => {
    setPetData((d) => ({ ...d, ...patch }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      {/* Header: back + progress */}
      <div className="px-6 pt-12 pb-2 flex items-center gap-3">
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={back}
            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ChevronLeft size={22} className="text-foreground" />
          </motion.button>
        )}
        <div className="flex-1">
          <Progress value={progress} className="h-1.5 bg-muted" />
        </div>
        <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase whitespace-nowrap">
          {step + 1}/{TOTAL_STEPS}
        </span>
      </div>

      {/* Steps */}
      <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div key="s0" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="w-full max-w-sm">
              <OnboardingStepName petData={petData} update={update} next={next} />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="s1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="w-full max-w-sm">
              <OnboardingStepSpecies petData={petData} update={update} next={next} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="w-full max-w-sm">
              <OnboardingStepAge petData={petData} update={update} next={next} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="s3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="w-full max-w-sm">
              <OnboardingStepWeight petData={petData} update={update} next={next} />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="s4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="w-full max-w-sm">
              <OnboardingStepPhoto petData={petData} update={update} next={next} />
            </motion.div>
          )}
          {step === 5 && (
            <motion.div key="s5" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="w-full max-w-sm">
              <OnboardingStepAuth petData={petData} onComplete={onComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OnboardingWizard;

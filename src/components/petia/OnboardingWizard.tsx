import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StepWelcome from "./onboarding/StepWelcome";
import StepName from "./onboarding/StepName";
import StepSpecies from "./onboarding/StepSpecies";
import StepAge from "./onboarding/StepAge";
import StepWeight from "./onboarding/StepWeight";
import StepPhoto from "./onboarding/StepPhoto";
import StepAIConsent from "./onboarding/StepAIConsent";
import StepPermissions from "./onboarding/StepPermissions";
import StepLoading from "./onboarding/StepLoading";
import StepAuth from "./onboarding/StepAuth";

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

const slide = {
  enter: (d: number) => ({ x: d > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -120 : 120, opacity: 0 }),
};

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [petData, setPetData] = useState<PetData>({
    name: "", species: "", breed: "", ageRange: "adult",
    weightRange: "medium", weightValue: 25, photoUrl: null, photoFile: null,
  });

  const TOTAL = 10;
  const progress = ((step + 1) / TOTAL) * 100;

  const next = useCallback(() => { setDirection(1); setStep((s) => Math.min(s + 1, TOTAL - 1)); }, []);
  const back = useCallback(() => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); }, []);
  const update = useCallback((p: Partial<PetData>) => setPetData((d) => ({ ...d, ...p })), []);

  // No back on Welcome (0), Loading (8), Auth (9)
  const showBack = step > 0 && step !== 8 && step !== TOTAL - 1;

  const wrap = (key: string, content: React.ReactNode) => (
    <motion.div key={key} custom={direction} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="w-full max-w-sm">
      {content}
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background flex flex-col">
      <div className="px-6 pt-12 pb-2 flex items-center gap-3">
        {showBack && (
          <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} onClick={back} className="p-2 -ml-2 rounded-xl hover:bg-muted">
            <ChevronLeft size={22} className="text-foreground" />
          </motion.button>
        )}
        <div className="flex-1"><Progress value={progress} className="h-1.5 bg-muted" /></div>
        <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase whitespace-nowrap">{step + 1}/{TOTAL}</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto py-6">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && wrap("welcome", <StepWelcome next={next} />)}
          {step === 1 && wrap("name", <StepName petData={petData} update={update} next={next} />)}
          {step === 2 && wrap("species", <StepSpecies petData={petData} update={update} next={next} />)}
          {step === 3 && wrap("age", <StepAge petData={petData} update={update} next={next} />)}
          {step === 4 && wrap("weight", <StepWeight petData={petData} update={update} next={next} />)}
          {step === 5 && wrap("photo", <StepPhoto petData={petData} update={update} next={next} />)}
          {step === 6 && wrap("ai", <StepAIConsent next={next} />)}
          {step === 7 && wrap("perms", <StepPermissions next={next} />)}
          {step === 8 && wrap("loading", <StepLoading petData={petData} next={next} />)}
          {step === 9 && wrap("auth", <StepAuth petData={petData} onComplete={onComplete} />)}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OnboardingWizard;

import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import type { PetData } from "../OnboardingWizard";

interface Props {
  petData: PetData;
  update: (patch: Partial<PetData>) => void;
  next: () => void;
}

const StepHealthContext = ({ petData, update, next }: Props) => (
  <div className="text-center">
    <div className="w-14 h-14 mx-auto mb-4 rounded-3xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow">
      <Heart size={24} />
    </div>
    <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
      Anything Petia should know?
    </h1>
    <p className="text-muted-foreground font-medium mb-6 text-sm leading-relaxed">
      Optional. A short note helps personalize tips — share more later anytime.
    </p>

    <textarea
      placeholder="e.g. sensitive stomach, allergic to chicken, takes daily med…"
      value={petData.healthNote}
      onChange={(e) => update({ healthNote: e.target.value })}
      rows={4}
      className="w-full glass rounded-3xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary shadow-soft mb-8 resize-none"
    />

    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={next}
      className="w-full py-4 rounded-3xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow mb-3"
    >
      Continue <ArrowRight size={18} />
    </motion.button>
    <button onClick={next} className="text-sm text-muted-foreground underline underline-offset-4">
      Skip for now
    </button>
  </div>
);

export default StepHealthContext;

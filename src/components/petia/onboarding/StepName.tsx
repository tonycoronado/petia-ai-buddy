import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PetData } from "../OnboardingWizard";

interface Props {
  petData: PetData;
  update: (patch: Partial<PetData>) => void;
  next: () => void;
}

const StepName = ({ petData, update, next }: Props) => (
  <div className="text-center">
    <motion.h1
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-3xl font-black tracking-tight text-foreground mb-3"
    >
      Hi! Welcome to Petia
    </motion.h1>
    <p className="text-muted-foreground font-medium mb-10">
      Who are we caring for today?
    </p>

    <input
      type="text"
      placeholder="Pet's name (e.g. Kulka)"
      value={petData.name}
      onChange={(e) => update({ name: e.target.value })}
      className="w-full text-center text-xl font-bold bg-transparent border-b-2 border-primary/30 focus:border-primary py-4 outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
      autoFocus
    />

    <AnimatePresence>
      {petData.name.trim().length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          whileTap={{ scale: 0.97 }}
          onClick={next}
          className="mt-10 w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow"
        >
          Next <ArrowRight size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  </div>
);

export default StepName;

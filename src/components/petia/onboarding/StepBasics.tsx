import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PetData } from "../OnboardingWizard";

const SPECIES = [
  { value: "dog", label: "Dog", emoji: "🐶" },
  { value: "cat", label: "Cat", emoji: "🐱" },
];

interface Props {
  petData: PetData;
  update: (patch: Partial<PetData>) => void;
  next: () => void;
}

const StepBasics = ({ petData, update, next }: Props) => {
  const ready = petData.name.trim().length > 0 && !!petData.species;

  return (
    <div className="text-center">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
        Tell us about your pet
      </h1>
      <p className="text-muted-foreground font-medium mb-8 text-sm">
        Just the basics for now
      </p>

      <input
        type="text"
        placeholder="Pet's name"
        value={petData.name}
        onChange={(e) => update({ name: e.target.value })}
        className="w-full text-center text-xl font-bold bg-transparent border-b-2 border-primary/30 focus:border-primary py-3 outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors mb-8"
        autoFocus
      />

      <div className="grid grid-cols-2 gap-4 mb-8">
        {SPECIES.map((sp, i) => (
          <motion.button
            key={sp.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => update({ species: sp.value })}
            className={`rounded-3xl p-6 flex flex-col items-center gap-3 transition-all ${
              petData.species === sp.value
                ? "gradient-cta text-primary-foreground shadow-glow ring-2 ring-primary scale-[1.02]"
                : "glass shadow-soft"
            }`}
          >
            <span className="text-4xl">{sp.emoji}</span>
            <span
              className={`font-bold text-sm ${
                petData.species === sp.value ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {sp.label}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {ready && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            whileTap={{ scale: 0.97 }}
            onClick={next}
            className="w-full py-4 rounded-3xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow"
          >
            Continue <ArrowRight size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StepBasics;

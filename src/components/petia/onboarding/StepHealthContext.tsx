import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import type { PetData } from "../OnboardingWizard";

const CHIPS = [
  "Allergies",
  "Medical conditions",
  "Medication",
  "Sensitive stomach",
  "Skin issues",
  "None",
];

interface Props {
  petData: PetData;
  update: (patch: Partial<PetData>) => void;
  next: () => void;
}

const StepHealthContext = ({ petData, update, next }: Props) => {
  const selected = petData.health || [];

  const toggle = (chip: string) => {
    if (chip === "None") {
      update({ health: selected.includes("None") ? [] : ["None"] });
      return;
    }
    const without = selected.filter((c) => c !== "None");
    const has = without.includes(chip);
    update({
      health: has ? without.filter((c) => c !== chip) : [...without, chip],
    });
  };

  return (
    <div className="text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-3xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow">
        <Heart size={24} />
      </div>
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
        Anything Petia should know?
      </h1>
      <p className="text-muted-foreground font-medium mb-6 text-sm leading-relaxed">
        Optional. Helps personalize food, reminders, and tips.
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {CHIPS.map((chip, i) => {
          const active = selected.includes(chip);
          return (
            <motion.button
              key={chip}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(chip)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                active
                  ? "gradient-cta text-primary-foreground shadow-glow"
                  : "glass text-foreground shadow-soft"
              }`}
            >
              {chip}
            </motion.button>
          );
        })}
      </div>

      <input
        type="text"
        placeholder="Add a quick note (optional)"
        value={petData.healthNote}
        onChange={(e) => update({ healthNote: e.target.value })}
        className="w-full glass rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary shadow-soft mb-8"
      />

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={next}
        className="w-full py-4 rounded-3xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow mb-3"
      >
        Continue <ArrowRight size={18} />
      </motion.button>
      <button onClick={next} className="text-sm text-muted-foreground underline">
        Skip for now
      </button>
    </div>
  );
};

export default StepHealthContext;

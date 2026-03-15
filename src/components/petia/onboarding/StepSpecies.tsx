import { motion } from "framer-motion";
import type { PetData } from "../OnboardingWizard";

const SPECIES = [
  { value: "dog", label: "Dog", emoji: "🐶" },
  { value: "cat", label: "Cat", emoji: "🐱" },
  { value: "small_pet", label: "Exotic / Small", emoji: "🐰" },
  { value: "bird", label: "Bird", emoji: "🐦" },
];

interface Props {
  petData: PetData;
  update: (patch: Partial<PetData>) => void;
  next: () => void;
}

const StepSpecies = ({ petData, update, next }: Props) => {
  const handleSelect = (species: string) => {
    update({ species });
    next();
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
        What kind of animal is {petData.name}?
      </h1>
      <p className="text-muted-foreground font-medium mb-8">Pick one</p>

      <div className="grid grid-cols-2 gap-4">
        {SPECIES.map((sp, i) => (
          <motion.button
            key={sp.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelect(sp.value)}
            className={`glass rounded-3xl p-6 flex flex-col items-center gap-3 shadow-soft transition-all ${
              petData.species === sp.value ? "ring-2 ring-primary shadow-glow" : ""
            }`}
          >
            <span className="text-4xl">{sp.emoji}</span>
            <span className="font-bold text-sm text-foreground">{sp.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default StepSpecies;

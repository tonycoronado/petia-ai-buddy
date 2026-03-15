import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PetData } from "../OnboardingWizard";

const AGE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  dog: [
    { value: "puppy", label: "Puppy (0-1 yr)" },
    { value: "adult", label: "Adult (1-7 yrs)" },
    { value: "senior", label: "Senior (7+ yrs)" },
  ],
  cat: [
    { value: "puppy", label: "Kitten (0-1 yr)" },
    { value: "adult", label: "Adult (1-7 yrs)" },
    { value: "senior", label: "Senior (7+ yrs)" },
  ],
  _default: [
    { value: "puppy", label: "Baby" },
    { value: "adult", label: "Adult" },
    { value: "senior", label: "Senior" },
  ],
};

interface Props {
  petData: PetData;
  update: (patch: Partial<PetData>) => void;
  next: () => void;
}

const StepAge = ({ petData, update, next }: Props) => {
  const options = AGE_OPTIONS[petData.species] || AGE_OPTIONS._default;

  return (
    <div className="text-center">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
        How old is {petData.name}?
      </h1>
      <p className="text-muted-foreground font-medium mb-8">Select an age range</p>

      <div className="flex flex-col gap-3 mb-10">
        {options.map((a, i) => (
          <motion.button
            key={a.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => update({ ageRange: a.value })}
            className={`w-full py-4 rounded-2xl text-sm font-bold transition-all ${
              petData.ageRange === a.value
                ? "gradient-cta text-primary-foreground shadow-glow"
                : "glass text-foreground shadow-soft"
            }`}
          >
            {a.label}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={next}
        className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow"
      >
        Next <ArrowRight size={18} />
      </motion.button>
    </div>
  );
};

export default StepAge;

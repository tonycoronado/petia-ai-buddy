import { motion } from "framer-motion";
import { Smile, Camera, Bell, FileHeart, Sparkles } from "lucide-react";
import type { PetData } from "../OnboardingWizard";

interface Props {
  petData: PetData;
  next: () => void;
}

const PREVIEWS = [
  { icon: Smile, label: "Track daily mood" },
  { icon: Camera, label: "Use Smart Capture" },
  { icon: Bell, label: "Set reminders" },
  { icon: FileHeart, label: "Keep health history" },
];

const StepReady = ({ petData, next }: Props) => {
  const name = petData.name.trim() || "your pet";
  const initial = name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mx-auto w-28 h-28 rounded-full gradient-accent p-1 shadow-glow mb-5"
      >
        {petData.photoUrl ? (
          <img
            src={petData.photoUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-4xl font-black text-foreground">
            {initial}
          </div>
        )}
      </motion.div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 mb-3">
        <Sparkles size={12} className="text-primary" />
        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
          All set
        </span>
      </div>

      <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
        Petia is ready for {name}
      </h1>
      <p className="text-muted-foreground font-medium mb-8 text-sm leading-relaxed">
        Here's what you can do right away
      </p>

      <div className="space-y-3 mb-10 text-left">
        {PREVIEWS.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="glass rounded-3xl p-4 flex items-center gap-3 shadow-soft"
          >
            <div className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
              <p.icon size={18} />
            </div>
            <p className="font-bold text-foreground text-sm">{p.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={next}
        className="w-full py-4 rounded-3xl gradient-cta text-primary-foreground font-bold text-base shadow-glow"
      >
        Open Petia
      </motion.button>
    </motion.div>
  );
};

export default StepReady;

import { motion } from "framer-motion";
import { Camera, Smile, Bell, FileHeart } from "lucide-react";

const FEATS = [
  { icon: Smile, label: "Daily care", desc: "Mood, meals, and gentle nudges" },
  { icon: Camera, label: "Smart Capture", desc: "One photo — food, health, or vet doc" },
  { icon: Bell, label: "Reminders", desc: "Vaccines, meds, vet visits" },
  { icon: FileHeart, label: "Health history", desc: "All records, in one place" },
];

interface Props { next: () => void; }

const StepWelcome = ({ next }: Props) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
    <span className="text-5xl mb-4 block">🐾</span>
    <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">Welcome to Petia</h1>
    <p className="text-muted-foreground font-medium mb-8 leading-relaxed text-sm">
      Your pet's calm, personal care companion.
    </p>
    <div className="space-y-3 mb-10 text-left">
      {FEATS.map((f) => (
        <div key={f.label} className="glass rounded-3xl p-4 flex items-center gap-3 shadow-soft">
          <div className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
            <f.icon size={18} />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">{f.label}</p>
            <p className="text-[11px] text-muted-foreground font-medium">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
    <motion.button whileTap={{ scale: 0.96 }} onClick={next} className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow">
      Get started
    </motion.button>
  </motion.div>
);

export default StepWelcome;

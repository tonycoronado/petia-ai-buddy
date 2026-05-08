import { motion } from "framer-motion";
import { Camera, Bell, ArrowRight } from "lucide-react";

interface Props { next: () => void; }

const ROWS = [
  {
    icon: Camera,
    title: "Camera & Photos",
    desc: "So you can use Smart Capture for food, health, and vet docs.",
  },
  {
    icon: Bell,
    title: "Notifications",
    desc: "Gentle nudges for mood, meds, vaccines, and vet visits.",
  },
];

const StepPermissions = ({ next }: Props) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
    <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
      A couple of permissions
    </h1>
    <p className="text-muted-foreground font-medium mb-8 text-sm leading-relaxed">
      Petia only asks when you actually use a feature.
    </p>

    <div className="space-y-3 mb-10 text-left">
      {ROWS.map((r, i) => (
        <motion.div
          key={r.title}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass rounded-3xl p-4 flex items-center gap-4 shadow-soft"
        >
          <div className="w-12 h-12 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
            <r.icon size={20} />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">{r.title}</p>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
              {r.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>

    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={next}
      className="w-full py-4 rounded-3xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow"
    >
      Continue <ArrowRight size={18} />
    </motion.button>
  </motion.div>
);

export default StepPermissions;

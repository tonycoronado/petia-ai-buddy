import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, Bell } from "lucide-react";
import { toast } from "sonner";

interface Props { next: () => void; }

const PERMS = [
  { icon: Camera, label: "Camera", desc: "Take photos for food scans and health diary" },
  { icon: ImageIcon, label: "Photo Library", desc: "Upload existing photos of your pet and food" },
  { icon: Bell, label: "Notifications", desc: "Reminders, mood checks, and weekly insights" },
];

const StepPermissions = ({ next }: Props) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
    <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">A few permissions</h1>
    <p className="text-muted-foreground font-medium mb-8 leading-relaxed text-sm">
      We'll only ask once. You can change these any time.
    </p>
    <div className="space-y-3 mb-10 text-left">
      {PERMS.map((p) => (
        <button
          key={p.label}
          onClick={() => toast.success(`${p.label} allowed`)}
          className="w-full glass rounded-3xl p-4 flex items-center gap-3 shadow-soft"
        >
          <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
            <p.icon size={18} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-foreground text-sm">{p.label}</p>
            <p className="text-[11px] text-muted-foreground font-medium">{p.desc}</p>
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Allow</span>
        </button>
      ))}
    </div>
    <motion.button whileTap={{ scale: 0.96 }} onClick={next} className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow">
      Continue
    </motion.button>
    <button onClick={next} className="mt-3 text-xs text-muted-foreground font-medium underline">Skip for now</button>
  </motion.div>
);

export default StepPermissions;

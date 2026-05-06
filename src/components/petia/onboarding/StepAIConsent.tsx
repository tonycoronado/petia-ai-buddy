import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface Props { next: () => void; }

const StepAIConsent = ({ next }: Props) => {
  const [enabled, setEnabled] = useState(true);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-3xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow">
        <Sparkles size={28} />
      </div>
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-3">Enable AI features?</h1>
      <p className="text-muted-foreground font-medium mb-6 leading-relaxed text-sm">
        Petia uses Anthropic Claude to analyze food labels, triage health concerns, and generate weekly insights.
      </p>
      <div className="glass rounded-3xl p-4 shadow-soft mb-4 text-left flex items-start gap-3">
        <ShieldCheck size={18} className="text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
          Your data is never used to train AI models. You can disable AI any time in Settings — Petia still works without it.
        </p>
      </div>
      <div className="glass rounded-3xl p-4 shadow-soft mb-8 flex items-center justify-between">
        <div className="text-left">
          <p className="font-bold text-foreground text-sm">Enable AI features</p>
          <p className="text-[11px] text-muted-foreground font-medium">Recommended</p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>
      <motion.button whileTap={{ scale: 0.96 }} onClick={next} className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow">
        Continue
      </motion.button>
    </motion.div>
  );
};

export default StepAIConsent;

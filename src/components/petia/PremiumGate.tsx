import { motion } from "framer-motion";
import { Sparkles, Lock } from "lucide-react";

interface PremiumGateProps {
  title: string;
  description: string;
  onUpgrade: () => void;
  compact?: boolean;
}

const PremiumGate = ({ title, description, onUpgrade, compact }: PremiumGateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass rounded-4xl shadow-soft text-center ${compact ? "p-4" : "p-6"}`}
  >
    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow">
      <Lock size={20} />
    </div>
    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
      PRO Feature
    </p>
    <h3 className="text-lg font-black text-foreground mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground font-medium mb-5 leading-relaxed">
      {description}
    </p>
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onUpgrade}
      className="w-full py-3.5 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2"
    >
      <Sparkles size={16} /> Unlock Petia PRO
    </motion.button>
  </motion.div>
);

export default PremiumGate;

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
}

const EmptyState = ({ icon: Icon, title, description, ctaLabel, onCta }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-4xl p-8 shadow-soft text-center"
  >
    <div className="w-14 h-14 mx-auto mb-4 rounded-3xl gradient-accent p-1 shadow-glow">
      <div className="w-full h-full rounded-3xl bg-card flex items-center justify-center text-foreground">
        <Icon size={22} />
      </div>
    </div>
    <h3 className="text-base font-black text-foreground mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-5">
      {description}
    </p>
    {ctaLabel && onCta && (
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onCta}
        className="w-full py-3.5 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow"
      >
        {ctaLabel}
      </motion.button>
    )}
  </motion.div>
);

export default EmptyState;

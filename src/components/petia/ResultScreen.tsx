import { motion } from "framer-motion";
import { Info } from "lucide-react";

interface ResultScreenProps {
  onSave: () => void;
  onChat: () => void;
  onDismiss: () => void;
}

const ResultScreen = ({ onSave, onChat, onDismiss }: ResultScreenProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="fixed inset-0 z-[70] bg-background p-6 flex flex-col items-center justify-center"
  >
    <div className="w-full max-w-sm bg-warning rounded-5xl p-8 border border-warning/50 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6">
        <div className="w-12 h-12 rounded-2xl bg-warning-foreground/10 flex items-center justify-center text-warning-foreground">
          <Info size={24} />
        </div>
      </div>

      <div className="mb-8">
        <span className="text-warning-foreground font-bold uppercase tracking-widest text-[10px] bg-warning-foreground/10 px-3 py-1 rounded-full">
          Cautionary Analysis
        </span>
        <h2 className="text-3xl font-black mt-4 leading-tight text-foreground">
          Comprehensive Analysis
        </h2>
      </div>

      <div className="space-y-4 mb-10">
        <div className="flex gap-4">
          <div className="w-1 bg-petia-teal rounded-full flex-shrink-0" />
          <p className="text-muted-foreground font-medium leading-relaxed">
            Possible skin allergy detected. Moderate urgency level. Monitor for 24 hours for spreading.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onSave}
          className="w-full py-5 bg-foreground text-background rounded-4xl font-bold flex items-center justify-center gap-2"
        >
          Save to Max's Profile
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onChat}
          className="w-full py-5 bg-card border border-border text-foreground rounded-4xl font-bold"
        >
          Chat with AI Vet
        </motion.button>
      </div>
    </div>
    <button
      onClick={onDismiss}
      className="mt-8 text-muted-foreground font-bold uppercase tracking-widest text-xs"
    >
      Dismiss
    </button>
  </motion.div>
);

export default ResultScreen;

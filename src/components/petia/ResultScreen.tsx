import { motion } from "framer-motion";
import { Info, ShieldCheck, AlertTriangle } from "lucide-react";

export interface AnalysisResult {
  status: "Green" | "Yellow" | "Red";
  title: string;
  description: string;
}

interface ResultScreenProps {
  result: AnalysisResult;
  onSave: () => void;
  onChat: () => void;
  onDismiss: () => void;
}

const STATUS_CONFIG = {
  Green: {
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    pillBg: "bg-emerald-200/60",
    pillText: "text-emerald-800",
    label: "Safe Analysis",
    icon: ShieldCheck,
  },
  Yellow: {
    bg: "bg-warning",
    border: "border-warning/50",
    pillBg: "bg-warning-foreground/10",
    pillText: "text-warning-foreground",
    label: "Worth a Look",
    icon: Info,
  },
  Red: {
    bg: "bg-red-100",
    border: "border-red-200",
    pillBg: "bg-red-200/60",
    pillText: "text-red-800",
    label: "Needs Attention",
    icon: AlertTriangle,
  },
};

const ResultScreen = ({ result, onSave, onChat, onDismiss }: ResultScreenProps) => {
  const config = STATUS_CONFIG[result.status] || STATUS_CONFIG.Yellow;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[70] bg-background p-6 flex flex-col items-center justify-center"
    >
      <div className={`w-full max-w-sm ${config.bg} rounded-5xl p-8 border ${config.border} shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-6">
          <div className={`w-12 h-12 rounded-2xl ${config.pillBg} flex items-center justify-center ${config.pillText}`}>
            <Icon size={24} />
          </div>
        </div>

        <div className="mb-8">
          <span className={`${config.pillText} font-bold uppercase tracking-widest text-[10px] ${config.pillBg} px-3 py-1 rounded-full`}>
            {config.label}
          </span>
          <h2 className="text-3xl font-black mt-4 leading-tight text-foreground">
            {result.title}
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="w-1 bg-petia-teal rounded-full flex-shrink-0" />
            <p className="text-muted-foreground font-medium leading-relaxed">
              {result.description}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
            ⚕️ This is observational only — it is not medical advice. A licensed veterinarian is the only source of diagnosis or treatment.
          </p>
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
};

export default ResultScreen;

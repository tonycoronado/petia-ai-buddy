import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAppSettings } from "@/lib/appSettings";

interface Props { next: () => void; }

const StepAIConsent = ({ next }: Props) => {
  const { setAiEnabled } = useAppSettings();

  const enable = () => {
    setAiEnabled(true);
    next();
  };
  const skip = () => {
    setAiEnabled(false);
    next();
  };
  const showDisclosure = () =>
    toast("AI disclosure", {
      description:
        "Petia uses Anthropic, Google, and OpenAI for different AI features. Photos and data are never used to train models.",
    });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-3xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow">
        <Sparkles size={28} />
      </div>
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-3">Enable AI features?</h1>
      <p className="text-muted-foreground font-medium mb-6 leading-relaxed text-sm">
        Petia uses AI to analyze photos and documents, and to personalize guidance for your pet.
      </p>
      <button
        onClick={showDisclosure}
        className="text-xs font-bold text-primary underline mb-8"
      >
        View AI disclosure
      </button>
      <div className="space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={enable}
          className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow"
        >
          Enable AI features
        </motion.button>
        <button
          onClick={skip}
          className="w-full py-4 rounded-3xl text-foreground font-bold text-sm bg-muted/60"
        >
          Continue without AI
        </button>
      </div>
    </motion.div>
  );
};

export default StepAIConsent;

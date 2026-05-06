import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface LegalScreenProps {
  title: string;
  body: string[];
  onBack: () => void;
}

const LegalScreen = ({ title, body, onBack }: LegalScreenProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-12 px-6 pb-32 min-h-screen">
    <div className="flex items-center gap-3 mb-8">
      <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-muted">
        <ChevronLeft size={22} className="text-foreground" />
      </motion.button>
      <h1 className="text-2xl font-black tracking-tight text-foreground">{title}</h1>
    </div>
    <div className="glass rounded-4xl p-6 shadow-soft space-y-4">
      {body.map((p, i) => (
        <p key={i} className="text-sm text-foreground font-medium leading-relaxed">{p}</p>
      ))}
    </div>
  </motion.div>
);

export default LegalScreen;

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ScanScreenProps {
  onClose: () => void;
  onCapture: () => void;
}

const MODES = ["Health", "Toxicity", "Mood"];

const ScanScreen = ({ onClose, onCapture }: ScanScreenProps) => {
  const [scanMode, setScanMode] = useState("Health");

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-foreground flex flex-col"
    >
      <div className="p-8 flex justify-between items-center">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full glass-dark flex items-center justify-center text-primary-foreground"
        >
          <X size={24} />
        </button>
        <div className="glass-dark px-4 py-2 rounded-full text-primary-foreground text-xs font-bold uppercase tracking-widest">
          AI Vision Active
        </div>
        <div className="w-12" />
      </div>

      <div className="flex-1 mx-4 rounded-5xl bg-foreground/80 overflow-hidden relative border border-primary-foreground/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-primary-foreground/20 rounded-3xl border-dashed" />
        </div>
        <img
          src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800"
          className="w-full h-full object-cover opacity-60"
          alt="Viewfinder"
        />
      </div>

      <div className="p-8 pb-12">
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => setScanMode(mode)}
              className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                scanMode === mode
                  ? "bg-primary-foreground text-foreground"
                  : "glass-dark text-primary-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onCapture}
            className="w-20 h-20 rounded-full border-4 border-primary-foreground p-1"
          >
            <div className="w-full h-full rounded-full bg-primary-foreground" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScanScreen;

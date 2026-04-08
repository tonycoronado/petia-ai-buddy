import { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

interface PaywallScreenProps {
  onClose: () => void;
}

const FEATURES = [
  "Unlimited AI Food Scans",
  "Unlimited Pet Profiles",
  "Visual Health Diary + AI Triage",
  "Smart AI Reminders",
  "Priority Vet AI Chat",
];

const PaywallScreen = ({ onClose }: PaywallScreenProps) => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-card flex flex-col overflow-y-auto"
    >
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-secondary/50 to-transparent -z-10" />

      <div className="p-8 flex justify-end">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground"
        >
          <X size={24} />
        </button>
      </div>

      <div className="px-8 flex-1 pb-12">
        <div className="relative inline-block mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 gradient-accent opacity-30 blur-2xl rounded-full"
          />
          <h2 className="text-5xl font-black tracking-tighter relative text-foreground">
            Unlock
            <br />
            Petia PRO
          </h2>
        </div>

        <div className="space-y-4 mb-12">
          {FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <CheckCircle2 size={14} strokeWidth={3} />
              </div>
              <span className="font-bold text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelectedPlan("monthly")}
            className={`p-6 rounded-4xl border-2 text-left transition-all ${
              selectedPlan === "monthly"
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/50"
            }`}
          >
            <span className="text-[10px] font-black uppercase text-muted-foreground">Monthly</span>
            <div className="text-xl font-black mt-1 text-foreground">$5.99</div>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelectedPlan("yearly")}
            className={`p-6 rounded-4xl border-2 relative text-left transition-all ${
              selectedPlan === "yearly"
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/50"
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
              Best Value
            </div>
            <span className="text-[10px] font-black uppercase text-primary">Yearly</span>
            <div className="text-xl font-black mt-1 text-foreground">$49.99</div>
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          className="w-full py-6 gradient-cta text-primary-foreground rounded-4xl font-black text-lg shadow-glow"
        >
          Start 7-Day Free Trial
        </motion.button>
        <p className="text-center mt-6 text-muted-foreground text-xs font-medium">
          Cancel anytime. No commitment.
        </p>
      </div>
    </motion.div>
  );
};

export default PaywallScreen;

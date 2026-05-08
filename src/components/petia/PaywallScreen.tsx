import { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useAppSettings } from "@/lib/appSettings";

interface PaywallScreenProps {
  onClose: () => void;
  reason?: string;
}

const FEATURES = [
  "Unlimited AI Food Scans",
  "Visual Health Diary + AI Triage",
  "Mood Patterns & Insights",
  "Smart AI Reminders",
  "Unlimited Pet Profiles",
  "Priority AI Care Chat",
  "Vet Visit PDF Export",
];

const PaywallScreen = ({ onClose, reason }: PaywallScreenProps) => {
  const { startTrial } = useAppSettings();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-card flex flex-col overflow-y-auto"
    >
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-secondary/50 to-transparent -z-10" />

      <div className="p-8 flex justify-between items-center">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full bg-primary text-primary-foreground uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" /> 7-day free trial
        </span>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground">
          <X size={24} />
        </button>
      </div>

      <div className="px-8 flex-1 pb-12">
        <div className="relative inline-block mb-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 gradient-accent opacity-30 blur-2xl rounded-full" />
          <h2 className="text-5xl font-black tracking-tighter relative text-foreground">Unlock<br />Petia PRO</h2>
        </div>
        <p className="text-muted-foreground font-medium text-sm mb-8 leading-relaxed">
          Give your pet the premium care they deserve. Less than a bag of treats per month.
        </p>

        <div className="space-y-3 mb-4">
          {FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <CheckCircle2 size={14} strokeWidth={3} />
              </div>
              <span className="font-bold text-muted-foreground text-sm">{feature}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground font-medium mb-10 px-1">
          Vet Records OCR Import is free for everyone.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => setPlan("monthly")} className={`p-6 rounded-4xl border-2 text-left transition-all ${plan === "monthly" ? "border-primary bg-primary/5" : "border-border bg-muted/50"}`}>
            <span className="text-[10px] font-black uppercase text-muted-foreground">Monthly</span>
            <div className="text-xl font-black mt-1 text-foreground">$5.99</div>
            <span className="text-[10px] text-muted-foreground font-medium">per month</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => setPlan("yearly")} className={`p-6 rounded-4xl border-2 relative text-left transition-all ${plan === "yearly" ? "border-primary bg-primary/5" : "border-border bg-muted/50"}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
              Save 33%
            </div>
            <span className="text-[10px] font-black uppercase text-primary">Yearly</span>
            <div className="text-xl font-black mt-1 text-foreground">$47.99</div>
            <span className="text-[10px] text-muted-foreground font-medium">$3.99/month</span>
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            startTrial();
            toast.success("🎉 Welcome to Petia PRO! Enjoy your 7-day free trial.");
            onClose();
          }}
          className="w-full py-6 gradient-cta text-primary-foreground rounded-4xl font-black text-lg shadow-glow mb-4"
        >
          Start 7-Day Free Trial
        </motion.button>

        <button onClick={() => toast.success("Restored — no previous purchases found")} className="w-full text-xs font-bold text-primary flex items-center justify-center gap-1.5 mb-4">
          <RotateCcw size={12} /> Restore Purchases
        </button>

        <p className="text-center text-muted-foreground text-[10px] font-medium leading-relaxed">
          Auto-renewable subscription. Your trial converts to {plan === "yearly" ? "$47.99/year" : "$5.99/month"} unless cancelled at least 24 hours before the trial ends. Manage or cancel anytime in your store account settings.
        </p>
      </div>
    </motion.div>
  );
};

export default PaywallScreen;

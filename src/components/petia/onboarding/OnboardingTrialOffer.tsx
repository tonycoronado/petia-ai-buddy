import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAppSettings } from "@/lib/appSettings";

interface Props {
  petName: string;
  onContinueFree: () => void;
  onStartTrial: () => void;
}

const OnboardingTrialOffer = ({ petName, onContinueFree, onStartTrial }: Props) => {
  const { startTrial } = useAppSettings();
  const [plan, setPlan] = useState<"trial" | "monthly" | "yearly">("trial");

  const features = [
    `Unlimited Smart Capture scans for ${petName}`,
    "Visual Health Diary + AI Triage",
    "Smart AI Reminders",
    "Weekly Insights",
    "Expense Tracker",
    "Unlimited Pet Profiles",
    "AI Care Chat",
    "Health PDF Export",
  ];

  const handlePrimary = () => {
    startTrial();
    toast.success(`🎉 Petia PRO trial started for ${petName}`);
    onStartTrial();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-card flex flex-col overflow-y-auto max-w-md mx-auto"
    >
      <div className="absolute top-0 left-0 w-full h-96 bg-secondary/50 -z-10" />

      <div className="px-8 pt-12 pb-6 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full bg-primary text-primary-foreground uppercase tracking-widest">
          <Sparkles size={10} /> 7-day free trial
        </span>
      </div>

      <div className="px-8 flex-1 pb-10">
        <div className="relative inline-block mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 gradient-accent opacity-30 blur-2xl rounded-full"
          />
          <h2 className="text-4xl font-black tracking-tighter relative text-foreground">
            Give {petName}
            <br />
            premium care
          </h2>
        </div>
        <p className="text-muted-foreground font-medium text-sm mb-6 leading-relaxed">
          Try Petia PRO free for 7 days. Cancel anytime.
        </p>

        <div className="space-y-2.5 mb-8">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                <CheckCircle2 size={12} strokeWidth={3} />
              </div>
              <span className="font-bold text-muted-foreground text-[13px]">{f}</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="space-y-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setPlan("trial")}
            className={`w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center justify-between ${
              plan === "trial" ? "border-primary bg-primary/5 shadow-glow" : "border-border bg-muted/40"
            }`}
          >
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">Recommended</div>
              <div className="text-base font-black text-foreground mt-1">7-day free trial</div>
              <div className="text-[11px] text-muted-foreground font-medium">Then $47.99/year ($3.99/mo)</div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${plan === "trial" ? "border-primary bg-primary" : "border-muted-foreground/30"}`} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setPlan("yearly")}
            className={`w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center justify-between ${
              plan === "yearly" ? "border-primary bg-primary/5" : "border-border bg-muted/40"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-foreground">Annual</span>
                <span className="text-[9px] font-black uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Save 33%</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">$47.99/year</div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${plan === "yearly" ? "border-primary bg-primary" : "border-muted-foreground/30"}`} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setPlan("monthly")}
            className={`w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center justify-between ${
              plan === "monthly" ? "border-primary bg-primary/5" : "border-border bg-muted/40"
            }`}
          >
            <div>
              <div className="text-base font-black text-foreground">Monthly</div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">$5.99/month</div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${plan === "monthly" ? "border-primary bg-primary" : "border-muted-foreground/30"}`} />
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePrimary}
          className="w-full py-5 gradient-cta text-primary-foreground rounded-3xl font-black text-base shadow-glow mb-3"
        >
          {plan === "trial" ? "Start 7-day free trial" : plan === "yearly" ? "Start annual plan" : "Start monthly plan"}
        </motion.button>

        <button
          onClick={onContinueFree}
          className="w-full py-4 rounded-3xl text-foreground font-bold text-sm bg-muted/60 mb-4"
        >
          Continue free
        </button>

        <button
          onClick={() => toast.success("Restored — no previous purchases found")}
          className="w-full text-xs font-bold text-primary flex items-center justify-center gap-1.5 mb-4"
        >
          <RotateCcw size={12} /> Restore purchases
        </button>

        <p className="text-center text-muted-foreground text-[10px] font-medium leading-relaxed">
          Auto-renewable subscription. Cancel anytime in your store account. Free plan keeps core care features with limits.
        </p>
      </div>
    </motion.div>
  );
};

export default OnboardingTrialOffer;

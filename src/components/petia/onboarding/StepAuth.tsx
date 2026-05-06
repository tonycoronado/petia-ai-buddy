import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Apple } from "lucide-react";
import { toast } from "sonner";
import type { PetData } from "../OnboardingWizard";

interface Props {
  petData: PetData;
  onComplete: (data: PetData) => void;
}

const StepAuth = ({ petData, onComplete }: Props) => {
  const [mode, setMode] = useState<"welcome" | "email">("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const finish = (label: string) => {
    toast.success(label);
    onComplete(petData);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
      {mode === "welcome" ? (
        <>
          <span className="text-5xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">{petData.name}'s profile is ready!</h1>
          <p className="text-muted-foreground font-medium mb-8 leading-relaxed text-sm">
            Create your free account to save it and unlock the AI Care Assistant.
          </p>
          <button onClick={() => finish("Signed in with Apple")} className="w-full py-4 rounded-2xl bg-foreground text-background font-bold flex items-center justify-center gap-3 mb-3">
            <Apple size={18} /> Continue with Apple
          </button>
          <button onClick={() => finish("Signed in with Google")} className="w-full py-4 rounded-2xl glass shadow-soft font-bold text-foreground flex items-center justify-center gap-3 mb-4">
            Continue with Google
          </button>
          <button onClick={() => setMode("email")} className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-glow">
            <Mail size={18} /> Sign up with email
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">Create account</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full glass rounded-2xl px-5 py-3.5 text-sm text-foreground outline-none shadow-soft mb-3" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full glass rounded-2xl px-5 py-3.5 text-sm text-foreground outline-none shadow-soft mb-6" />
          <button onClick={() => finish("Account created")} disabled={!email.trim() || !password.trim()} className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-glow disabled:opacity-50">
            Create account <ArrowRight size={18} />
          </button>
          <button onClick={() => setMode("welcome")} className="text-xs text-muted-foreground mt-4 underline">Back</button>
        </>
      )}
    </motion.div>
  );
};

export default StepAuth;

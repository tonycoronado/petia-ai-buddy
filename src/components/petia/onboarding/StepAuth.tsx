import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
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
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast.error("Google sign-in failed. Try again.");
      setLoading(false);
    }
    // OAuth redirect will handle the rest; onComplete is triggered via auth listener in Index
    onComplete(petData);
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onComplete(petData);
    } catch (e: any) {
      toast.error(e.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  const photoSrc = petData.photoUrl;

  return (
    <div className="text-center">
      {/* Glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full gradient-accent blur-3xl -z-10"
      />

      {mode === "welcome" ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Floating bubble preview */}
          <div className="mx-auto mb-6 w-24 h-24 rounded-full p-1 gradient-accent shadow-glow">
            <img
              src={photoSrc || "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200"}
              alt={petData.name}
              className="w-full h-full rounded-full object-cover border-2 border-card"
            />
          </div>
          <span className="inline-block bg-card px-4 py-1 rounded-full text-xs font-bold shadow-sm border border-border uppercase tracking-wider text-foreground mb-6">
            {petData.name}
          </span>

          <h1 className="text-2xl font-black tracking-tight text-foreground mb-3">
            Wonderful! {petData.name}'s profile is ready.
          </h1>
          <p className="text-muted-foreground font-medium mb-10 leading-relaxed text-sm">
            Create your free account to access it and unlock the 24/7 AI Vet.
          </p>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-4 rounded-2xl glass shadow-soft font-bold text-foreground flex items-center justify-center gap-3 mb-4 hover:shadow-glow transition-shadow disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <button
            onClick={() => setMode("email")}
            className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-glow"
          >
            <Mail size={18} /> Sign up with Email
          </button>

          <p className="text-xs text-muted-foreground mt-6">
            Already have an account?{" "}
            <button onClick={() => { setMode("email"); setIsSignUp(false); }} className="text-primary font-bold">
              Log in
            </button>
          </p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
            {isSignUp ? "Create Account" : "Log In"}
          </h1>
          <p className="text-muted-foreground font-medium mb-8">
            {isSignUp ? `To save ${petData.name}'s profile` : "Welcome back"}
          </p>

          <div className="space-y-4 mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass rounded-2xl px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30 shadow-soft"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
              className="w-full glass rounded-2xl px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30 shadow-soft"
            />
          </div>

          <button
            onClick={handleEmailAuth}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-glow disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (
              <>{isSignUp ? "Create Account" : "Log In"} <ArrowRight size={18} /></>
            )}
          </button>

          <p className="text-xs text-muted-foreground mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-bold">
              {isSignUp ? "Log in" : "Sign up"}
            </button>
          </p>

          <button onClick={() => setMode("welcome")} className="text-xs text-muted-foreground mt-4 underline">
            Back
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default StepAuth;

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

interface AuthScreenProps {
  petName: string;
  onSuccess: () => void;
}

const AuthScreen = ({ petName, onSuccess }: AuthScreenProps) => {
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
      toast.error("Error con Google. Intenta de nuevo.");
      setLoading(false);
    }
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
        toast.success("¡Cuenta creada!");
        onSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      }
    } catch (e: any) {
      toast.error(e.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-8"
    >
      {/* Glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-72 h-72 rounded-full gradient-accent blur-3xl -z-10"
      />

      {mode === "welcome" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <span className="text-6xl mb-6 block">🐾</span>
          <h1 className="text-3xl font-black tracking-tight text-foreground mb-3">
            ¡El perfil de {petName} está creado!
          </h1>
          <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
            Crea tu cuenta gratis para guardar su perfil, activar el Escáner IA y
            acceder al asistente veterinario 24/7.
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
                Continuar con Google
              </>
            )}
          </button>

          <button
            onClick={() => setMode("email")}
            className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-glow"
          >
            <Mail size={18} /> Registrarse con Email
          </button>

          <p className="text-xs text-muted-foreground mt-6">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => { setMode("email"); setIsSignUp(false); }}
              className="text-primary font-bold"
            >
              Iniciar sesión
            </button>
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm w-full"
        >
          <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
            {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
          </h1>
          <p className="text-muted-foreground font-medium mb-8">
            {isSignUp
              ? `Para guardar el perfil de ${petName}`
              : "Bienvenido de vuelta"}
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
              placeholder="Contraseña"
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
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isSignUp ? "Crear cuenta" : "Entrar"} <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground mt-6">
            {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-bold"
            >
              {isSignUp ? "Iniciar sesión" : "Registrarse"}
            </button>
          </p>

          <button
            onClick={() => setMode("welcome")}
            className="text-xs text-muted-foreground mt-4 underline"
          >
            Volver
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AuthScreen;

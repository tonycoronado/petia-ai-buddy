import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface PetData {
  name: string;
  species: string;
  breed: string;
  ageRange: string;
  weightRange: string;
}

interface OnboardingWizardProps {
  onComplete: (data: PetData) => void;
}

const SPECIES = [
  { value: "dog", label: "Perro", emoji: "🐶" },
  { value: "cat", label: "Gato", emoji: "🐱" },
  { value: "small_pet", label: "Pequeño/Exótico", emoji: "🐰" },
  { value: "bird", label: "Ave", emoji: "🐦" },
];

const AGE_RANGES = [
  { value: "puppy", label: "Cachorro" },
  { value: "adult", label: "Adulto" },
  { value: "senior", label: "Senior" },
];

const WEIGHT_RANGES = [
  { value: "small", label: "Pequeño" },
  { value: "medium", label: "Mediano" },
  { value: "large", label: "Grande" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
};

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [petData, setPetData] = useState<PetData>({
    name: "",
    species: "",
    breed: "",
    ageRange: "adult",
    weightRange: "medium",
  });

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  const next = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const handleSpeciesSelect = (species: string) => {
    setPetData((d) => ({ ...d, species }));
    next();
  };

  const handleFinish = () => {
    onComplete(petData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
    >
      {/* Progress bar */}
      <div className="px-8 pt-14 pb-2">
        <Progress value={progress} className="h-1.5 bg-muted" />
        <p className="text-[10px] text-muted-foreground font-medium mt-2 tracking-widest uppercase text-right">
          Paso {step + 1} de {totalSteps}
        </p>
      </div>

      {/* Steps */}
      <div className="flex-1 flex items-center justify-center px-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="step-name"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-sm text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-black tracking-tight text-foreground mb-3"
              >
                ¡Hola! Bienvenido a Petia
              </motion.h1>
              <p className="text-muted-foreground font-medium mb-10">
                ¿A quién vamos a cuidar hoy?
              </p>

              <input
                type="text"
                placeholder="Nombre de tu mascota (ej. Kulka)"
                value={petData.name}
                onChange={(e) => setPetData((d) => ({ ...d, name: e.target.value }))}
                className="w-full text-center text-xl font-bold bg-transparent border-b-2 border-primary/30 focus:border-primary py-4 outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                autoFocus
              />

              <AnimatePresence>
                {petData.name.trim().length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={next}
                    className="mt-10 w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow"
                  >
                    Siguiente <ArrowRight size={18} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-species"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-sm text-center"
            >
              <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
                ¿Qué tipo de animal es {petData.name}?
              </h1>
              <p className="text-muted-foreground font-medium mb-8">
                Selecciona una opción
              </p>

              <div className="grid grid-cols-2 gap-4">
                {SPECIES.map((sp, i) => (
                  <motion.button
                    key={sp.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSpeciesSelect(sp.value)}
                    className={`glass rounded-3xl p-6 flex flex-col items-center gap-3 shadow-soft transition-all ${
                      petData.species === sp.value
                        ? "ring-2 ring-primary shadow-glow"
                        : ""
                    }`}
                  >
                    <span className="text-4xl">{sp.emoji}</span>
                    <span className="font-bold text-sm text-foreground">{sp.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-details"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-sm text-center"
            >
              <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
                ¡Casi listo!
              </h1>
              <p className="text-muted-foreground font-medium mb-8">
                Cuéntanos más sobre {petData.name}
              </p>

              {/* Breed */}
              <div className="mb-6">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block text-left">
                  Raza (opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Golden Retriever"
                  value={petData.breed}
                  onChange={(e) => setPetData((d) => ({ ...d, breed: e.target.value }))}
                  className="w-full glass rounded-2xl px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30 shadow-soft"
                />
              </div>

              {/* Age Range */}
              <div className="mb-6">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block text-left">
                  Edad
                </label>
                <div className="flex gap-2">
                  {AGE_RANGES.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => setPetData((d) => ({ ...d, ageRange: a.value }))}
                      className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                        petData.ageRange === a.value
                          ? "gradient-cta text-primary-foreground shadow-glow"
                          : "glass text-foreground shadow-soft"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Range */}
              <div className="mb-8">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block text-left">
                  Peso
                </label>
                <div className="flex gap-2">
                  {WEIGHT_RANGES.map((w) => (
                    <button
                      key={w.value}
                      onClick={() => setPetData((d) => ({ ...d, weightRange: w.value }))}
                      className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                        petData.weightRange === w.value
                          ? "gradient-cta text-primary-foreground shadow-glow"
                          : "glass text-foreground shadow-soft"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleFinish}
                className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow"
              >
                <Check size={18} /> Crear perfil de {petData.name}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OnboardingWizard;

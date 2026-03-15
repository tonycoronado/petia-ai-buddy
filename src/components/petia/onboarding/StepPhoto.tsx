import { useRef } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import type { PetData } from "../OnboardingWizard";

interface Props {
  petData: PetData;
  update: (patch: Partial<PetData>) => void;
  next: () => void;
}

const StepPhoto = ({ petData, update, next }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update({ photoUrl: url, photoFile: file });
    // Auto-advance after short delay for visual feedback
    setTimeout(next, 400);
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
        Let's put a face to the name!
      </h1>
      <p className="text-muted-foreground font-medium mb-10">
        Snap a quick photo of {petData.name}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {petData.photoUrl ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto w-40 h-40 rounded-full overflow-hidden gradient-accent p-1 shadow-glow"
        >
          <img
            src={petData.photoUrl}
            alt={petData.name}
            className="w-full h-full rounded-full object-cover"
          />
        </motion.div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => inputRef.current?.click()}
          className="mx-auto w-40 h-40 rounded-full glass shadow-soft flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/30 hover:border-primary transition-colors"
        >
          <Camera size={40} className="text-primary" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Take Photo
          </span>
        </motion.button>
      )}

      <button
        onClick={next}
        className="mt-8 text-sm text-muted-foreground underline"
      >
        Skip for now
      </button>
    </div>
  );
};

export default StepPhoto;

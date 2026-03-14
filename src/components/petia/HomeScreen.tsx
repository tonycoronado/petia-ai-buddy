import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import FloatingBubble, { type Pet } from "./FloatingBubble";

interface HomeScreenProps {
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
  onScan: () => void;
  onAnalyze: (base64: string) => void;
  isAnalyzing: boolean;
}

const HomeScreen = ({ pets, onSelectPet, onScan, onAnalyze, isAnalyzing }: HomeScreenProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Strip the data URL prefix to get pure base64
      const base64 = result.split(",")[1];
      onAnalyze(base64);
    };
    reader.readAsDataURL(file);

    // Reset so the same file can be selected again
    e.target.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 px-8 pb-32"
    >
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2 text-foreground">Petia</h1>
        <p className="text-muted-foreground font-medium">Your AI pet companion.</p>
      </header>

      <div className="flex justify-around mb-20 relative">
        {pets.map((pet, i) => (
          <FloatingBubble key={pet.id} pet={pet} delay={i * 0.5} onClick={onSelectPet} />
        ))}
        <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-petia-teal/10 blur-[80px] rounded-full" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center">
        <motion.button
          whileHover={{ scale: isAnalyzing ? 1 : 1.05 }}
          whileTap={{ scale: isAnalyzing ? 1 : 0.95 }}
          onClick={handleScanClick}
          disabled={isAnalyzing}
          className="w-48 h-48 rounded-full gradient-accent p-1 shadow-glow disabled:opacity-70"
        >
          <div className="w-full h-full rounded-full glass-dark flex flex-col items-center justify-center text-primary-foreground">
            {isAnalyzing ? (
              <>
                <Loader2 size={48} strokeWidth={1.5} className="mb-2 animate-spin" />
                <span className="font-bold uppercase tracking-[0.2em] text-xs">Analyzing...</span>
              </>
            ) : (
              <>
                <Camera size={48} strokeWidth={1.5} className="mb-2" />
                <span className="font-bold uppercase tracking-[0.2em] text-xs">Scan Pet</span>
              </>
            )}
          </div>
        </motion.button>
        <p className="mt-8 text-center text-muted-foreground text-sm font-medium max-w-[200px]">
          {isAnalyzing ? "AI is analyzing the image..." : "Point camera at symptoms or food items"}
        </p>
      </div>
    </motion.div>
  );
};

export default HomeScreen;

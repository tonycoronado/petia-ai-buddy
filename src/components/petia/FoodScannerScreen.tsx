import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, Loader2, ShieldCheck, AlertTriangle, Info, X } from "lucide-react";

interface FoodScannerScreenProps {
  onBack: () => void;
  petName: string;
}

interface ScanResult {
  score: "Good" | "Okay" | "Not Recommended";
  title: string;
  protein: string;
  fat: string;
  fiber: string;
  summary: string;
  suggestion: string;
}

const MOCK_RESULTS: ScanResult[] = [
  {
    score: "Good",
    title: "Royal Canin Adult Medium",
    protein: "25%",
    fat: "14%",
    fiber: "3.5%",
    summary: "This food is an excellent match for Luna's breed, age, and weight profile. High-quality protein sources and balanced nutrition.",
    suggestion: "Recommended portion: 320g per day split into two meals.",
  },
  {
    score: "Okay",
    title: "Generic Brand Kibble",
    protein: "18%",
    fat: "10%",
    fiber: "5%",
    summary: "This food meets basic nutritional needs but has higher filler content than ideal for an active Golden Retriever.",
    suggestion: "Consider upgrading to a breed-specific formula for better long-term health.",
  },
  {
    score: "Not Recommended",
    title: "Chocolate Cookie",
    protein: "4%",
    fat: "22%",
    fiber: "1%",
    summary: "⚠️ Chocolate is toxic to dogs! Even small amounts can cause vomiting, diarrhea, and in severe cases, heart problems.",
    suggestion: "If Luna has eaten this, monitor closely and contact your vet immediately.",
  },
];

const SCORE_CONFIG = {
  Good: { bg: "bg-primary/10", text: "text-primary", icon: ShieldCheck, label: "Safe for your pet" },
  Okay: { bg: "bg-warning", text: "text-warning-foreground", icon: Info, label: "Use with caution" },
  "Not Recommended": { bg: "bg-destructive/10", text: "text-destructive", icon: AlertTriangle, label: "Not recommended" },
};

const FoodScannerScreen = ({ onBack, petName }: FoodScannerScreenProps) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = () => {
    setScanning(true);
    // Simulate AI analysis delay with random result
    setTimeout(() => {
      const randomResult = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
      setResult(randomResult);
      setScanning(false);
    }, 2200);
  };

  const handleFileSelect = () => {
    // Trigger scan simulation regardless of file
    handleScan();
  };

  const config = result ? SCORE_CONFIG[result.score] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ChevronLeft size={22} className="text-foreground" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">AI Food Scanner</h1>
          <p className="text-xs text-muted-foreground font-medium">
            Personalized for {petName}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Scanner area */}
            <div className="glass rounded-5xl p-8 shadow-soft mb-6 flex flex-col items-center">
              <motion.div
                animate={scanning ? { scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-40 h-40 rounded-full gradient-accent p-1 shadow-glow mb-6"
              >
                <div className="w-full h-full rounded-full glass-dark flex flex-col items-center justify-center text-primary-foreground">
                  {scanning ? (
                    <>
                      <Loader2 size={40} strokeWidth={1.5} className="mb-2 animate-spin" />
                      <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Camera size={40} strokeWidth={1.5} className="mb-2" />
                      <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Scan Food</span>
                    </>
                  )}
                </div>
              </motion.div>

              <p className="text-center text-muted-foreground text-sm font-medium max-w-[220px] mb-6">
                {scanning
                  ? `Checking nutritional fit for ${petName}...`
                  : "Point your camera at a food label, bag, or dish"}
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={scanning}
                className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow disabled:opacity-60"
              >
                {scanning ? "Analyzing..." : "Take Photo or Upload"}
              </motion.button>

              {/* Quick demo button */}
              <button
                onClick={handleScan}
                disabled={scanning}
                className="mt-3 text-xs text-muted-foreground font-medium underline disabled:opacity-50"
              >
                Try with sample image
              </button>
            </div>

            {/* Info note */}
            <div className="glass rounded-3xl p-4 shadow-soft">
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                📋 The AI analyzes ingredients, nutritional content, and cross-references with {petName}'s breed, age, weight, and any known conditions for a personalized assessment.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Result card */}
            <div className={`rounded-4xl p-6 shadow-soft mb-4 ${config!.bg}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-2xl bg-card flex items-center justify-center ${config!.text}`}>
                  {config && <config.icon size={20} />}
                </div>
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${config!.text}`}>
                    {result.score}
                  </span>
                  <p className="text-xs text-muted-foreground font-medium">{config!.label}</p>
                </div>
              </div>

              <h2 className="text-xl font-black text-foreground mb-4">{result.title}</h2>

              {/* Nutrition stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Protein", val: result.protein },
                  { label: "Fat", val: result.fat },
                  { label: "Fiber", val: result.fiber },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-2xl p-3 text-center">
                    <div className="font-black text-foreground text-sm">{stat.val}</div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="w-1 bg-primary rounded-full flex-shrink-0" />
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Suggestion */}
            <div className="glass rounded-3xl p-4 shadow-soft mb-6">
              <p className="text-xs font-bold text-foreground mb-1">💡 Recommendation</p>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                {result.suggestion}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="glass rounded-3xl p-4 shadow-soft mb-6">
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                ⚕️ This analysis is informational. Consult your veterinarian for dietary changes.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setResult(null)}
                className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow"
              >
                Scan Another Food
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onBack}
                className="w-full py-4 glass rounded-3xl font-bold text-foreground shadow-soft"
              >
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FoodScannerScreen;

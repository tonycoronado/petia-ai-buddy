import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, ShieldCheck, AlertTriangle, Info, X, History, ImageIcon, ChevronLeft } from "lucide-react";
import { MOCK_SCAN_HISTORY, type ScanHistoryEntry } from "@/lib/mockData";
import { useAppSettings } from "@/lib/appSettings";
import { triggerHaptic } from "@/lib/haptic";
import { toast } from "sonner";
import EmptyState from "./EmptyState";
import PremiumGate from "./PremiumGate";

interface FoodScannerScreenProps {
  petName: string;
  onUpgrade: () => void;
  onBack?: () => void;
}

interface ScanResult {
  score: "Good" | "Okay" | "Not Recommended";
  title: string;
  brand: string;
  protein: string;
  fat: string;
  fiber: string;
  summary: string;
  portion: string;
  warnings: string[];
  alternatives: string[];
}

const MOCK_RESULTS: ScanResult[] = [
  {
    score: "Good",
    title: "Adult Medium Dry Food",
    brand: "Royal Canin",
    protein: "25%",
    fat: "14%",
    fiber: "3.5%",
    summary: "Excellent match for your pet's breed, age, and weight profile. High-quality protein and balanced nutrition.",
    portion: "320 g/day split into two meals",
    warnings: [],
    alternatives: ["Hill's Science Diet Adult", "Acana Adult Recipe"],
  },
  {
    score: "Okay",
    title: "Generic Brand Kibble",
    brand: "PetCo",
    protein: "18%",
    fat: "10%",
    fiber: "5%",
    summary: "Meets basic needs but higher filler content than ideal for an active dog.",
    portion: "350 g/day — monitor weight",
    warnings: ["High in grain fillers"],
    alternatives: ["Royal Canin Adult Medium", "Purina Pro Plan"],
  },
  {
    score: "Not Recommended",
    title: "Chocolate Cookie",
    brand: "Unknown",
    protein: "4%",
    fat: "22%",
    fiber: "1%",
    summary: "Chocolate is toxic to dogs. Even small amounts can cause vomiting, diarrhea, and heart issues.",
    portion: "Do not feed",
    warnings: ["Contains theobromine (toxic)", "High sugar"],
    alternatives: ["Carrot sticks", "Plain cooked chicken (allergy permitting)"],
  },
];

const SCORE_CONFIG = {
  Good: { bg: "bg-primary/10", text: "text-primary", icon: ShieldCheck, label: "Safe for your pet" },
  Okay: { bg: "bg-warning", text: "text-warning-foreground", icon: Info, label: "Use with caution" },
  "Not Recommended": { bg: "bg-destructive/10", text: "text-destructive", icon: AlertTriangle, label: "Not recommended" },
};

const FREE_SCAN_LIMIT = 3;

const FoodScannerScreen = ({ petName, onUpgrade, onBack }: FoodScannerScreenProps) => {
  const { isPremium } = useAppSettings();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [view, setView] = useState<"scan" | "history">("scan");
  const [scanCount, setScanCount] = useState(0);
  const [history, setHistory] = useState<ScanHistoryEntry[]>(MOCK_SCAN_HISTORY);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = () => {
    if (!isPremium && scanCount >= FREE_SCAN_LIMIT) {
      toast.error("Free plan limited to 3 scans");
      onUpgrade();
      return;
    }
    triggerHaptic("medium");
    setScanning(true);
    setTimeout(() => {
      const r = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
      setResult(r);
      setScanning(false);
      setScanCount((c) => c + 1);
      setHistory([
        { id: `s${Date.now()}`, date: "Today", title: r.title, brand: r.brand, score: r.score, thumb: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=200" },
        ...history,
      ]);
      triggerHaptic("success");
    }, 2000);
  };

  const config = result ? SCORE_CONFIG[result.score] : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-12 px-6 pb-32 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-muted">
              <ChevronLeft size={22} className="text-foreground" />
            </button>
          )}
          <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">AI Food Scanner</h1>
          <p className="text-xs text-muted-foreground font-medium">
            Personalized for {petName}
            {!isPremium && ` • ${Math.max(0, FREE_SCAN_LIMIT - scanCount)} free scans left`}
          </p>
          </div>
        </div>
        <button
          onClick={() => setView(view === "scan" ? "history" : "scan")}
          className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-foreground shadow-soft"
        >
          <History size={16} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === "history" ? (
          <motion.div key="hist" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {history.length === 0 ? (
              <EmptyState icon={ImageIcon} title="No scans yet" description="Your scanned foods will appear here." ctaLabel="Scan a food" onCta={() => setView("scan")} />
            ) : (
              <div className="space-y-2">
                {history.map((s) => {
                  const cfg = SCORE_CONFIG[s.score];
                  return (
                    <div key={s.id} className="glass rounded-3xl p-4 flex items-center gap-3 shadow-soft">
                      <img src={s.thumb} alt={s.title} className="w-14 h-14 rounded-2xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm truncate">{s.title}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{s.brand} • {s.date}</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                        {s.score}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : !result ? (
          <motion.div key="scanner" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass rounded-5xl p-8 shadow-soft mb-6 flex flex-col items-center">
              <motion.div animate={scanning ? { scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] } : {}} transition={{ duration: 1.5, repeat: Infinity }} className="w-40 h-40 rounded-full gradient-accent p-1 shadow-glow mb-6">
                <div className="w-full h-full rounded-full glass-dark flex flex-col items-center justify-center text-primary-foreground">
                  {scanning ? (<><Loader2 size={40} strokeWidth={1.5} className="mb-2 animate-spin" /><span className="font-bold uppercase tracking-[0.2em] text-[10px]">Analyzing...</span></>) : (<><Camera size={40} strokeWidth={1.5} className="mb-2" /><span className="font-bold uppercase tracking-[0.2em] text-[10px]">Scan Food</span></>)}
                </div>
              </motion.div>
              <p className="text-center text-muted-foreground text-sm font-medium max-w-[240px] mb-6">
                {scanning ? `Checking nutritional fit for ${petName}...` : "Point your camera at a food label, bag, or dish"}
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScan} />
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => fileInputRef.current?.click()} disabled={scanning} className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow disabled:opacity-60">
                {scanning ? "Analyzing..." : "Take Photo or Upload"}
              </motion.button>
              <button onClick={handleScan} disabled={scanning} className="mt-3 text-xs text-muted-foreground font-medium underline disabled:opacity-50">
                Try with sample image
              </button>
            </div>
            {!isPremium && scanCount >= FREE_SCAN_LIMIT && (
              <PremiumGate
                title="Unlimited Scans"
                description={`You've used your free scans. Upgrade for unlimited AI food checks for ${petName}.`}
                onUpgrade={onUpgrade}
                compact
              />
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className={`rounded-4xl p-6 shadow-soft mb-4 ${config!.bg}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-2xl bg-card flex items-center justify-center ${config!.text}`}>
                  {config && <config.icon size={20} />}
                </div>
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${config!.text}`}>{result.score}</span>
                  <p className="text-xs text-muted-foreground font-medium">{config!.label}</p>
                </div>
              </div>
              <h2 className="text-xl font-black text-foreground">{result.title}</h2>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-4">{result.brand}</p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[{ label: "Protein", val: result.protein }, { label: "Fat", val: result.fat }, { label: "Fiber", val: result.fiber }].map((stat) => (
                  <div key={stat.label} className="bg-card rounded-2xl p-3 text-center">
                    <div className="font-black text-foreground text-sm">{stat.val}</div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="w-1 bg-primary rounded-full flex-shrink-0" />
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">{result.summary}</p>
              </div>
            </div>

            <div className="glass rounded-3xl p-4 shadow-soft mb-3">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Suggested portion for {petName}</p>
              <p className="text-sm text-foreground font-bold">{result.portion}</p>
            </div>

            {result.warnings.length > 0 && (
              <div className="bg-destructive/10 rounded-3xl p-4 mb-3">
                <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-2">Warnings</p>
                <ul className="space-y-1">
                  {result.warnings.map((w) => <li key={w} className="text-xs text-foreground font-medium flex gap-2"><AlertTriangle size={12} className="text-destructive shrink-0 mt-0.5" /> {w}</li>)}
                </ul>
              </div>
            )}

            <div className="glass rounded-3xl p-4 shadow-soft mb-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Better alternatives</p>
              <ul className="space-y-1">
                {result.alternatives.map((a) => <li key={a} className="text-xs text-foreground font-medium flex gap-2"><span className="text-primary">•</span> {a}</li>)}
              </ul>
            </div>

            <div className="glass rounded-3xl p-4 shadow-soft mb-6">
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                ⚕️ AI analysis is informational only. Always consult your veterinarian before changing {petName}'s diet.
              </p>
            </div>

            <div className="space-y-3">
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => setResult(null)} className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow">Scan Another Food</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FoodScannerScreen;

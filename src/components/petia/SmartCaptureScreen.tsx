import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ImagePlus,
  Loader2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  FileText,
  ChevronRight,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { triggerHaptic } from "@/lib/haptic";
import {
  classifyCapture,
  CAPTURE_LABEL,
  SAMPLE_CAPTURES,
  type CaptureKind,
} from "@/lib/mockClassifier";
import { MOCK_OCR_RESULT } from "@/lib/mockData";
import PetHeader from "./PetHeader";
import type { Pet } from "./FloatingBubble";

interface SmartCaptureScreenProps {
  activePet: Pet;
  onTapPet: () => void;
  onOpenFullScanner: () => void;
  onOpenFullDiary: () => void;
  onOpenFullImport: () => void;
}

type Phase = "pick" | "analyzing" | "uncertain" | "result";

const SmartCaptureScreen = ({
  activePet,
  onTapPet,
  onOpenFullScanner,
  onOpenFullDiary,
  onOpenFullImport,
}: SmartCaptureScreenProps) => {
  const [phase, setPhase] = useState<Phase>("pick");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [kind, setKind] = useState<Exclude<CaptureKind, "uncertain">>("food");
  const fileRef = useRef<HTMLInputElement>(null);

  const startAnalyze = (forced?: CaptureKind, thumb?: string) => {
    triggerHaptic("light");
    if (thumb) setPhotoUrl(thumb);
    setPhase("analyzing");
    setTimeout(() => {
      const { kind: k } = classifyCapture(forced);
      if (k === "uncertain") {
        setPhase("uncertain");
      } else {
        setKind(k);
        setPhase("result");
        triggerHaptic("success");
      }
    }, 1400);
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhotoUrl(url);
    startAnalyze();
  };

  const reset = () => {
    setPhotoUrl(null);
    setPhase("pick");
  };

  const correctType = (k: Exclude<CaptureKind, "uncertain">) => {
    setKind(k);
    setPhase("result");
    toast.success(`Switched to ${CAPTURE_LABEL[k]}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 min-h-screen"
    >
      <PetHeader
        activePet={activePet}
        onTapPet={onTapPet}
        subtitle="Capturing for"
        right={
          phase !== "pick" && (
            <button
              onClick={reset}
              className="px-3 py-2 rounded-2xl glass shadow-soft text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1"
            >
              <RotateCcw size={12} /> Start over
            </button>
          )
        }
      />

      <h1 className="text-3xl font-black tracking-tight text-foreground mb-1">Smart Capture</h1>
      <p className="text-sm text-muted-foreground font-medium mb-6">
        One photo. Petia figures out what it is.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
      />

      <AnimatePresence mode="wait">
        {phase === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass rounded-5xl p-8 shadow-soft mb-6 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full gradient-accent p-1 shadow-glow mb-6">
                <div className="w-full h-full rounded-full glass-dark flex flex-col items-center justify-center text-primary-foreground">
                  <Camera size={40} strokeWidth={1.5} className="mb-2" />
                  <span className="font-bold uppercase tracking-[0.2em] text-[10px]">
                    Take a photo
                  </span>
                </div>
              </div>
              <p className="text-center text-muted-foreground text-sm font-medium max-w-[260px] mb-6">
                Food label, a symptom, or a vet document — Petia routes it for you.
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => fileRef.current?.click()}
                className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2"
              >
                <Camera size={18} /> Open camera
              </motion.button>
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-3 text-xs text-muted-foreground font-bold flex items-center gap-1.5"
              >
                <ImagePlus size={14} /> Upload from library
              </button>
            </div>

            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">
              Try a sample
            </p>
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_CAPTURES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => startAnalyze(s.kind, s.thumb)}
                  className="glass rounded-3xl p-3 shadow-soft text-left active:scale-[0.97] transition"
                >
                  <img
                    src={s.thumb}
                    alt={s.label}
                    className="w-full h-20 rounded-2xl object-cover mb-2"
                  />
                  <p className="font-black text-foreground text-xs">{s.label}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-14"
          >
            {photoUrl && (
              <img
                src={photoUrl}
                alt="capture"
                className="w-32 h-32 rounded-3xl object-cover shadow-soft mb-6"
              />
            )}
            <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mb-5 shadow-glow">
              <Loader2 size={26} className="text-primary-foreground animate-spin" />
            </div>
            <p className="font-black text-foreground text-base mb-1">Understanding photo…</p>
            <p className="text-xs text-muted-foreground font-medium text-center max-w-[240px]">
              Checking if this is food, a symptom, or a document.
            </p>
          </motion.div>
        )}

        {phase === "uncertain" && (
          <motion.div
            key="uncertain"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass rounded-4xl p-5 shadow-soft mb-5 border border-warning/30">
              <p className="text-[10px] font-black text-warning-foreground uppercase tracking-widest mb-1">
                Not sure what this is
              </p>
              <p className="text-sm text-foreground font-bold">
                Help Petia by picking a category.
              </p>
            </div>
            {photoUrl && (
              <img
                src={photoUrl}
                alt="capture"
                className="w-full h-40 rounded-3xl object-cover shadow-soft mb-5"
              />
            )}
            <div className="space-y-3">
              <ChooserTile
                icon={ShieldCheck}
                title="Food"
                hint="Label, bag, dish, or treat"
                onClick={() => correctType("food")}
              />
              <ChooserTile
                icon={Stethoscope}
                title="Health concern"
                hint="Skin, eye, ear, paw, or behavior photo"
                onClick={() => correctType("health")}
              />
              <ChooserTile
                icon={FileText}
                title="Vet document"
                hint="Invoice, prescription, lab, vaccine record"
                onClick={() => correctType("doc")}
              />
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <ResultPreview
              kind={kind}
              petName={activePet.name}
              photoUrl={photoUrl}
              onCorrect={correctType}
              onOpenFull={() => {
                if (kind === "food") onOpenFullScanner();
                else if (kind === "health") onOpenFullDiary();
                else onOpenFullImport();
              }}
              onSave={() => {
                triggerHaptic("success");
                toast.success(`${CAPTURE_LABEL[kind]} saved to ${activePet.name}'s history`);
                reset();
              }}
              onDiscard={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- subcomponents ---

const ChooserTile = ({
  icon: Icon,
  title,
  hint,
  onClick,
}: {
  icon: any;
  title: string;
  hint: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full glass rounded-3xl p-4 shadow-soft flex items-center gap-4 text-left active:scale-[0.98] transition"
  >
    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
      <Icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-black text-foreground text-sm">{title}</p>
      <p className="text-[11px] text-muted-foreground font-medium">{hint}</p>
    </div>
    <ChevronRight size={16} className="text-muted-foreground" />
  </button>
);

const ResultPreview = ({
  kind,
  petName,
  photoUrl,
  onCorrect,
  onOpenFull,
  onSave,
  onDiscard,
}: {
  kind: Exclude<CaptureKind, "uncertain">;
  petName: string;
  photoUrl: string | null;
  onCorrect: (k: Exclude<CaptureKind, "uncertain">) => void;
  onOpenFull: () => void;
  onSave: () => void;
  onDiscard: () => void;
}) => {
  const [showCorrect, setShowCorrect] = useState(false);

  const cfg = {
    food: {
      icon: ShieldCheck,
      label: "Food scan",
      tone: "bg-emerald-100 text-emerald-700",
      headline: "Royal Canin Adult Medium",
      sub: "Looks safe for " + petName,
      meta: "Score: Good · 320 g/day",
    },
    health: {
      icon: Stethoscope,
      label: "Health observation",
      tone: "bg-warning text-warning-foreground",
      headline: "Possible skin redness",
      sub: "Status: Observe",
      meta: "Worth re-checking in 48h",
    },
    doc: {
      icon: FileText,
      label: "Vet document",
      tone: "bg-primary/15 text-primary",
      headline: `Found ${
        MOCK_OCR_RESULT.visits.length +
        MOCK_OCR_RESULT.vaccinations.length +
        MOCK_OCR_RESULT.medications.length
      } records`,
      sub: "Visits, vaccinations & meds",
      meta: "Review before saving",
    },
  }[kind];

  const Icon = cfg.icon;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${cfg.tone}`}
        >
          {cfg.label}
        </span>
        <button
          onClick={() => setShowCorrect((s) => !s)}
          className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1"
        >
          Not this? Change type
        </button>
      </div>

      {showCorrect && (
        <div className="glass rounded-3xl p-3 shadow-soft mb-4 flex gap-2">
          {(["food", "health", "doc"] as const)
            .filter((k) => k !== kind)
            .map((k) => (
              <button
                key={k}
                onClick={() => {
                  onCorrect(k);
                  setShowCorrect(false);
                }}
                className="flex-1 py-2 rounded-2xl bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest"
              >
                {CAPTURE_LABEL[k]}
              </button>
            ))}
        </div>
      )}

      {photoUrl && (
        <img
          src={photoUrl}
          alt="capture"
          className="w-full h-44 rounded-3xl object-cover shadow-soft mb-4"
        />
      )}

      <div className="glass rounded-4xl p-5 shadow-soft mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${cfg.tone}`}
          >
            <Icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-foreground text-base leading-tight">
              {cfg.headline}
            </p>
            <p className="text-xs text-muted-foreground font-medium">{cfg.sub}</p>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground font-medium">{cfg.meta}</p>
      </div>

      <button
        onClick={onOpenFull}
        className="w-full glass rounded-3xl p-4 shadow-soft flex items-center justify-between mb-4"
      >
        <span className="font-bold text-foreground text-sm flex items-center gap-2">
          <Sparkles size={14} className="text-primary" /> Open full result
        </span>
        <ChevronRight size={16} className="text-muted-foreground" />
      </button>

      <div className="glass rounded-3xl p-4 shadow-soft mb-5">
        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
          ⚕️ AI is informational only — not a diagnosis. A licensed veterinarian is the
          only source of treatment advice.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDiscard}
          className="flex-1 py-3.5 rounded-3xl bg-secondary text-foreground font-bold text-sm flex items-center justify-center gap-2"
        >
          <X size={16} /> Discard
        </button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onSave}
          className="flex-1 py-3.5 gradient-cta text-primary-foreground rounded-3xl font-bold text-sm shadow-glow flex items-center justify-center gap-2"
        >
          <Check size={16} /> Save
        </motion.button>
      </div>
    </>
  );
};

export default SmartCaptureScreen;

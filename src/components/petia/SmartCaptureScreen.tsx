import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ImagePlus,
  Loader2,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  FileText,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  Lock,
  Shield,
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
import { useAppSettings } from "@/lib/appSettings";
import PetHeader from "./PetHeader";
import type { Pet } from "./FloatingBubble";

interface SmartCaptureScreenProps {
  activePet: Pet;
  onTapPet: () => void;
  onOpenFullScanner: () => void;
  onOpenFullDiary: () => void;
  onOpenFullImport: () => void;
  onUpgrade: () => void;
  followUpFor?: string | null;
  onClearFollowUp?: () => void;
  onFirstAiResult?: () => void;
}

type Phase = "consent" | "pick" | "analyzing" | "uncertain" | "result" | "gated";

// Mock per-session usage so post-classification gates feel real.
let _foodScans = 0;
let _healthLogs = 0;
let _docImports = 0;
const FREE_FOOD = 3;
const FREE_HEALTH = 3;
const FREE_DOC = 1;

const ANALYZING_HINTS = [
  "Checking if this is food, a symptom, or a document…",
  "Looking at colors, shapes and text…",
  "Matching to known patterns…",
];

const SmartCaptureScreen = ({
  activePet,
  onTapPet,
  onOpenFullScanner,
  onOpenFullDiary,
  onOpenFullImport,
  onUpgrade,
  followUpFor,
  onClearFollowUp,
  onFirstAiResult,
}: SmartCaptureScreenProps) => {
  const { aiEnabled, setAiEnabled, isPremium } = useAppSettings();
  const [phase, setPhase] = useState<Phase>(aiEnabled ? "pick" : "consent");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [kind, setKind] = useState<Exclude<CaptureKind, "uncertain">>("food");
  const [hintIdx, setHintIdx] = useState(0);
  const [gatedKind, setGatedKind] = useState<Exclude<CaptureKind, "uncertain">>("food");
  const fileRef = useRef<HTMLInputElement>(null);

  // Re-evaluate consent when setting changes
  useEffect(() => {
    if (!aiEnabled && phase !== "consent") setPhase("consent");
    if (aiEnabled && phase === "consent") setPhase("pick");
  }, [aiEnabled]); // eslint-disable-line

  // Rotate analyzing hints
  useEffect(() => {
    if (phase !== "analyzing") return;
    const t = setInterval(() => setHintIdx((i) => (i + 1) % ANALYZING_HINTS.length), 1500);
    return () => clearInterval(t);
  }, [phase]);

  const checkGate = (k: Exclude<CaptureKind, "uncertain">): boolean => {
    if (isPremium) return false;
    if (k === "food" && _foodScans >= FREE_FOOD) return true;
    if (k === "health" && _healthLogs >= FREE_HEALTH) return true;
    if (k === "doc" && _docImports >= FREE_DOC) return true;
    return false;
  };

  const incrementUsage = (k: Exclude<CaptureKind, "uncertain">) => {
    if (k === "food") _foodScans += 1;
    if (k === "health") _healthLogs += 1;
    if (k === "doc") _docImports += 1;
  };

  const startAnalyze = (forced?: CaptureKind, thumb?: string) => {
    triggerHaptic("light");
    if (thumb) setPhotoUrl(thumb);
    setHintIdx(0);
    setPhase("analyzing");
    setTimeout(() => {
      const { kind: k } = classifyCapture(forced);
      if (k === "uncertain") {
        setPhase("uncertain");
      } else {
        if (checkGate(k)) {
          setGatedKind(k);
          setPhase("gated");
          return;
        }
        setKind(k);
        setPhase("result");
        triggerHaptic("success");
      }
    }, 6000);
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhotoUrl(url);
    startAnalyze();
  };

  const reset = () => {
    setPhotoUrl(null);
    setPhase(aiEnabled ? "pick" : "consent");
  };

  const correctType = (k: Exclude<CaptureKind, "uncertain">) => {
    if (checkGate(k)) {
      setGatedKind(k);
      setPhase("gated");
      return;
    }
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
        subtitle={followUpFor ? "Follow-up for" : "Capturing for"}
        right={
          phase !== "pick" && phase !== "consent" && (
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
        {followUpFor
          ? `Adding a follow-up to ${activePet.name}'s health entry.`
          : "One photo. Petia figures out what it is."}
      </p>

      {followUpFor && (
        <div className="glass rounded-3xl p-3 shadow-soft mb-5 flex items-center gap-3 border border-emerald-200">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Stethoscope size={16} />
          </div>
          <p className="text-[11px] text-foreground font-bold flex-1">
            Linking to: spot behind the left ear (Apr 6)
          </p>
          <button
            onClick={onClearFollowUp}
            className="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
          >
            Clear
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
      />

      <AnimatePresence mode="wait">
        {phase === "consent" && (
          <motion.div
            key="consent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass rounded-5xl p-6 shadow-soft mb-4">
              <div className="w-14 h-14 rounded-3xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow mb-4">
                <Shield size={22} />
              </div>
              <h2 className="text-xl font-black text-foreground mb-2 leading-tight">
                Enable AI to use Smart Capture
              </h2>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-5">
                Petia analyzes the photo to recognize food, a health concern, or a vet
                document. Photos stay private and aren't used to train any model.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setAiEnabled(true);
                  setPhase("pick");
                  triggerHaptic("success");
                }}
                className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow mb-3"
              >
                Enable AI
              </motion.button>
              <button
                onClick={() => toast.message("AI stays off. Turn it on later in Account.")}
                className="w-full text-xs font-bold text-muted-foreground py-2"
              >
                Not now
              </button>
            </div>
            <button
              onClick={() => toast.message("AI disclosure available in Account → Privacy")}
              className="w-full text-center text-[10px] font-black text-primary uppercase tracking-widest py-2"
            >
              View AI disclosure
            </button>
          </motion.div>
        )}

        {phase === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass rounded-5xl p-8 shadow-soft mb-6 flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full gradient-accent p-1 shadow-glow mb-6" aria-hidden>
                <div className="w-full h-full rounded-full glass-dark flex items-center justify-center text-primary-foreground">
                  <Camera size={44} strokeWidth={1.5} />
                </div>
                {/* viewfinder corner frame */}
                <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary-foreground/70 rounded-tl-lg" />
                <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary-foreground/70 rounded-tr-lg" />
                <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary-foreground/70 rounded-bl-lg" />
                <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary-foreground/70 rounded-br-lg" />
              </div>
              <p className="text-center text-muted-foreground text-sm font-medium max-w-[260px] mb-6">
                Show Petia anything — food, a concern, or a vet paper.
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => fileRef.current?.click()}
                className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2"
              >
                <Camera size={18} /> Take photo
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
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_CAPTURES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => startAnalyze(s.kind, s.thumb)}
                  className="rounded-2xl p-2 bg-muted/60 text-left active:scale-[0.97] transition"
                >
                  <img
                    src={s.thumb}
                    alt={s.label}
                    className="w-full h-16 rounded-xl object-cover mb-1.5"
                  />
                  <p className="font-bold text-foreground/80 text-[10px] leading-tight">
                    {s.label}
                  </p>
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
            <AnimatePresence mode="wait">
              <motion.p
                key={hintIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground font-medium text-center max-w-[240px]"
              >
                {ANALYZING_HINTS[hintIdx]}
              </motion.p>
            </AnimatePresence>
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

        {phase === "gated" && (
          <motion.div
            key="gated"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass rounded-5xl p-6 shadow-soft mb-4">
              <div className="w-14 h-14 rounded-3xl bg-secondary flex items-center justify-center text-foreground shadow-soft mb-4">
                <Lock size={22} />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                {CAPTURE_LABEL[gatedKind]} — limit reached
              </p>
              <h2 className="text-xl font-black text-foreground mb-2 leading-tight">
                Petia recognized this, but you've used your free {CAPTURE_LABEL[gatedKind].toLowerCase()} quota.
              </h2>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-5">
                Upgrade to keep saving unlimited{" "}
                {gatedKind === "food"
                  ? "food scans"
                  : gatedKind === "health"
                  ? "health observations"
                  : "vet document imports"}
                .
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onUpgrade}
                className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow mb-3 flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> Upgrade
              </motion.button>
              <button
                onClick={reset}
                className="w-full text-xs font-bold text-muted-foreground py-2"
              >
                Maybe later
              </button>
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
              followUp={!!followUpFor && kind === "health"}
              onCorrect={correctType}
              onOpenFull={() => {
                if (kind === "food") onOpenFullScanner();
                else if (kind === "health") onOpenFullDiary();
                else onOpenFullImport();
              }}
              onSave={() => {
                triggerHaptic("success");
                incrementUsage(kind);
                const label = followUpFor && kind === "health" ? "Follow-up" : CAPTURE_LABEL[kind];
                toast.success(`${label} saved to ${activePet.name}'s history`);
                if (followUpFor) onClearFollowUp?.();
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
  followUp,
  onCorrect,
  onOpenFull,
  onSave,
  onDiscard,
}: {
  kind: Exclude<CaptureKind, "uncertain">;
  petName: string;
  photoUrl: string | null;
  followUp: boolean;
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
      label: followUp ? "Health follow-up" : "Health observation",
      tone: "bg-warning text-warning-foreground",
      headline: followUp ? "Compared to Apr 6 photo" : "Possible skin redness",
      sub: followUp ? "Status: Improving" : "Status: Observe",
      meta: followUp ? "Side-by-side comparison saved" : "Worth re-checking in 48h",
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

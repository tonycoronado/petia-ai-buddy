import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  FileText,
  ImagePlus,
  Sparkles,
  Check,
  AlertTriangle,
  Trash2,
  Calendar,
  Syringe,
  Pill,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_OCR_RESULT, type OcrResult } from "@/lib/mockData";
import { triggerHaptic } from "@/lib/haptic";

interface Photo {
  id: string;
  url: string;
}

interface Props {
  petName: string;
  mode: "onboarding" | "profile" | "library";
  onBack?: () => void;
  onSkip: () => void;
  onComplete: (counts: { visits: number; reminders: number }) => void;
  onAddViaCapture?: () => void;
}

type Phase = "library" | "pick" | "analyzing" | "review" | "empty";

const ImportVetRecordsScreen = ({ petName, mode, onBack, onSkip, onComplete, onAddViaCapture }: Props) => {
  const [phase, setPhase] = useState<Phase>(mode === "library" ? "library" : "pick");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [result, setResult] = useState<OcrResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = 10 - photos.length;
    const next = Array.from(files).slice(0, remaining).map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(f),
    }));
    setPhotos((p) => [...p, ...next]);
  };

  const removePhoto = (id: string) => setPhotos((p) => p.filter((x) => x.id !== id));

  const analyze = () => {
    if (photos.length === 0) return;
    triggerHaptic("light");
    setPhase("analyzing");
    setTimeout(() => {
      const r: OcrResult = MOCK_OCR_RESULT;
      setResult(r);
      const total = r.visits.length + r.vaccinations.length + r.medications.length;
      setPhase(total === 0 ? "empty" : "review");
    }, 2200);
  };

  const removeFrom = (kind: "visits" | "vaccinations" | "medications", idx: number) => {
    if (!result) return;
    setResult({ ...result, [kind]: result[kind].filter((_, i) => i !== idx) });
  };

  const save = () => {
    if (!result) return;
    triggerHaptic("success");
    const visits = result.visits.length;
    const reminders = result.vaccinations.length + result.medications.length;
    toast.success(`Imported ${visits} visits + ${reminders} reminders`);
    onComplete({ visits, reminders });
  };

  const reset = () => {
    setPhotos([]);
    setResult(null);
    setPhase("pick");
  };

  const totalRecords = result
    ? result.visits.length + result.vaccinations.length + result.medications.length
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {(mode === "profile" || mode === "library") && onBack && (
            <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-muted">
              <ChevronLeft size={22} className="text-foreground" />
            </motion.button>
          )}
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {mode === "library" ? "Medical records" : "Import Vet Records"}
          </h1>
        </div>
        {mode === "onboarding" && phase === "pick" && (
          <button onClick={onSkip} className="text-[11px] font-black text-primary uppercase tracking-widest">
            Skip for now
          </button>
        )}
      </div>

      {/* LIBRARY — saved records */}
      {phase === "library" && (
        <>
          <p className="text-sm text-muted-foreground font-medium mb-5">
            {petName}'s saved records — vaccines, prescriptions, labs, invoices.
          </p>

          <button
            onClick={onAddViaCapture}
            className="w-full glass rounded-3xl p-3 shadow-soft flex items-center gap-3 mb-5 border border-primary/15"
          >
            <div className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow">
              <ImagePlus size={16} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-black text-foreground text-sm">Import from photo</p>
              <p className="text-[11px] text-muted-foreground font-medium">
                Routes through Smart Capture
              </p>
            </div>
          </button>

          {MOCK_OCR_RESULT.vaccinations.length > 0 && (
            <>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
                Vaccinations ({MOCK_OCR_RESULT.vaccinations.length})
              </p>
              <div className="space-y-2 mb-5">
                {MOCK_OCR_RESULT.vaccinations.map((v, i) => (
                  <div key={i} className="glass rounded-3xl p-4 shadow-soft flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                      <Syringe size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{v.name}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        Given {v.given}{v.nextDue ? ` · next ${v.nextDue}` : ""}
                      </p>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      Vaccine
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {MOCK_OCR_RESULT.medications.length > 0 && (
            <>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
                Medications ({MOCK_OCR_RESULT.medications.length})
              </p>
              <div className="space-y-2 mb-5">
                {MOCK_OCR_RESULT.medications.map((m, i) => (
                  <div key={i} className="glass rounded-3xl p-4 shadow-soft flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                      <Pill size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {m.dose} {m.unit} · {m.frequency}
                      </p>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-primary/15 text-primary">
                      Med
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {MOCK_OCR_RESULT.visits.length > 0 && (
            <>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
                Past visits ({MOCK_OCR_RESULT.visits.length})
              </p>
              <div className="space-y-2 mb-5">
                {MOCK_OCR_RESULT.visits.map((v, i) => (
                  <div key={i} className="glass rounded-3xl p-4 shadow-soft flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{v.reason}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {v.date} · {v.clinic}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* PICK */}
      {phase === "pick" && (
        <>
          <div className="glass rounded-4xl p-6 shadow-soft mb-6 text-center">
            <div className="w-16 h-16 rounded-3xl gradient-cta mx-auto mb-4 flex items-center justify-center text-primary-foreground shadow-glow">
              <FileText size={26} />
            </div>
            <h2 className="text-xl font-black text-foreground mb-2 leading-tight">
              Have past vet records for {petName}?
            </h2>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Take photos of vaccine certificates, prescriptions, invoices, or lab results. AI extracts dates, medications, and visits in ~30 seconds.
            </p>
          </div>

          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed mb-4 px-1">
            Up to 10 photos per session. Documents in English or Spanish. Your photos stay private.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
          />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => inputRef.current?.click()}
            disabled={photos.length >= 10}
            className="w-full py-4 rounded-3xl bg-secondary text-foreground font-bold flex items-center justify-center gap-2 shadow-soft mb-4 disabled:opacity-50"
          >
            <ImagePlus size={18} /> Add photos
          </motion.button>

          {photos.length > 0 && (
            <>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
                {photos.length} photo{photos.length === 1 ? "" : "s"} ready
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 mb-4 -mx-6 px-6">
                {photos.map((p) => (
                  <div key={p.id} className="relative shrink-0">
                    <img src={p.url} alt="record" className="w-20 h-20 rounded-2xl object-cover shadow-soft" />
                    <button
                      onClick={() => removePhoto(p.id)}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-soft"
                      aria-label="Remove photo"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={analyze}
            disabled={photos.length === 0}
            className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2 mb-3 disabled:opacity-50"
          >
            <Sparkles size={18} />
            {photos.length === 0 ? "Add photos to continue" : "Analyze with AI"}
          </motion.button>

          <button onClick={onSkip} className="w-full text-xs font-bold text-muted-foreground py-2">
            Skip for now
          </button>
        </>
      )}

      {/* ANALYZING */}
      {phase === "analyzing" && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center mb-6 shadow-glow">
            <Loader2 size={32} className="text-primary-foreground animate-spin" />
          </div>
          <p className="text-lg font-black text-foreground mb-1">Reading {photos.length} document{photos.length === 1 ? "" : "s"}…</p>
          <p className="text-xs text-muted-foreground font-medium">This usually takes 20–40 seconds.</p>
        </div>
      )}

      {/* REVIEW */}
      {phase === "review" && result && (
        <>
          <div className="glass rounded-4xl p-5 shadow-soft mb-5 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-primary" />
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Found {totalRecords} records</p>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Review and save. Tap to remove anything that's wrong.
            </p>
          </div>

          {result.visits.length > 0 && (
            <>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
                Vet Visits ({result.visits.length})
              </p>
              <div className="space-y-2 mb-5">
                {result.visits.map((v, i) => (
                  <div key={i} className="glass rounded-3xl p-4 shadow-soft flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{v.reason}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">{v.date}</p>
                      <p className="text-[10px] text-muted-foreground font-medium truncate">{v.clinic} • {v.vet}</p>
                    </div>
                    <button onClick={() => removeFrom("visits", i)} className="p-2 text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {result.vaccinations.length > 0 && (
            <>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
                Vaccinations ({result.vaccinations.length})
              </p>
              <div className="space-y-2 mb-5">
                {result.vaccinations.map((v, i) => (
                  <div key={i} className="glass rounded-3xl p-4 shadow-soft flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                      <Syringe size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{v.name}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Given {v.given}</p>
                      {v.nextDue && <p className="text-[10px] text-muted-foreground font-medium">Next due: {v.nextDue}</p>}
                    </div>
                    <button onClick={() => removeFrom("vaccinations", i)} className="p-2 text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {result.medications.length > 0 && (
            <>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
                Medications ({result.medications.length})
              </p>
              <div className="space-y-2 mb-5">
                {result.medications.map((m, i) => (
                  <div key={i} className="glass rounded-3xl p-4 shadow-soft flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                      <Pill size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">{m.dose} {m.unit} · {m.frequency}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">From {m.start} to {m.end}</p>
                    </div>
                    <button onClick={() => removeFrom("medications", i)} className="p-2 text-muted-foreground hover:text-destructive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {result.warnings.length > 0 && (
            <div className="glass rounded-3xl p-4 shadow-soft mb-5 bg-warning/40 border border-warning">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-warning-foreground" />
                <p className="text-[10px] font-black text-warning-foreground uppercase tracking-widest">Notes</p>
              </div>
              <ul className="space-y-1">
                {result.warnings.map((w, i) => (
                  <li key={i} className="text-xs text-warning-foreground font-medium leading-relaxed flex gap-2">
                    <span>•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={save}
            disabled={totalRecords === 0}
            className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2 mb-3 disabled:opacity-50"
          >
            <Check size={18} /> Save {totalRecords} record{totalRecords === 1 ? "" : "s"}
          </motion.button>
          <button onClick={reset} className="w-full text-xs font-bold text-muted-foreground py-2">
            Start over
          </button>
        </>
      )}

      {/* EMPTY */}
      {phase === "empty" && (
        <div className="glass rounded-4xl p-6 shadow-soft text-center">
          <div className="w-14 h-14 rounded-3xl bg-warning mx-auto mb-4 flex items-center justify-center text-warning-foreground">
            <AlertTriangle size={22} />
          </div>
          <p className="font-black text-foreground mb-1">No records found</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-5">
            We couldn't extract any usable records from those photos.
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={reset}
            className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow"
          >
            Try different photos
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default ImportVetRecordsScreen;

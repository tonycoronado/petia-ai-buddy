import { motion } from "framer-motion";
import {
  BookHeart,
  Scale,
  Stethoscope,
  FileText,
  Download,
  ChevronRight,
  Lock,
  Camera,
} from "lucide-react";
import {
  MOCK_VET_VISITS,
  MOCK_WEIGHT,
  MOCK_OCR_RESULT,
} from "@/lib/mockData";
import { useAppSettings } from "@/lib/appSettings";
import PetHeader from "./PetHeader";
import type { Pet } from "./FloatingBubble";

interface HealthScreenProps {
  activePet: Pet;
  onTapPet: () => void;
  onOpenDiary: () => void;
  onOpenWeight: () => void;
  onOpenVet: () => void;
  onOpenRecords: () => void;
  onOpenPDF: () => void;
  onAddViaCapture: () => void;
  onUpgrade: () => void;
}

// Mock recent activity preview
const RECENT = [
  {
    id: "r1",
    label: "Skin",
    title: "Redness behind left ear",
    date: "Apr 6",
    status: "Monitoring",
    tone: "bg-warning text-warning-foreground",
    thumb: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=160",
  },
  {
    id: "r2",
    label: "Vet visit",
    title: "Itchy ears check-up",
    date: "Mar 22",
    status: "Resolved",
    tone: "bg-emerald-100 text-emerald-700",
    thumb: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=160",
  },
];

const HealthScreen = ({
  activePet,
  onTapPet,
  onOpenDiary,
  onOpenWeight,
  onOpenVet,
  onOpenRecords,
  onOpenPDF,
  onAddViaCapture,
  onUpgrade,
}: HealthScreenProps) => {
  const { isPremium } = useAppSettings();
  const petId = String(activePet.id);

  const lastVet = MOCK_VET_VISITS.find((v) => v.petId === petId);
  const weights = MOCK_WEIGHT[petId] ?? [];
  const latestKg = weights[weights.length - 1]?.kg;
  const recordsCount =
    MOCK_OCR_RESULT.visits.length +
    MOCK_OCR_RESULT.vaccinations.length +
    MOCK_OCR_RESULT.medications.length;

  const sections = [
    {
      id: "diary",
      icon: BookHeart,
      title: "Photo journal",
      hint: "4 observations · 1 to follow up",
      onClick: onOpenDiary,
    },
    {
      id: "weight",
      icon: Scale,
      title: "Weight",
      hint: latestKg ? `${latestKg.toFixed(1)} kg · ${weights.length} entries` : "No entries yet",
      onClick: onOpenWeight,
    },
    {
      id: "vet",
      icon: Stethoscope,
      title: "Vet visits",
      hint: lastVet ? `Last: ${lastVet.date}` : "No visits logged",
      onClick: onOpenVet,
    },
    {
      id: "records",
      icon: FileText,
      title: "Medical records",
      hint: `${recordsCount} saved · vaccines, meds, labs`,
      onClick: onOpenRecords,
    },
  ];

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
        subtitle="Health for"
        size="lg"
        status={
          latestKg
            ? `${latestKg.toFixed(1)} kg · last vet ${lastVet?.date.split(",")[0] ?? "—"}`
            : "No health entries yet"
        }
      />

      <h1 className="text-3xl font-black tracking-tight text-foreground mb-1">Health</h1>
      <p className="text-sm text-muted-foreground font-medium mb-6">
        {activePet.name}'s full record, in one timeline.
      </p>

      {/* Quick stats strip */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <StatTile label="Weight" value={latestKg ? `${latestKg.toFixed(1)}kg` : "—"} />
        <StatTile label="Last vet" value={lastVet?.date.split(",")[0] ?? "—"} />
        <StatTile label="Records" value={String(recordsCount)} />
      </div>

      {/* Pet Timeline (recent) */}
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Pet timeline
        </p>
        <button
          onClick={onOpenDiary}
          className="text-[10px] font-black text-primary uppercase tracking-widest"
        >
          See all
        </button>
      </div>
      <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar -mx-1 px-1">
        {["All", "Health", "Vet", "Weight", "Mood"].map((c, i) => (
          <button
            key={c}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap min-h-[32px] ${
              i === 0 ? "gradient-cta text-primary-foreground shadow-glow" : "glass-ghost text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2 mb-6">
        {RECENT.map((r) => (
          <button
            key={r.id}
            onClick={onOpenDiary}
            className="w-full glass rounded-3xl p-3 shadow-soft flex items-center gap-3 text-left"
          >
            <img src={r.thumb} alt="" className="w-12 h-12 rounded-2xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {r.label} · {r.date}
              </p>
              <p className="font-bold text-foreground text-sm truncate">{r.title}</p>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${r.tone}`}>
              {r.status}
            </span>
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-3 mb-5">
        {sections.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={s.onClick}
            className="w-full glass rounded-4xl p-5 shadow-soft flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
              <s.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-foreground text-sm">{s.title}</p>
              <p className="text-[11px] text-muted-foreground font-medium truncate">{s.hint}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      {/* Inline secondary link to add via Capture */}
      <button
        onClick={onAddViaCapture}
        className="w-full text-center text-xs font-black text-primary uppercase tracking-widest py-3 mb-5 flex items-center justify-center gap-1.5"
      >
        <Camera size={13} /> Add via Smart Capture →
      </button>

      {/* PDF export */}
      <button
        onClick={isPremium ? onOpenPDF : onUpgrade}
        className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2"
      >
        {isPremium ? <Download size={18} /> : <Lock size={16} />}
        Export health PDF
      </button>
      <p className="text-[10px] text-muted-foreground font-medium text-center mt-3">
        Vet-friendly summary of {activePet.name}'s full record.
      </p>
    </motion.div>
  );
};

const StatTile = ({ label, value }: { label: string; value: string }) => (
  <div className="glass rounded-3xl p-3 shadow-soft text-center">
    <p className="font-black text-foreground text-sm leading-tight">{value}</p>
    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
      {label}
    </p>
  </div>
);

export default HealthScreen;

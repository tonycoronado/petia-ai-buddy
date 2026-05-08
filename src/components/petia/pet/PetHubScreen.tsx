import { motion } from "framer-motion";
import {
  Bell,
  Scale,
  Stethoscope,
  Sparkles,
  FileText,
  ScanLine,
  Siren,
  Pencil,
  Cake,
  Shield,
  BookHeart,
  Smile,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Pet } from "../FloatingBubble";
import FloatingBubble from "../FloatingBubble";
import PetEditSheet from "./PetEditSheet";
import { PET_DETAILS, MOCK_WEIGHT, MOCK_MOODS, MOCK_REMINDERS, MOCK_VET_VISITS, MOOD_SCORE } from "@/lib/mockData";
import { toast } from "sonner";

interface PetHubScreenProps {
  pets: Pet[];
  activePet: Pet;
  onSwitchPet: (pet: Pet) => void;
  onLongPressPet: (pet: Pet) => void;
  onAddPet: () => void;
  onOpenReminders: () => void;
  onOpenWeight: () => void;
  onOpenVet: () => void;
  onOpenDiary: () => void;
  onOpenImport: () => void;
  onOpenInsights: () => void;
  onOpenPDF: () => void;
  onOpenMoodHistory: () => void;
}

const TOOL_TILES = [
  { id: "reminders", label: "Reminders", icon: Bell, key: "onOpenReminders" },
  { id: "weight", label: "Weight", icon: Scale, key: "onOpenWeight" },
  { id: "vet", label: "Vet Visits", icon: Stethoscope, key: "onOpenVet" },
  { id: "diary", label: "Photo Journal", icon: BookHeart, key: "onOpenDiary" },
  { id: "insights", label: "Weekly Insights", icon: Sparkles, key: "onOpenInsights" },
  { id: "pdf", label: "Health PDF", icon: FileText, key: "onOpenPDF" },
  { id: "import", label: "Import Records", icon: ScanLine, key: "onOpenImport" },
];

const PetHubScreen = (props: PetHubScreenProps) => {
  const { pets, activePet, onSwitchPet, onLongPressPet, onAddPet } = props;
  const [editing, setEditing] = useState(false);
  const details = PET_DETAILS[String(activePet.id)];

  const stats = useMemo(() => {
    const petId = String(activePet.id);
    const weights = MOCK_WEIGHT[petId] ?? [];
    const latest = weights[weights.length - 1];
    const prev = weights[weights.length - 2];
    const delta = latest && prev ? latest.kg - prev.kg : 0;
    const weightLabel = latest
      ? `${latest.kg.toFixed(1)}kg ${delta > 0 ? "↑" : delta < 0 ? "↓" : "•"}`
      : "—";

    const moods = MOCK_MOODS[petId] ?? [];
    const avg = moods.length
      ? moods.reduce((s, m) => s + MOOD_SCORE[m.mood], 0) / moods.length
      : 0;
    const moodLabel =
      avg >= 4 ? "Great" : avg >= 3 ? "Good" : avg >= 2 ? "Quiet" : moods.length ? "Low" : "—";

    const due = MOCK_REMINDERS.filter(
      (r) => r.petId === petId && !r.done
    ).length;

    const lastVet = MOCK_VET_VISITS.find((v) => v.petId === petId);

    return [
      { label: "Weight", value: weightLabel, onClick: props.onOpenWeight },
      { label: "Mood 7d", value: moodLabel, onClick: props.onOpenMoodHistory },
      { label: "Due", value: String(due), onClick: props.onOpenReminders },
      { label: "Last vet", value: lastVet?.date.split(",")[0] ?? "—", onClick: props.onOpenVet },
    ];
  }, [activePet, props.onOpenWeight, props.onOpenMoodHistory, props.onOpenReminders, props.onOpenVet]);

  const handleEmergency = () => {
    window.open(
      "https://www.google.com/maps/search/emergency+veterinarian+near+me",
      "_blank",
      "noopener,noreferrer"
    );
    toast.success("Opening emergency vets near you…");
  };

  const handlers: Record<string, () => void> = {
    onOpenReminders: props.onOpenReminders,
    onOpenWeight: props.onOpenWeight,
    onOpenVet: props.onOpenVet,
    onOpenDiary: props.onOpenDiary,
    onOpenImport: props.onOpenImport,
    onOpenInsights: props.onOpenInsights,
    onOpenPDF: props.onOpenPDF,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 min-h-screen"
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Care</h1>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setEditing(true)}
          className="w-10 h-10 rounded-2xl glass shadow-soft flex items-center justify-center text-foreground"
        >
          <Pencil size={16} />
        </motion.button>
      </div>
      <p className="text-xs text-muted-foreground font-medium mb-4">
        Everything for {activePet.name} in one place
      </p>

      {/* Compact pet switcher (small bubbles) */}
      <div className="flex items-center gap-4 mb-6 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
        {pets.map((pet, i) => (
          <FloatingBubble
            key={pet.id}
            pet={pet}
            delay={i * 0.4}
            size="sm"
            active={String(pet.id) === String(activePet.id)}
            onClick={onSwitchPet}
            onLongPress={onLongPressPet}
          />
        ))}
        <button
          onClick={onAddPet}
          className="w-14 h-14 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center text-muted-foreground shrink-0"
          aria-label="Add pet"
        >
          +
        </button>
      </div>

      {/* Active pet header */}
      <div className="relative flex flex-col items-center mb-5">
        <div className="absolute -z-10 top-0 w-72 h-72 bg-primary/10 blur-[80px] rounded-full" />
        <div className="scale-150 mb-8 origin-center pt-4">
          <FloatingBubble
            pet={activePet}
            onClick={() => setEditing(true)}
            onLongPress={() => setEditing(true)}
          />
        </div>
        <h2 className="text-2xl font-black text-foreground mt-2">{activePet.name}</h2>
        <p className="text-xs text-muted-foreground font-medium">
          {activePet.breed} • {activePet.age} • {activePet.weight}
        </p>
        {details && (
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-secondary text-foreground flex items-center gap-1">
              <Cake size={11} /> {details.dob}
            </span>
            {details.allergies.length > 0 && (
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-warning text-warning-foreground flex items-center gap-1">
                <Shield size={11} /> Allergy: {details.allergies.join(", ")}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick stats strip */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={s.onClick}
            className="glass rounded-3xl p-3 shadow-soft text-center"
          >
            <p className="font-black text-foreground text-sm leading-tight">{s.value}</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              {s.label}
            </p>
          </button>
        ))}
      </div>

      {/* Tools grid */}
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">
        Care Tools
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TOOL_TILES.map((tile, i) => (
          <motion.button
            key={tile.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handlers[tile.key]}
            className="glass rounded-4xl p-5 shadow-soft text-left"
          >
            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center mb-3 text-foreground">
              <tile.icon size={18} />
            </div>
            <p className="font-black text-foreground text-sm">{tile.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Emergency vet */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleEmergency}
        className="w-full glass rounded-4xl p-5 shadow-soft flex items-center gap-4 border border-destructive/20"
      >
        <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
          <Siren size={20} />
        </div>
        <div className="flex-1 text-left">
          <p className="font-black text-foreground text-sm">Emergency Vet</p>
          <p className="text-[11px] text-muted-foreground font-medium">
            Open maps to nearest emergency veterinarian
          </p>
        </div>
      </motion.button>

      {editing && <PetEditSheet pet={activePet} onClose={() => setEditing(false)} />}
    </motion.div>
  );
};

export default PetHubScreen;

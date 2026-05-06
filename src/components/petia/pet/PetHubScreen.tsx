import { motion } from "framer-motion";
import {
  ChevronLeft,
  Bell,
  Scale,
  Stethoscope,
  DollarSign,
  Sparkles,
  FileText,
  Siren,
  Pencil,
  Cake,
  Shield,
} from "lucide-react";
import { useState } from "react";
import type { Pet } from "../FloatingBubble";
import FloatingBubble from "../FloatingBubble";
import PetSwitcher from "./PetSwitcher";
import PetEditSheet from "./PetEditSheet";
import { PET_DETAILS } from "@/lib/mockData";
import { toast } from "sonner";

interface PetHubScreenProps {
  pets: Pet[];
  activePet: Pet;
  onSelectPet: (pet: Pet) => void;
  onAddPet: () => void;
  onOpenReminders: () => void;
  onOpenWeight: () => void;
  onOpenVet: () => void;
  onOpenExpenses: () => void;
  onOpenInsights: () => void;
  onOpenPDF: () => void;
}

const TOOL_TILES = [
  { id: "reminders", label: "Reminders", icon: Bell, key: "onOpenReminders" },
  { id: "weight", label: "Weight", icon: Scale, key: "onOpenWeight" },
  { id: "vet", label: "Vet Visits", icon: Stethoscope, key: "onOpenVet" },
  { id: "expenses", label: "Expenses", icon: DollarSign, key: "onOpenExpenses" },
  { id: "insights", label: "Weekly Insights", icon: Sparkles, key: "onOpenInsights" },
  { id: "pdf", label: "Health PDF", icon: FileText, key: "onOpenPDF" },
];

const PetHubScreen = (props: PetHubScreenProps) => {
  const { pets, activePet, onSelectPet, onAddPet } = props;
  const [editing, setEditing] = useState(false);
  const details = PET_DETAILS[String(activePet.id)];

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
    onOpenExpenses: props.onOpenExpenses,
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
        <h1 className="text-3xl font-black tracking-tight text-foreground">Pet Hub</h1>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setEditing(true)}
          className="w-10 h-10 rounded-2xl glass shadow-soft flex items-center justify-center text-foreground"
        >
          <Pencil size={16} />
        </motion.button>
      </div>
      <p className="text-xs text-muted-foreground font-medium mb-6">
        Everything for {activePet.name} in one place
      </p>

      {/* Active pet header — large FloatingBubble centered */}
      <div className="relative flex flex-col items-center mb-6">
        <div className="absolute -z-10 top-0 w-72 h-72 bg-primary/10 blur-[80px] rounded-full" />
        <div className="scale-150 mb-8 origin-center pt-4">
          <FloatingBubble pet={activePet} onClick={() => setEditing(true)} />
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

      {/* Pet Switcher (FloatingBubbles only) */}
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 px-1">
        Your Pets
      </p>
      <PetSwitcher
        pets={pets}
        activePetId={String(activePet.id)}
        onSelect={onSelectPet}
        onAdd={onAddPet}
      />

      {/* Tools grid */}
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1 mt-4">
        Care Tools
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TOOL_TILES.map((tile, i) => (
          <motion.button
            key={tile.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
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

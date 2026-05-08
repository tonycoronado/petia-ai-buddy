import { motion } from "framer-motion";
import {
  Bell,
  Sparkles,
  MessageCircle,
  Wallet,
  Siren,
  ChevronRight,
  Lock,
} from "lucide-react";
import { MOCK_REMINDERS } from "@/lib/mockData";
import { useAppSettings } from "@/lib/appSettings";
import { toast } from "sonner";
import PetHeader from "./PetHeader";
import type { Pet } from "./FloatingBubble";

interface CareScreenProps {
  activePet: Pet;
  onTapPet: () => void;
  onOpenReminders: () => void;
  onOpenInsights: () => void;
  onOpenChat: () => void;
  onUpgrade: () => void;
}

const CareScreen = ({
  activePet,
  onTapPet,
  onOpenReminders,
  onOpenInsights,
  onOpenChat,
  onUpgrade,
}: CareScreenProps) => {
  const { isPremium } = useAppSettings();
  const petId = String(activePet.id);
  const due = MOCK_REMINDERS.filter((r) => r.petId === petId && !r.done).length;
  const overdue = MOCK_REMINDERS.filter((r) => r.petId === petId && r.overdue).length;

  const handleEmergency = () => {
    window.open(
      "https://www.google.com/maps/search/emergency+veterinarian+near+me",
      "_blank",
      "noopener,noreferrer"
    );
    toast.success("Opening emergency vets near you…");
  };

  const tools: {
    id: string;
    icon: any;
    title: string;
    hint: string;
    onClick: () => void;
    locked?: boolean;
  }[] = [
    {
      id: "reminders",
      icon: Bell,
      title: "Reminders",
      hint: overdue
        ? `${overdue} overdue · ${due} active`
        : `${due} active · vaccines, meds, grooming`,
      onClick: onOpenReminders,
    },
    {
      id: "smart",
      icon: Sparkles,
      title: "AI smart suggestions",
      hint: isPremium ? "3 personalized for " + activePet.name : "Premium",
      onClick: isPremium ? onOpenReminders : onUpgrade,
      locked: !isPremium,
    },
    {
      id: "chat",
      icon: MessageCircle,
      title: "AI care chat",
      hint: isPremium ? "Ask about " + activePet.name : "Premium",
      onClick: isPremium ? onOpenChat : onUpgrade,
      locked: !isPremium,
    },
    {
      id: "insights",
      icon: Sparkles,
      title: "Weekly insights",
      hint: isPremium ? "New summary ready" : "Premium",
      onClick: isPremium ? onOpenInsights : onUpgrade,
      locked: !isPremium,
    },
    {
      id: "expenses",
      icon: Wallet,
      title: "Expenses",
      hint: isPremium ? "Track vet, food, supplies" : "Premium",
      onClick: isPremium
        ? () => toast.success("Expenses coming soon")
        : onUpgrade,
      locked: !isPremium,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 min-h-screen"
    >
      <PetHeader activePet={activePet} onTapPet={onTapPet} subtitle="Care for" />

      <h1 className="text-3xl font-black tracking-tight text-foreground mb-1">Care</h1>
      <p className="text-sm text-muted-foreground font-medium mb-6">
        Routines, planning & helpers.
      </p>

      <div className="space-y-3 mb-6">
        {tools.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={t.onClick}
            className={`w-full glass rounded-4xl p-5 shadow-soft flex items-center gap-4 text-left ${
              t.locked ? "opacity-90" : ""
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
              <t.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-foreground text-sm flex items-center gap-1.5">
                {t.title}
                {t.locked && <Lock size={11} className="text-muted-foreground" />}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium truncate">{t.hint}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
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
            Opens maps to nearest 24/7 clinic
          </p>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default CareScreen;

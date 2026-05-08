import { motion } from "framer-motion";
import {
  Bell,
  Sparkles,
  MessageCircle,
  Wallet,
  ChevronRight,
  Plus,
  CalendarCheck,
  Scale,
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
  onOpenWeight?: () => void;
  onUpgrade: () => void;
}

const CareScreen = ({
  activePet,
  onTapPet,
  onOpenReminders,
  onOpenInsights,
  onOpenChat,
  onOpenWeight,
  onUpgrade,
}: CareScreenProps) => {
  const { isPremium } = useAppSettings();
  const petId = String(activePet.id);
  const due = MOCK_REMINDERS.filter((r) => r.petId === petId && !r.done).length;
  const overdue = MOCK_REMINDERS.filter((r) => r.petId === petId && r.overdue).length;

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
        Routines and planning for {activePet.name}.
      </p>

      {/* HERO — free useful action on top */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenReminders}
        className="w-full text-left rounded-5xl p-6 mb-4 gradient-cta shadow-glow text-primary-foreground"
      >
        <p className="text-[10px] font-black uppercase tracking-widest opacity-85 mb-1">
          Plan today's care
        </p>
        <p className="font-black text-2xl leading-tight">Add a reminder</p>
        <p className="text-xs font-medium opacity-90 mt-2">
          Vaccines, meds, grooming, vet visits — never miss one.
        </p>
        <span className="inline-flex items-center gap-1 mt-4 px-3 py-2 rounded-2xl bg-white/20 backdrop-blur text-[11px] font-black uppercase tracking-widest">
          <Plus size={12} /> New reminder
        </span>
      </motion.button>

      {/* ROUTINES — free */}
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
        Routines
      </p>
      <div className="space-y-3 mb-6">
        <Row
          icon={Bell}
          title="Reminders"
          hint={overdue ? `${overdue} overdue · ${due} active` : `${due} active for ${activePet.name}`}
          onClick={onOpenReminders}
        />
        <Row
          icon={CalendarCheck}
          title="Today's care"
          hint="Review what's scheduled for today"
          onClick={onOpenReminders}
        />
        {onOpenWeight && (
          <Row
            icon={Scale}
            title={`Log ${activePet.name}'s weight`}
            hint="Track changes month over month"
            onClick={onOpenWeight}
          />
        )}
      </div>

      {/* HELPERS — premium */}
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Petia helpers
        </p>
        {!isPremium && (
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/15 text-primary">
            Premium
          </span>
        )}
      </div>
      <div className="space-y-3 mb-4">
        <Row
          icon={Sparkles}
          title="AI smart suggestions"
          hint={isPremium ? `3 personalized for ${activePet.name}` : "Personalized reminder ideas"}
          onClick={isPremium ? onOpenReminders : onUpgrade}
        />
        <Row
          icon={MessageCircle}
          title="AI care chat"
          hint={isPremium ? `Ask about ${activePet.name}` : "Quick answers about your pet"}
          onClick={isPremium ? onOpenChat : onUpgrade}
        />
        <Row
          icon={Sparkles}
          title="Weekly insights"
          hint={isPremium ? "New summary ready" : "Mood, food & health patterns"}
          onClick={isPremium ? onOpenInsights : onUpgrade}
        />
        <Row
          icon={Wallet}
          title="Expenses"
          hint={isPremium ? "Track vet, food, supplies" : "Track pet spending"}
          onClick={isPremium ? () => toast.success("Expenses coming soon") : onUpgrade}
        />
      </div>

      {!isPremium && (
        <button
          onClick={onUpgrade}
          className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2"
        >
          <Sparkles size={16} /> Unlock Petia helpers
        </button>
      )}
    </motion.div>
  );
};

const Row = ({
  icon: Icon,
  title,
  hint,
  onClick,
  locked,
}: {
  icon: any;
  title: string;
  hint: string;
  onClick: () => void;
  locked?: boolean;
}) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`w-full glass rounded-4xl p-5 shadow-soft flex items-center gap-4 text-left ${
      locked ? "opacity-95" : ""
    }`}
  >
    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
      <Icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-black text-foreground text-sm">{title}</p>
      <p className="text-[11px] text-muted-foreground font-medium truncate">{hint}</p>
    </div>
    <ChevronRight size={16} className="text-muted-foreground" />
  </motion.button>
);

export default CareScreen;

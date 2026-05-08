import { useState } from "react";
import { motion } from "framer-motion";
import {
  Smile, Zap, Heart, Meh, Frown,
  Bell, Sparkles, ChevronRight, Siren, Lightbulb,
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptic";
import { MOCK_REMINDERS } from "@/lib/mockData";
import { useAppSettings } from "@/lib/appSettings";
import { toast } from "sonner";
import PetHeader from "./PetHeader";
import type { Pet } from "./FloatingBubble";

interface TodayScreenProps {
  activePet: Pet;
  onTapPet: () => void;
  onOpenReminders: () => void;
  onOpenInsights: () => void;
  onOpenDiary: () => void;
  onOpenWeight: () => void;
  onOpenMoodHistory: () => void;
  onUpgrade: () => void;
}

const MOODS = [
  { id: "energetic", icon: Zap, label: "Energetic" },
  { id: "happy", icon: Smile, label: "Happy" },
  { id: "normal", icon: Heart, label: "Normal" },
  { id: "quiet", icon: Meh, label: "Quiet" },
  { id: "lethargic", icon: Frown, label: "Low" },
];

const TodayScreen = ({
  activePet,
  onTapPet,
  onOpenReminders,
  onOpenInsights,
  onOpenDiary,
  onOpenWeight,
  onOpenMoodHistory,
  onUpgrade,
}: TodayScreenProps) => {
  const { isPremium } = useAppSettings();
  const [moodLogged, setMoodLogged] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMood = (id: string) => {
    triggerHaptic("light");
    setSelectedMood(id);
    setTimeout(() => setMoodLogged(true), 250);
  };

  const petId = String(activePet.id);
  const dueToday = MOCK_REMINDERS.filter(
    (r) => r.petId === petId && !r.done && (r.due.startsWith("Today") || r.overdue)
  );
  const nextReminder = dueToday[0];
  const followUp = true; // mock: 1 monitoring entry exists in diary
  const attentionCount = (nextReminder ? 1 : 0) + (followUp ? 1 : 0);

  const handleEmergency = () => {
    window.open(
      "https://www.google.com/maps/search/emergency+veterinarian+near+me",
      "_blank",
      "noopener,noreferrer"
    );
    toast.success("Opening emergency vets near you…");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 overflow-y-auto"
    >
      <PetHeader activePet={activePet} onTapPet={onTapPet} subtitle="Today for" />

      <h1 className="text-4xl font-black tracking-tight text-foreground mb-1">Today</h1>
      <p className="text-sm text-muted-foreground font-medium mb-6">
        {attentionCount === 0
          ? `${activePet.name} is all good.`
          : `${attentionCount} thing${attentionCount === 1 ? "" : "s"} to look at.`}
      </p>

      {/* Mood card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-4xl p-6 shadow-soft mb-4"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-black text-foreground text-sm uppercase tracking-widest">
            Daily mood
          </h2>
          <button
            onClick={onOpenMoodHistory}
            className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-0.5"
          >
            7-day trend <ChevronRight size={12} />
          </button>
        </div>
        <p className="text-muted-foreground text-xs font-medium mb-5">
          How is {activePet.name} feeling?
        </p>
        {!moodLogged ? (
          <div className="flex justify-between">
            {MOODS.map((m) => (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMood(m.id)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
                  selectedMood === m.id ? "bg-primary/10 scale-110" : "hover:bg-muted"
                }`}
              >
                <m.icon size={24} className="text-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {m.label}
                </span>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-3">
            <span className="text-2xl mb-2 block">✨</span>
            <p className="font-bold text-foreground text-sm">Mood logged</p>
            <p className="text-xs text-muted-foreground mt-1">Check back tomorrow.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Next reminder */}
      {nextReminder && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={onOpenReminders}
          className="w-full glass rounded-4xl p-5 shadow-soft mb-4 flex items-center gap-4 text-left"
        >
          <div className="w-11 h-11 rounded-2xl bg-warning flex items-center justify-center text-warning-foreground shrink-0">
            <Bell size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-warning-foreground uppercase tracking-widest">
              {nextReminder.overdue ? "Overdue" : "Due today"}
            </p>
            <p className="font-black text-foreground text-sm truncate">{nextReminder.title}</p>
            <p className="text-[11px] text-muted-foreground font-medium">{nextReminder.due}</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </motion.button>
      )}

      {/* Health follow-up */}
      {followUp && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={onOpenDiary}
          className="w-full glass rounded-4xl p-5 shadow-soft mb-4 flex items-center gap-4 text-left"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Heart size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
              Follow-up
            </p>
            <p className="font-black text-foreground text-sm truncate">
              Re-check the spot behind the left ear
            </p>
            <p className="text-[11px] text-muted-foreground font-medium">
              Last photo Apr 6 · take a follow-up
            </p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </motion.button>
      )}

      {/* Weekly insight */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onClick={isPremium ? onOpenInsights : onUpgrade}
        className="w-full glass rounded-4xl p-5 shadow-soft mb-4 flex items-center gap-4 text-left border border-primary/15"
      >
        <div className="w-11 h-11 rounded-2xl gradient-cta flex items-center justify-center shadow-glow shrink-0">
          <Sparkles size={18} className="text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-foreground text-sm">Weekly insight</p>
          <p className="text-[11px] text-muted-foreground font-medium truncate">
            {isPremium ? "Mood trending positive · 1 health item" : "Premium · unlock"}
          </p>
        </div>
        <ChevronRight size={16} className="text-muted-foreground" />
      </motion.button>

      {/* Suggested next action */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={onOpenWeight}
        className="w-full glass rounded-3xl p-4 shadow-soft mb-6 flex items-center gap-3 text-left"
      >
        <div className="w-9 h-9 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
          <Lightbulb size={16} />
        </div>
        <p className="text-xs text-foreground font-bold flex-1">
          Log {activePet.name}'s weight — 18 days since last entry
        </p>
        <ChevronRight size={14} className="text-muted-foreground" />
      </motion.button>

      {/* Emergency vet */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleEmergency}
        className="w-full glass rounded-3xl p-4 shadow-soft flex items-center gap-3 border border-destructive/20"
      >
        <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
          <Siren size={18} />
        </div>
        <div className="flex-1 text-left">
          <p className="font-black text-foreground text-sm">Emergency vet</p>
          <p className="text-[11px] text-muted-foreground font-medium">
            One tap to nearest 24/7 clinic
          </p>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default TodayScreen;

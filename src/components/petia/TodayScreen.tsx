import { useState } from "react";
import { motion } from "framer-motion";
import {
  Smile, Zap, Heart, Meh, Frown,
  Bell, ChevronRight, Siren, Sparkles, X,
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
  onOpenFollowUp: () => void;
  onUpgrade: () => void;
}

const MOODS = [
  { id: "energetic", icon: Zap, label: "Energetic" },
  { id: "happy", icon: Smile, label: "Happy" },
  { id: "normal", icon: Heart, label: "Normal" },
  { id: "quiet", icon: Meh, label: "Quiet" },
  { id: "lethargic", icon: Frown, label: "Lethargic" },
];

const TodayScreen = ({
  activePet,
  onTapPet,
  onOpenReminders,
  onOpenInsights,
  onOpenDiary,
  onOpenWeight,
  onOpenMoodHistory,
  onOpenFollowUp,
  onUpgrade,
}: TodayScreenProps) => {
  const { isPremium, trialActive, trialDaysLeft } = useAppSettings();
  const [trialBannerDismissed, setTrialBannerDismissed] = useState(false);
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
  const overdue = dueToday.find((r) => r.overdue);
  const nextReminder = dueToday[0];
  const followUpOpen = true; // mock: 1 monitoring entry exists in diary

  // Hero priority: overdue > due today > follow-up > all clear
  type HeroKind = "overdue" | "due" | "followup" | "clear";
  const heroKind: HeroKind = overdue
    ? "overdue"
    : nextReminder
    ? "due"
    : followUpOpen
    ? "followup"
    : "clear";

  const subline =
    heroKind === "overdue"
      ? `Start with what's overdue.`
      : heroKind === "due"
      ? `Top priority for ${activePet.name} today.`
      : heroKind === "followup"
      ? `One health item to re-check.`
      : `${activePet.name} is all set.`;

  // Secondary "needs attention" rows = remaining items not in hero
  const remaining = dueToday.filter((r) => r.id !== nextReminder?.id);
  const showFollowUpRow = followUpOpen && heroKind !== "followup";

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
      <PetHeader
        activePet={activePet}
        onTapPet={onTapPet}
        subtitle="Today for"
        size="lg"
        status={
          heroKind === "overdue"
            ? "Has something overdue"
            : heroKind === "due"
            ? `${dueToday.length} item${dueToday.length === 1 ? "" : "s"} today`
            : heroKind === "followup"
            ? "1 health follow-up"
            : "All set today 🐾"
        }
      />

      {trialActive && !trialBannerDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-3 shadow-soft mb-4 flex items-center gap-3 border border-primary/20"
        >
          <div className="w-9 h-9 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
            <Sparkles size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-foreground text-xs leading-tight">
              {trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} of Petia PRO left
            </p>
            <p className="text-[10px] text-muted-foreground font-medium truncate">
              Enjoying the premium helpers? Manage anytime in Account.
            </p>
          </div>
          <button
            onClick={() => setTrialBannerDismissed(true)}
            aria-label="Dismiss"
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}

      <h1 className="text-4xl font-black tracking-tight text-foreground mb-1">Today</h1>
      <p className="text-sm text-muted-foreground font-medium mb-6">{subline}</p>

      {/* HERO ZONE — single most important thing */}
      <Hero
        kind={heroKind}
        petName={activePet.name}
        reminderTitle={nextReminder?.title}
        reminderDue={nextReminder?.due}
        onOpenReminders={onOpenReminders}
        onOpenFollowUp={onOpenFollowUp}
      />

      {/* DAILY MOOD */}
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
                <m.icon size={22} className="text-foreground" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  {m.label}
                </span>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-3">
            <p className="font-bold text-foreground text-sm">Got it — thanks 🐾</p>
            <p className="text-xs text-muted-foreground mt-1">
              Petia will check in with {activePet.name} again tomorrow.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* NEEDS ATTENTION — only when more than the hero */}
      {(remaining.length > 0 || showFollowUpRow) && (
        <>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 mt-2 px-1">
            Needs attention
          </p>
          <div className="space-y-2 mb-4">
            {remaining.map((r) => (
              <button
                key={r.id}
                onClick={onOpenReminders}
                className="w-full glass rounded-3xl p-4 shadow-soft flex items-center gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                  <Bell size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm truncate">{r.title}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{r.due}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            ))}
            {showFollowUpRow && (
              <button
                onClick={onOpenFollowUp}
                className="w-full glass rounded-3xl p-4 shadow-soft flex items-center gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Heart size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm truncate">
                    Re-check spot behind left ear
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Last photo Apr 6 · take a follow-up
                  </p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </>
      )}

      {/* For-you suggestions moved to Care to keep Today focused on what's needed now. */}

      {/* EMERGENCY VET — pinned safety footer */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleEmergency}
        className="w-full rounded-3xl p-4 shadow-glow flex items-center gap-3 bg-destructive text-destructive-foreground"
      >
        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-destructive-foreground shrink-0">
          <Siren size={18} />
        </div>
        <div className="flex-1 text-left">
          <p className="font-black text-sm">Emergency vet</p>
          <p className="text-[11px] font-medium opacity-90">
            Find the nearest 24/7 clinic
          </p>
        </div>
        <ChevronRight size={16} className="opacity-90" />
      </motion.button>
    </motion.div>
  );
};

const Hero = ({
  kind,
  petName,
  reminderTitle,
  reminderDue,
  onOpenReminders,
  onOpenFollowUp,
}: {
  kind: "overdue" | "due" | "followup" | "clear";
  petName: string;
  reminderTitle?: string;
  reminderDue?: string;
  onOpenReminders: () => void;
  onOpenFollowUp: () => void;
}) => {
  if (kind === "clear") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-5xl p-6 mb-4 gradient-cta shadow-glow text-primary-foreground"
      >
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
          All clear
        </p>
        <p className="font-black text-2xl leading-tight">Nothing urgent today</p>
        <p className="text-xs font-medium opacity-85 mt-2">
          Log a mood or capture a photo to keep {petName}'s record fresh.
        </p>
      </motion.div>
    );
  }
  if (kind === "followup") {
    return (
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenFollowUp}
        className="w-full text-left rounded-5xl p-6 mb-4 gradient-accent shadow-glow text-primary-foreground"
      >
        <p className="text-[10px] font-black uppercase tracking-widest opacity-85 mb-1">
          Health follow-up
        </p>
        <p className="font-black text-xl leading-tight">
          Re-check the spot behind the left ear
        </p>
        <p className="text-xs font-medium opacity-90 mt-2">
          Last photo Apr 6 · add a follow-up via Capture
        </p>
        <span className="inline-flex items-center gap-1 mt-4 px-3 py-2 rounded-2xl bg-white/20 backdrop-blur text-[11px] font-black uppercase tracking-widest">
          Add follow-up <ChevronRight size={12} />
        </span>
      </motion.button>
    );
  }
  // due / overdue
  const isOver = kind === "overdue";
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onOpenReminders}
      className={`w-full text-left rounded-5xl p-6 mb-4 shadow-glow ${
        isOver
          ? "bg-destructive text-destructive-foreground"
          : "gradient-cta text-primary-foreground"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Bell size={14} className="opacity-90" />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-85">
          {isOver ? "Overdue" : "Due today"}
        </p>
      </div>
      <p className="font-black text-2xl leading-tight">{reminderTitle}</p>
      <p className="text-xs font-medium opacity-90 mt-2">{reminderDue}</p>
      <span className="inline-flex items-center gap-1 mt-4 px-3 py-2 rounded-2xl bg-white/20 backdrop-blur text-[11px] font-black uppercase tracking-widest">
        Mark done <ChevronRight size={12} />
      </span>
    </motion.button>
  );
};

const SuggestionRow = ({
  icon: Icon,
  title,
  hint,
  onClick,
  premium,
}: {
  icon: any;
  title: string;
  hint: string;
  onClick: () => void;
  premium?: boolean;
}) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="w-full glass rounded-4xl p-5 shadow-soft flex items-center gap-4 text-left"
  >
    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
      <Icon size={20} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-black text-foreground text-sm flex items-center gap-1.5">
        {title}
        {premium && (
          <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
            Premium
          </span>
        )}
      </p>
      <p className="text-[11px] text-muted-foreground font-medium truncate">{hint}</p>
    </div>
    <ChevronRight size={16} className="text-muted-foreground" />
  </motion.button>
);

export default TodayScreen;

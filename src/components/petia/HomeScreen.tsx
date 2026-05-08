import { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Zap, Heart, Meh, Frown, Bell, Sparkles, ChevronRight, Plus, ScanLine } from "lucide-react";
import FloatingBubble, { type Pet } from "./FloatingBubble";
import { triggerHaptic } from "@/lib/haptic";
import { MOCK_REMINDERS, MOCK_SCAN_HISTORY } from "@/lib/mockData";

interface HomeScreenProps {
  pets: Pet[];
  activePet: Pet;
  onSwitchPet: (pet: Pet) => void;
  onLongPressPet: (pet: Pet) => void;
  onOpenAccount: () => void;
  onOpenMoodHistory: () => void;
  onOpenReminders: () => void;
  onOpenInsights: () => void;
  onOpenScanner: () => void;
  onOpenDiary: () => void;
}

const MOODS = [
  { id: "energetic", icon: Zap, label: "Energetic", color: "text-primary" },
  { id: "happy", icon: Smile, label: "Happy", color: "text-primary" },
  { id: "normal", icon: Heart, label: "Normal", color: "text-muted-foreground" },
  { id: "quiet", icon: Meh, label: "Quiet", color: "text-warning-foreground" },
  { id: "lethargic", icon: Frown, label: "Low", color: "text-destructive" },
];

const HomeScreen = ({
  pets,
  activePet,
  onSwitchPet,
  onLongPressPet,
  onOpenAccount,
  onOpenMoodHistory,
  onOpenReminders,
  onOpenInsights,
  onOpenScanner,
  onOpenDiary,
}: HomeScreenProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodLogged, setMoodLogged] = useState(false);

  const handleMoodSelect = (id: string) => {
    triggerHaptic("light");
    setSelectedMood(id);
    setTimeout(() => setMoodLogged(true), 300);
  };

  const dueToday = MOCK_REMINDERS.filter(
    (r) => r.petId === String(activePet.id) && (r.due.startsWith("Today") || r.overdue)
  ).slice(0, 2);

  const lastScan = MOCK_SCAN_HISTORY[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 overflow-y-auto"
    >
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-1 text-foreground">Petia</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Caring for {activePet.name}
          </p>
        </div>
        <button
          onClick={onOpenAccount}
          aria-label="Open account"
          className="w-11 h-11 rounded-full gradient-accent p-0.5 shadow-soft shrink-0"
        >
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center font-black text-foreground text-sm">
            P
          </div>
        </button>
      </header>

      {/* Pet switcher row */}
      <div className="flex justify-around mb-10 relative">
        {pets.map((pet, i) => (
          <FloatingBubble
            key={pet.id}
            pet={pet}
            delay={i * 0.5}
            onClick={onSwitchPet}
            onLongPress={onLongPressPet}
            active={String(pet.id) === String(activePet.id)}
          />
        ))}
        <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
      </div>

      {/* Mood card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-4xl p-6 shadow-soft mb-4"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-black text-foreground text-sm uppercase tracking-widest">
            Daily Mood Check
          </h2>
          <button
            onClick={onOpenMoodHistory}
            className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-0.5"
          >
            7-day trend <ChevronRight size={12} />
          </button>
        </div>
        <p className="text-muted-foreground text-xs font-medium mb-5">
          How is {activePet.name} feeling today?
        </p>
        {!moodLogged ? (
          <div className="flex justify-between">
            {MOODS.map((mood) => (
              <motion.button
                key={mood.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMoodSelect(mood.id)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
                  selectedMood === mood.id ? "bg-primary/10 scale-110" : "hover:bg-muted"
                }`}
              >
                <mood.icon size={24} className={mood.color} />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {mood.label}
                </span>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-3"
          >
            <span className="text-2xl mb-2 block">✨</span>
            <p className="font-bold text-foreground text-sm">Mood logged!</p>
            <p className="text-xs text-muted-foreground mt-1">Check back tomorrow.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Today: due reminders */}
      {dueToday.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={onOpenReminders}
          className="w-full glass rounded-4xl p-5 shadow-soft mb-4 flex items-center gap-4 text-left"
        >
          <div className="w-10 h-10 rounded-2xl bg-warning flex items-center justify-center text-warning-foreground shrink-0">
            <Bell size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-foreground text-sm">Due today ({dueToday.length})</p>
            <p className="text-[11px] text-muted-foreground font-medium truncate">
              {dueToday.map((r) => r.title).join(" • ")}
            </p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </motion.button>
      )}

      {/* Latest scan */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onOpenScanner}
        className="w-full glass rounded-4xl p-5 shadow-soft mb-4 flex items-center gap-4 text-left"
      >
        <img src={lastScan.thumb} alt={lastScan.title} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Last scan • {lastScan.date}
          </p>
          <p className="font-black text-foreground text-sm truncate">{lastScan.title}</p>
        </div>
        <span
          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
            lastScan.score === "Good"
              ? "bg-emerald-100 text-emerald-700"
              : lastScan.score === "Okay"
              ? "bg-warning text-warning-foreground"
              : "bg-destructive/15 text-destructive"
          }`}
        >
          {lastScan.score}
        </span>
      </motion.button>

      {/* Weekly insight teaser */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        onClick={onOpenInsights}
        className="w-full glass rounded-4xl p-5 shadow-soft flex items-center gap-4 text-left border border-primary/10"
      >
        <div className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center shadow-glow shrink-0">
          <Sparkles size={18} className="text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-foreground text-sm">Weekly Insight</p>
          <p className="text-[11px] text-muted-foreground font-medium truncate">
            Your AI summary for {activePet.name}
          </p>
        </div>
        <ChevronRight size={16} className="text-muted-foreground" />
      </motion.button>
    </motion.div>
  );
};

export default HomeScreen;

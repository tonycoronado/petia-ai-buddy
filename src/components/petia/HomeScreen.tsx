import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Smile, Zap, Heart, Meh, Frown, Bell, Sparkles, ChevronRight } from "lucide-react";
import FloatingBubble, { type Pet } from "./FloatingBubble";
import { triggerHaptic } from "@/lib/haptic";
import { MOCK_REMINDERS } from "@/lib/mockData";

interface HomeScreenProps {
  pets: Pet[];
  activePet: Pet;
  onSelectPet: (pet: Pet) => void;
  onOpenScanner: () => void;
  onOpenAccount: () => void;
  onOpenMoodHistory: () => void;
  onOpenReminders: () => void;
  onOpenInsights: () => void;
}

const MOODS = [
  { id: "energetic", icon: Zap, label: "Energetic", color: "text-primary" },
  { id: "happy", icon: Smile, label: "Happy", color: "text-primary" },
  { id: "normal", icon: Heart, label: "Normal", color: "text-muted-foreground" },
  { id: "quiet", icon: Meh, label: "Quiet", color: "text-warning-foreground" },
  { id: "lethargic", icon: Frown, label: "Low", color: "text-destructive" },
];

const HomeScreen = ({ pets, activePet, onSelectPet, onOpenScanner, onOpenAccount, onOpenMoodHistory, onOpenReminders, onOpenInsights }: HomeScreenProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodLogged, setMoodLogged] = useState(false);

  const handleMoodSelect = (id: string) => {
    triggerHaptic("light");
    setSelectedMood(id);
    setTimeout(() => setMoodLogged(true), 300);
  };

  const dueToday = MOCK_REMINDERS.filter((r) => r.petId === String(activePet.id) && (r.due.startsWith("Today") || r.overdue)).slice(0, 2);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-12 px-6 pb-32 overflow-y-auto">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-1 text-foreground">Petia</h1>
          <p className="text-muted-foreground font-medium text-sm">Your Pet's Personal Care Companion</p>
        </div>
        <button onClick={onOpenAccount} className="w-11 h-11 rounded-full gradient-accent p-0.5 shadow-soft shrink-0">
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center font-black text-foreground text-sm">P</div>
        </button>
      </header>

      <div className="flex justify-around mb-10 relative">
        {pets.map((pet, i) => (
          <FloatingBubble key={pet.id} pet={pet} delay={i * 0.5} onClick={onSelectPet} />
        ))}
        <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-4xl p-6 shadow-soft mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-black text-foreground text-sm uppercase tracking-widest">Daily Mood Check</h2>
          <button onClick={onOpenMoodHistory} className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-0.5">
            7-day trend <ChevronRight size={12} />
          </button>
        </div>
        <p className="text-muted-foreground text-xs font-medium mb-5">How is {activePet.name} feeling today?</p>
        {!moodLogged ? (
          <div className="flex justify-between">
            {MOODS.map((mood) => (
              <motion.button key={mood.id} whileTap={{ scale: 0.9 }} onClick={() => handleMoodSelect(mood.id)} className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${selectedMood === mood.id ? "bg-primary/10 scale-110" : "hover:bg-muted"}`}>
                <mood.icon size={24} className={mood.color} />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-3">
            <span className="text-2xl mb-2 block">✨</span>
            <p className="font-bold text-foreground text-sm">Mood logged!</p>
            <p className="text-xs text-muted-foreground mt-1">Check back tomorrow.</p>
          </motion.div>
        )}
      </motion.div>

      {dueToday.length > 0 && (
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} onClick={onOpenReminders} className="w-full glass rounded-4xl p-5 shadow-soft mb-6 flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-2xl bg-warning flex items-center justify-center text-warning-foreground shrink-0"><Bell size={18} /></div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-foreground text-sm">Due today ({dueToday.length})</p>
            <p className="text-[11px] text-muted-foreground font-medium truncate">{dueToday.map((r) => r.title).join(" • ")}</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </motion.button>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileTap={{ scale: 0.96 }} onClick={onOpenScanner} className="glass rounded-4xl p-5 shadow-soft text-left">
          <div className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center mb-3"><Camera size={20} className="text-primary-foreground" /></div>
          <p className="font-black text-foreground text-sm">Food Scanner</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Check if it's safe for {activePet.name}</p>
        </motion.button>
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} whileTap={{ scale: 0.96 }} onClick={onOpenInsights} className="glass rounded-4xl p-5 shadow-soft text-left">
          <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center mb-3"><Sparkles size={20} className="text-foreground" /></div>
          <p className="font-black text-foreground text-sm">Weekly Insight</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Your AI summary for {activePet.name}</p>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HomeScreen;

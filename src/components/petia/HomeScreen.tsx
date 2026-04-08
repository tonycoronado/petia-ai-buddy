import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Smile, Zap, Heart, Meh, Frown, TrendingUp, Calendar, Star } from "lucide-react";
import FloatingBubble, { type Pet } from "./FloatingBubble";

interface HomeScreenProps {
  pets: Pet[];
  activePet: Pet;
  onSelectPet: (pet: Pet) => void;
  onOpenScanner: () => void;
}

const MOODS = [
  { id: "energetic", icon: Zap, label: "Energetic", color: "text-primary" },
  { id: "happy", icon: Smile, label: "Happy", color: "text-primary" },
  { id: "normal", icon: Heart, label: "Normal", color: "text-muted-foreground" },
  { id: "quiet", icon: Meh, label: "Quiet", color: "text-warning-foreground" },
  { id: "lethargic", icon: Frown, label: "Low", color: "text-destructive" },
];

const INSIGHTS = [
  {
    icon: TrendingUp,
    title: "Weight on Track",
    desc: "Luna has been at a healthy 28kg for 3 months. Keep it up!",
  },
  {
    icon: Calendar,
    title: "Vet Reminder",
    desc: "Annual check-up is coming up in 2 weeks. Would you like to schedule it?",
  },
  {
    icon: Star,
    title: "Mood Pattern",
    desc: "Luna is happiest on weekends! Extra walks seem to make a difference.",
  },
];

const HomeScreen = ({ pets, activePet, onSelectPet, onOpenScanner }: HomeScreenProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodLogged, setMoodLogged] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setTimeout(() => setMoodLogged(true), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 px-6 pb-32 overflow-y-auto"
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-1 text-foreground">Petia</h1>
        <p className="text-muted-foreground font-medium">Your Pet's Personal Care Companion</p>
      </header>

      {/* Pet Bubbles */}
      <div className="flex justify-around mb-10 relative">
        {pets.map((pet, i) => (
          <FloatingBubble key={pet.id} pet={pet} delay={i * 0.5} onClick={onSelectPet} />
        ))}
        <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
      </div>

      {/* Daily Mood Check */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-4xl p-6 shadow-soft mb-6"
      >
        <h2 className="font-black text-foreground text-sm uppercase tracking-widest mb-1">
          Daily Mood Check
        </h2>
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
                  selectedMood === mood.id
                    ? "bg-primary/10 scale-110"
                    : "hover:bg-muted"
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
            <p className="text-xs text-muted-foreground mt-1">
              {activePet.name}'s mood has been saved. Check back tomorrow!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenScanner}
          className="glass rounded-4xl p-5 shadow-soft text-left"
        >
          <div className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center mb-3">
            <Camera size={20} className="text-primary-foreground" />
          </div>
          <p className="font-black text-foreground text-sm">Food Scanner</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
            Check if it's safe for {activePet.name}
          </p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenScanner}
          className="glass rounded-4xl p-5 shadow-soft text-left"
        >
          <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center mb-3">
            <Heart size={20} className="text-foreground" />
          </div>
          <p className="font-black text-foreground text-sm">Health Check</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
            Scan a symptom or concern
          </p>
        </motion.button>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-black text-foreground text-sm uppercase tracking-widest mb-4 px-1">
          AI Insights
        </h2>
        <div className="space-y-3">
          {INSIGHTS.map((insight, i) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.08 }}
              className="glass rounded-3xl p-4 flex items-start gap-4 shadow-soft"
            >
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                <insight.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-sm">{insight.title}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5 leading-relaxed">
                  {insight.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen;

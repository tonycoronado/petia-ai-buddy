import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronRight } from "lucide-react";

interface HealthDiaryScreenProps {
  petName: string;
}

interface DiaryEntry {
  id: string;
  date: string;
  category: string;
  title: string;
  description: string;
  status: "Improving" | "Monitoring" | "Resolved";
  img: string;
}

const MOCK_ENTRIES: DiaryEntry[] = [
  {
    id: "1",
    date: "Apr 6",
    category: "Skin",
    title: "Minor skin irritation on left ear",
    description: "Redness noticed behind left ear. AI assessment: Possible mild allergic reaction. Monitor for 48 hours.",
    status: "Monitoring",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "2",
    date: "Apr 2",
    category: "Eyes",
    title: "Slight discharge from right eye",
    description: "Small amount of clear discharge. AI assessment: Likely minor irritation. Clean gently with warm water.",
    status: "Improving",
    img: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "3",
    date: "Mar 28",
    category: "Mobility",
    title: "Slight limp after morning walk",
    description: "Favoring right front leg after exercise. AI assessment: Could be minor strain. Rest for 24 hours.",
    status: "Resolved",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "4",
    date: "Mar 20",
    category: "Digestive",
    title: "Upset stomach after new treats",
    description: "Mild vomiting after trying new brand treats. AI assessment: Likely food sensitivity. Avoid this brand.",
    status: "Resolved",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Improving: "bg-primary/15 text-primary",
  Monitoring: "bg-warning text-warning-foreground",
  Resolved: "bg-muted text-muted-foreground",
};

const HealthDiaryScreen = ({ petName }: HealthDiaryScreenProps) => {
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 px-6 pb-32"
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Health Diary</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow"
        >
          <Camera size={18} />
        </motion.button>
      </div>
      <p className="text-sm text-muted-foreground font-medium mb-8">
        {petName}'s visual health timeline
      </p>

      {/* Timeline */}
      <div className="space-y-4">
        {MOCK_ENTRIES.map((entry, i) => (
          <motion.button
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedEntry(entry)}
            className="w-full glass rounded-3xl p-4 flex items-center gap-4 shadow-soft text-left"
          >
            <img
              src={entry.img}
              alt={entry.title}
              className="w-14 h-14 rounded-2xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {entry.category}
                </span>
                <span className="text-[10px] text-muted-foreground">•</span>
                <span className="text-[10px] text-muted-foreground font-medium">{entry.date}</span>
              </div>
              <p className="font-bold text-foreground text-sm truncate">{entry.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${STATUS_STYLES[entry.status]}`}
              >
                {entry.status}
              </span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 glass rounded-3xl p-4 shadow-soft">
        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
          ⚕️ This is not a diagnosis. If you are concerned about {petName}'s health, please consult a veterinarian.
        </p>
      </div>

      {/* Entry Detail Sheet */}
      <AnimatePresence>
        {selectedEntry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    {selectedEntry.category} • {selectedEntry.date}
                  </span>
                  <h3 className="text-xl font-black text-foreground mt-1">{selectedEntry.title}</h3>
                </div>
                <button onClick={() => setSelectedEntry(null)} className="p-2 rounded-xl hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              <img
                src={selectedEntry.img}
                alt={selectedEntry.title}
                className="w-full h-48 rounded-3xl object-cover mb-4"
              />

              <div className="flex gap-3 mb-4">
                <div className="w-1 bg-primary rounded-full flex-shrink-0" />
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  {selectedEntry.description}
                </p>
              </div>

              <span
                className={`inline-block text-[10px] font-black uppercase px-3 py-1.5 rounded-full mb-6 ${STATUS_STYLES[selectedEntry.status]}`}
              >
                Status: {selectedEntry.status}
              </span>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedEntry(null)}
                className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow"
              >
                Take Follow-up Photo
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HealthDiaryScreen;

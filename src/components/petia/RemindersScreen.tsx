import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, X, Bell, Check, Trash2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { MOCK_REMINDERS, type ReminderEntry, type ReminderCategory } from "@/lib/mockData";
import { useAppSettings } from "@/lib/appSettings";
import { triggerHaptic } from "@/lib/haptic";
import { toast } from "sonner";
import EmptyState from "./EmptyState";
import PremiumGate from "./PremiumGate";

interface RemindersScreenProps {
  petId: string;
  petName: string;
  onBack: () => void;
  onUpgrade: () => void;
}

const CATEGORIES: ReminderCategory[] = ["Vaccination", "Medication", "Deworming", "Grooming", "Vet Visit", "General"];
const CATEGORY_DEFAULTS: Record<ReminderCategory, ReminderEntry["recurrence"]> = {
  Vaccination: "Yearly",
  Medication: "Monthly",
  Deworming: "Monthly",
  Grooming: "Monthly",
  "Vet Visit": "Yearly",
  General: "One-time",
};

const FREE_LIMIT = 3;

const RemindersScreen = ({ petId, petName, onBack, onUpgrade }: RemindersScreenProps) => {
  const { isPremium } = useAppSettings();
  const [items, setItems] = useState<ReminderEntry[]>(MOCK_REMINDERS);
  const [tab, setTab] = useState<"upcoming" | "overdue" | "completed">("upcoming");
  const [showAdd, setShowAdd] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState<ReminderCategory>("General");

  const petItems = items.filter((r) => r.petId === petId);
  const filtered = useMemo(() => {
    if (tab === "completed") return petItems.filter((r) => r.done);
    if (tab === "overdue") return petItems.filter((r) => r.overdue && !r.done);
    return petItems.filter((r) => !r.done && !r.overdue);
  }, [petItems, tab]);

  const activeCount = petItems.filter((r) => !r.done).length;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    if (!isPremium && activeCount >= FREE_LIMIT) {
      toast.error("Free plan limited to 3 active reminders");
      onUpgrade();
      return;
    }
    setItems([
      ...items,
      {
        id: `r${Date.now()}`,
        petId,
        title: newTitle,
        category: newCat,
        due: "Tomorrow, 9:00 AM",
        recurrence: CATEGORY_DEFAULTS[newCat],
        done: false,
      },
    ]);
    setNewTitle("");
    setShowAdd(false);
    triggerHaptic("success");
    toast.success("Reminder added");
  };

  const toggleDone = (id: string) => {
    setItems((arr) => arr.map((r) => (r.id === id ? { ...r, done: !r.done, overdue: false } : r)));
    triggerHaptic("success");
  };
  const remove = (id: string) => {
    setItems((arr) => arr.filter((r) => r.id !== id));
    toast.success("Reminder removed");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 min-h-screen"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-muted">
            <ChevronLeft size={22} className="text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Reminders</h1>
            <p className="text-xs text-muted-foreground font-medium">
              {activeCount}/{isPremium ? "∞" : FREE_LIMIT} active for {petName}
            </p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAdd(true)}
          className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-full p-1 mb-6">
        {(["upcoming", "overdue", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* AI Suggestions CTA */}
      {isPremium ? (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowSuggestions(true)}
          className="w-full glass rounded-4xl p-4 shadow-soft mb-6 flex items-center gap-4 border border-primary/20"
        >
          <div className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground">
            <Sparkles size={18} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-black text-foreground text-sm">AI Smart Suggestions</p>
            <p className="text-[11px] text-muted-foreground font-medium">3 personalized for {petName}</p>
          </div>
        </motion.button>
      ) : (
        <div className="mb-6">
          <PremiumGate
            title="AI Smart Reminders"
            description="Get personalized reminder suggestions based on breed, age, and health history."
            onUpgrade={onUpgrade}
            compact
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={`No ${tab} reminders`}
          description="Tap + to add a vaccination, medication, grooming, or vet visit reminder."
          ctaLabel="Add reminder"
          onCta={() => setShowAdd(true)}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-3xl p-4 flex items-center gap-3 shadow-soft"
            >
              <button
                onClick={() => toggleDone(r.id)}
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                  r.done ? "gradient-cta text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                <Check size={16} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    {r.category}
                  </span>
                  {r.overdue && (
                    <span className="text-[9px] font-black text-destructive uppercase tracking-widest">
                      Overdue
                    </span>
                  )}
                </div>
                <p className={`font-bold text-sm truncate ${r.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {r.title}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  {r.due} • {r.recurrence}
                </p>
              </div>
              <button onClick={() => remove(r.id)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground">
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[80]" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-foreground">New Reminder</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewCat(c)}
                    className={`px-3.5 py-2 rounded-full text-[11px] font-bold transition-all ${
                      newCat === c ? "gradient-cta text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                placeholder="Reminder title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full glass rounded-2xl px-5 py-3.5 text-sm text-foreground outline-none mb-3 shadow-soft"
                autoFocus
              />
              <p className="text-[10px] text-muted-foreground font-medium mb-5 px-2">
                Recurrence: {CATEGORY_DEFAULTS[newCat]} • Default time: 9:00 AM tomorrow
              </p>
              <motion.button whileTap={{ scale: 0.96 }} onClick={handleAdd} className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow">
                Add Reminder
              </motion.button>
            </motion.div>
          </>
        )}

        {showSuggestions && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSuggestions(false)} className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[80]" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" /> AI Suggestions
                </h3>
                <button onClick={() => setShowSuggestions(false)} className="p-2 rounded-xl hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-5">Personalized for {petName}</p>
              {[
                { title: "Annual rabies booster", cat: "Vaccination" as ReminderCategory },
                { title: "Monthly heartworm tablet", cat: "Medication" as ReminderCategory },
                { title: "Quarterly grooming", cat: "Grooming" as ReminderCategory },
              ].map((s, i) => (
                <div key={i} className="glass rounded-3xl p-4 flex items-center gap-3 mb-2 shadow-soft">
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-sm">{s.title}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{s.cat}</p>
                  </div>
                  <button
                    onClick={() => {
                      setItems([...items, { id: `r${Date.now()}-${i}`, petId, title: s.title, category: s.cat, due: "Next week, 9:00 AM", recurrence: CATEGORY_DEFAULTS[s.cat], done: false }]);
                      toast.success("Added");
                    }}
                    className="px-3 py-1.5 rounded-full gradient-cta text-primary-foreground text-[10px] font-black uppercase tracking-widest"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RemindersScreen;

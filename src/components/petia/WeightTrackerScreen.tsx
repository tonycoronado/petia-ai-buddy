import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, X, TrendingUp, TrendingDown, Minus, Scale } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { MOCK_WEIGHT, type WeightEntry } from "@/lib/mockData";
import { useAppSettings, kgToDisplay } from "@/lib/appSettings";
import { triggerHaptic } from "@/lib/haptic";
import { toast } from "sonner";
import PremiumGate from "./PremiumGate";
import EmptyState from "./EmptyState";

interface WeightTrackerScreenProps {
  petId: string;
  petName: string;
  onBack: () => void;
  onUpgrade: () => void;
}

const WeightTrackerScreen = ({ petId, petName, onBack, onUpgrade }: WeightTrackerScreenProps) => {
  const { units, setUnits, isPremium } = useAppSettings();
  const [entries, setEntries] = useState<WeightEntry[]>(MOCK_WEIGHT[petId] ?? []);
  const [showAdd, setShowAdd] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  const latest = entries[entries.length - 1];
  const prev = entries[entries.length - 2];
  const delta = latest && prev ? latest.kg - prev.kg : 0;
  const trendIcon = delta > 0.05 ? TrendingUp : delta < -0.05 ? TrendingDown : Minus;
  const trendLabel = delta > 0.05 ? "Gaining" : delta < -0.05 ? "Losing" : "Stable";

  const handleAdd = () => {
    const v = parseFloat(newWeight);
    if (!v) return;
    const kg = units === "kg" ? v : v / 2.2046;
    setEntries([...entries, { date: "Today", kg }]);
    setNewWeight("");
    setShowAdd(false);
    triggerHaptic("success");
    toast.success("Weight logged");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 min-h-screen"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-muted">
            <ChevronLeft size={22} className="text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Weight</h1>
            <p className="text-xs text-muted-foreground font-medium">{petName}'s log</p>
          </div>
        </div>
        <div className="flex bg-muted rounded-full p-1">
          {(["kg", "lbs"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnits(u)}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                units === u ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={Scale}
          title="No weight logs yet"
          description={`Tap Add to start tracking ${petName}'s weight over time.`}
          ctaLabel="Add first entry"
          onCta={() => setShowAdd(true)}
        />
      ) : (
        <>
          {/* Current */}
          <div className="glass rounded-4xl p-6 shadow-soft mb-6 text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
              Current Weight
            </p>
            <p className="text-4xl font-black text-foreground">{kgToDisplay(latest.kg, units)}</p>
            {prev && (
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-secondary">
                {(() => {
                  const Icon = trendIcon;
                  return <Icon size={12} className="text-foreground" />;
                })()}
                <span className="text-[10px] font-bold text-foreground">
                  {trendLabel} • {delta >= 0 ? "+" : ""}{delta.toFixed(1)} kg
                </span>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="glass rounded-4xl p-5 shadow-soft mb-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
              Trend
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={entries.map((e) => ({ date: e.date, kg: units === "kg" ? e.kg : e.kg * 2.2046 }))}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} width={28} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 16,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="kg" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Projection */}
          {isPremium ? (
            <div className="glass rounded-4xl p-5 shadow-soft mb-6 border border-primary/20">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                AI Weight Projection
              </p>
              <p className="text-sm font-bold text-foreground mb-1">
                Trend: {trendLabel} (~{Math.abs(delta).toFixed(2)} kg/month)
              </p>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Projected in 3 months: {kgToDisplay(latest.kg + delta * 3, units)}. Projected in 6 months: {kgToDisplay(latest.kg + delta * 6, units)}.
                {Math.abs(delta) < 0.1
                  ? ` ${petName}'s weight is healthy and stable. Keep current routine.`
                  : ` Monitor portion sizes and activity to keep ${petName} in a healthy range.`}
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <PremiumGate
                title="AI Weight Projection"
                description="Predict 3 & 6-month weight trajectory and get personalized recommendations."
                onUpgrade={onUpgrade}
                compact
              />
            </div>
          )}

          {/* Log */}
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">
            History
          </p>
          <div className="space-y-2 mb-6">
            {[...entries].reverse().map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass rounded-3xl p-4 flex items-center justify-between shadow-soft"
              >
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{e.date}</span>
                <span className="font-black text-foreground text-sm">{kgToDisplay(e.kg, units)}</span>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setShowAdd(true)}
        className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2"
      >
        <Plus size={18} /> Add Weight Entry
      </motion.button>

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
                <h3 className="text-xl font-black text-foreground">Log Weight</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <input
                type="number"
                step="0.1"
                placeholder={`Weight in ${units}`}
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full glass rounded-2xl px-5 py-4 text-center text-2xl font-black text-foreground outline-none mb-6 shadow-soft"
                autoFocus
              />
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAdd}
                className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow"
              >
                Save
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeightTrackerScreen;

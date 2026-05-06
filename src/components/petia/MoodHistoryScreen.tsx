import { motion } from "framer-motion";
import { ChevronLeft, Smile, Zap, Heart, Meh, Frown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { MOCK_MOODS, MOOD_SCORE, type MoodId } from "@/lib/mockData";
import EmptyState from "./EmptyState";

interface MoodHistoryScreenProps {
  petId: string;
  petName: string;
  onBack: () => void;
}

const MOOD_META: Record<MoodId, { icon: any; label: string; color: string }> = {
  energetic: { icon: Zap, label: "Energetic", color: "text-primary" },
  happy: { icon: Smile, label: "Happy", color: "text-primary" },
  normal: { icon: Heart, label: "Normal", color: "text-muted-foreground" },
  quiet: { icon: Meh, label: "Quiet", color: "text-warning-foreground" },
  lethargic: { icon: Frown, label: "Low", color: "text-destructive" },
};

const MoodHistoryScreen = ({ petId, petName, onBack }: MoodHistoryScreenProps) => {
  const moods = MOCK_MOODS[petId] ?? [];
  const chartData = [...moods].reverse().map((m) => ({
    date: m.date,
    score: MOOD_SCORE[m.mood],
    mood: m.mood,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 min-h-screen"
    >
      <div className="flex items-center gap-3 mb-8">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ChevronLeft size={22} className="text-foreground" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Mood History</h1>
          <p className="text-xs text-muted-foreground font-medium">7-day trend for {petName}</p>
        </div>
      </div>

      {moods.length === 0 ? (
        <EmptyState
          icon={Smile}
          title="No mood logs yet"
          description={`Log ${petName}'s mood from the Home screen to start seeing trends here.`}
        />
      ) : (
        <>
          <div className="glass rounded-4xl p-5 shadow-soft mb-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
              Last 7 days
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} hide />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 16,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">
            Log
          </p>
          <div className="space-y-2">
            {moods.map((m, i) => {
              const meta = MOOD_META[m.mood];
              return (
                <motion.div
                  key={m.date}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-3xl p-4 flex items-center gap-3 shadow-soft"
                >
                  <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center">
                    <meta.icon size={18} className={meta.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm">{meta.label}</p>
                    {m.note && <p className="text-[11px] text-muted-foreground font-medium truncate">{m.note}</p>}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    {m.date}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MoodHistoryScreen;

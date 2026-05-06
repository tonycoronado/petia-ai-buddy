import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, Smile, Camera, Stethoscope, DollarSign } from "lucide-react";
import { MOCK_INSIGHTS } from "@/lib/mockData";
import FloatingBubble, { type Pet } from "./FloatingBubble";
import EmptyState from "./EmptyState";
import PremiumGate from "./PremiumGate";
import { useAppSettings } from "@/lib/appSettings";

interface WeeklyInsightsScreenProps {
  pet: Pet;
  onBack: () => void;
  onUpgrade: () => void;
}

const WeeklyInsightsScreen = ({ pet, onBack, onUpgrade }: WeeklyInsightsScreenProps) => {
  const { isPremium } = useAppSettings();
  const insights = MOCK_INSIGHTS.filter((i) => i.petId === String(pet.id));
  const current = insights.find((i) => i.current);
  const archive = insights.filter((i) => !i.current);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-12 px-6 pb-32 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ChevronLeft size={22} className="text-foreground" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Weekly Insights</h1>
          <p className="text-xs text-muted-foreground font-medium">AI-generated for {pet.name}</p>
        </div>
      </div>

      {/* FloatingBubble header */}
      <div className="flex justify-center mb-6 relative">
        <div className="absolute -z-10 top-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
        <FloatingBubble pet={pet} onClick={() => {}} />
      </div>

      {!isPremium ? (
        <PremiumGate
          title="AI Weekly Insights"
          description={`Get a personalized weekly report on ${pet.name}'s mood, food, health, and spending.`}
          onUpgrade={onUpgrade}
        />
      ) : !current ? (
        <EmptyState icon={Sparkles} title="No insights yet" description="Log moods, scans, and health entries — your first weekly insight will appear next Monday." />
      ) : (
        <>
          <div className="glass rounded-4xl p-6 shadow-soft mb-6 border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                This week — {current.weekOf}
              </span>
            </div>
            {[
              { icon: Smile, label: "Mood", text: current.moodTrend },
              { icon: Camera, label: "Food", text: current.foodInsights },
              { icon: Stethoscope, label: "Health", text: current.healthSummary },
              { icon: DollarSign, label: "Spending", text: current.spending },
            ].map((s) => (
              <div key={s.label} className="flex gap-3 mb-4 last:mb-0">
                <div className="w-9 h-9 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                  <s.icon size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">{s.label}</p>
                  <p className="text-xs text-foreground font-medium leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-border pt-4 mt-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Top Recommendations</p>
              <ul className="space-y-2">
                {current.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-foreground font-medium leading-relaxed flex gap-2">
                    <span className="text-primary">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {archive.length > 0 && (
            <>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">Archive</p>
              <div className="space-y-2">
                {archive.map((a) => (
                  <div key={a.id} className="glass rounded-3xl p-4 shadow-soft">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{a.weekOf}</p>
                    <p className="text-xs text-foreground font-medium">{a.moodTrend}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default WeeklyInsightsScreen;

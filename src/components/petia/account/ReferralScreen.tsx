import { motion } from "framer-motion";
import { ChevronLeft, Copy, Share2, Gift, UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ReferralScreenProps {
  onBack: () => void;
}

const STEPS = [
  { icon: Share2, title: "Share your link", desc: "Send it to a fellow pet parent." },
  { icon: UserPlus, title: "They sign up", desc: "Using your link, on Petia." },
  { icon: Sparkles, title: "Both get 1 month free", desc: "Applied automatically." },
];

const ReferralScreen = ({ onBack }: ReferralScreenProps) => {
  const link = "petia.app/r/luna7k";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-12 px-6 pb-32 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ChevronLeft size={22} className="text-foreground" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Refer a friend</h1>
          <p className="text-xs text-muted-foreground font-medium">Share Petia, earn free months</p>
        </div>
      </div>

      <div className="glass rounded-4xl p-6 shadow-soft mb-6 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-3xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow">
          <Gift size={22} />
        </div>
        <h2 className="text-xl font-black text-foreground mb-1">Give 1 month, get 1 month</h2>
        <p className="text-xs text-muted-foreground font-medium">When your friend subscribes</p>
      </div>

      <div className="glass rounded-3xl p-4 shadow-soft flex items-center gap-3 mb-6">
        <div className="flex-1 px-3 py-2 rounded-2xl bg-muted text-sm font-bold text-foreground truncate">
          {link}
        </div>
        <button onClick={() => { navigator.clipboard?.writeText(link); toast.success("Link copied"); }} className="px-4 py-2 rounded-2xl gradient-cta text-primary-foreground text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
          <Copy size={12} /> Copy
        </button>
      </div>

      <motion.button whileTap={{ scale: 0.96 }} onClick={() => toast.success("Share sheet opened")} className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2 mb-8">
        <Share2 size={16} /> Share invite
      </motion.button>

      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">How it works</p>
      <div className="space-y-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={i} className="glass rounded-3xl p-4 flex items-center gap-3 shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground">
              <s.icon size={16} />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">{s.title}</p>
              <p className="text-[11px] text-muted-foreground font-medium">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[["Sent", "4"], ["Joined", "2"], ["Months", "2"]].map(([l, v]) => (
          <div key={l} className="glass rounded-3xl p-4 text-center shadow-soft">
            <div className="font-black text-foreground text-lg">{v}</div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{l}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReferralScreen;

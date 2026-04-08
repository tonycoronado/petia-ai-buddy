import { motion } from "framer-motion";
import { User, PawPrint, Settings, CreditCard, DollarSign, Bell, ChevronRight, LogOut } from "lucide-react";
import { toast } from "sonner";

interface ProfileScreenProps {
  onOpenPaywall: () => void;
  onOpenExpenses: () => void;
}

const ProfileScreen = ({ onOpenPaywall, onOpenExpenses }: ProfileScreenProps) => {
  const MENU_ITEMS = [
    { icon: PawPrint, label: "Manage Pets", subtitle: "2 pets", action: () => toast.success("Pet management coming soon!") },
    { icon: DollarSign, label: "Expense Tracker", subtitle: "April: $306.48", action: onOpenExpenses },
    { icon: Bell, label: "Smart Reminders", subtitle: "3 active", action: () => toast.success("Reminders coming soon!") },
    { icon: Settings, label: "App Settings", action: () => toast.success("Settings coming soon!") },
    { icon: CreditCard, label: "Subscription", subtitle: "Free Plan — Upgrade to PRO", action: onOpenPaywall },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 px-6 pb-32"
    >
      {/* Avatar & Name */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-full gradient-accent p-0.5 mb-4">
          <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
            <User size={40} className="text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Pet Parent
        </h1>
        <p className="text-sm text-muted-foreground font-medium">Caring for Luna & Milo</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Pets", val: "2" },
          { label: "Scans", val: "14" },
          { label: "Days Active", val: "47" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-3xl p-4 text-center shadow-soft">
            <div className="font-black text-foreground text-lg">{stat.val}</div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="space-y-3">
        {MENU_ITEMS.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={item.action}
            className="w-full glass rounded-3xl p-5 flex items-center gap-4 shadow-soft text-left"
          >
            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground">
              <item.icon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-sm">{item.label}</p>
              {item.subtitle && (
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              )}
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      {/* Log out */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => toast.success("Logged out successfully!")}
        className="w-full mt-6 py-4 rounded-3xl border border-border text-muted-foreground font-bold text-sm flex items-center justify-center gap-2"
      >
        <LogOut size={16} /> Sign Out
      </motion.button>
    </motion.div>
  );
};

export default ProfileScreen;

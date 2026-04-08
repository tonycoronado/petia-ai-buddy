import { motion } from "framer-motion";
import { User, PawPrint, Settings, CreditCard, ChevronRight } from "lucide-react";

interface ProfileScreenProps {
  onOpenPaywall: () => void;
}

const MENU_ITEMS = [
  { icon: User, label: "Account Details" },
  { icon: PawPrint, label: "Manage Pets" },
  { icon: Settings, label: "App Settings" },
  { icon: CreditCard, label: "Subscription", subtitle: "Free Plan — Upgrade to PRO", opensPaywall: true },
];

const ProfileScreen = ({ onOpenPaywall }: ProfileScreenProps) => (
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
        Alex Thompson
      </h1>
      <p className="text-sm text-muted-foreground font-medium">Pet Parent since 2023</p>
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
          onClick={item.opensPaywall ? onOpenPaywall : undefined}
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
  </motion.div>
);

export default ProfileScreen;

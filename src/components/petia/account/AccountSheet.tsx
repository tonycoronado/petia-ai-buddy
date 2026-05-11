import { motion } from "framer-motion";
import {
  X,
  CreditCard,
  Bell,
  Globe,
  Scale,
  Sparkles,
  Download,
  Gift,
  FileText,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Trash2,
  ChevronRight,
  Moon,
} from "lucide-react";
import { useAppSettings } from "@/lib/appSettings";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AccountSheetProps {
  onClose: () => void;
  onOpenPaywall: () => void;
  onOpenReferral: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

const AccountSheet = ({
  onClose,
  onOpenPaywall,
  onOpenReferral,
  onOpenTerms,
  onOpenPrivacy,
}: AccountSheetProps) => {
  const {
    units,
    setUnits,
    language,
    setLanguage,
    aiEnabled,
    setAiEnabled,
    isPremium,
    trialActive,
    trialDaysLeft,
    notifications,
    toggleNotification,
    theme,
    setTheme,
  } = useAppSettings();

  const Row = ({ icon: Icon, label, sub, onClick, right }: any) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 px-1 py-3 text-left">
      <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-foreground text-sm">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground font-medium truncate">{sub}</p>}
      </div>
      {right ?? <ChevronRight size={16} className="text-muted-foreground" />}
    </button>
  );

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[80]" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl max-h-[88vh] overflow-y-auto"
      >
        <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-foreground">Account</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Profile card */}
        <div className="glass rounded-4xl p-5 shadow-soft mb-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full gradient-accent p-0.5">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center font-black text-foreground">
              P
            </div>
          </div>
          <div className="flex-1">
            <p className="font-black text-foreground">Pet Parent</p>
            <p className="text-[11px] text-muted-foreground font-medium">parent@petia.app</p>
          </div>
        </div>

        {/* Subscription */}
        <button
          onClick={onOpenPaywall}
          className="w-full glass rounded-4xl p-5 shadow-soft mb-6 flex items-center gap-4 border border-primary/20 text-left"
        >
          <div className="w-12 h-12 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <p className="font-black text-foreground text-sm">
              {isPremium ? "Petia PRO" : "Free Plan"}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium">
              {trialActive
                ? `Trial active • ${trialDaysLeft} days left`
                : isPremium
                ? "Manage subscription"
                : "Upgrade to unlock all features"}
            </p>
          </div>
          {trialActive && (
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/15 text-primary">
              Trial
            </span>
          )}
        </button>

        {/* Notifications */}
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
          Notifications
        </p>
        <div className="glass rounded-3xl p-2 shadow-soft mb-5 divide-y divide-border">
          {([
            ["moodReminder", "Daily mood reminder"],
            ["reminders", "Care reminders"],
            ["weeklyInsights", "Weekly insights"],
            ["marketing", "Tips & news"],
          ] as const).map(([key, label]) => (
            <Row
              key={key}
              icon={Bell}
              label={label}
              right={<Switch checked={notifications[key]} onCheckedChange={() => toggleNotification(key)} />}
            />
          ))}
        </div>

        {/* Preferences */}
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">
          Preferences
        </p>
        <div className="glass rounded-3xl p-2 shadow-soft mb-5 divide-y divide-border">
          <Row
            icon={Globe}
            label="Language"
            sub={language === "EN" ? "English" : "Español"}
            onClick={() => setLanguage(language === "EN" ? "ES" : "EN")}
            right={<span className="text-[10px] font-black text-primary uppercase tracking-widest">{language}</span>}
          />
          <Row
            icon={Scale}
            label="Units"
            sub={units === "kg" ? "Kilograms" : "Pounds"}
            onClick={() => setUnits(units === "kg" ? "lbs" : "kg")}
            right={<span className="text-[10px] font-black text-primary uppercase tracking-widest">{units}</span>}
          />
          <Row
            icon={Sparkles}
            label="AI features"
            sub={aiEnabled ? "AI features enabled · View disclosure" : "AI features off · View disclosure"}
            onClick={() => toast.message("Petia uses Anthropic, Google and OpenAI for different AI features. Photos and data are never used to train models.")}
            right={<Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />}
          />
          <div className="flex items-center gap-4 px-1 py-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground">
              <Moon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm">Appearance</p>
              <p className="text-[11px] text-muted-foreground font-medium truncate">
                {theme === "system" ? "Match system" : theme === "dark" ? "Raisin Night" : "Light"}
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-full bg-muted">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition ${
                    theme === t
                      ? "bg-card text-foreground shadow-soft"
                      : "text-muted-foreground"
                  }`}
                >
                  {t === "light" ? "Light" : t === "dark" ? "Dark" : "Auto"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Other */}
        <div className="glass rounded-3xl p-2 shadow-soft mb-5 divide-y divide-border">
          <Row icon={Gift} label="Refer a friend" sub="Both get 1 month free" onClick={onOpenReferral} />
          <Row icon={Download} label="Export my data" onClick={() => toast.success("Export queued — we'll email you")} />
          <Row icon={FileText} label="Terms of Service" onClick={onOpenTerms} />
          <Row icon={ShieldCheck} label="Privacy Policy" onClick={onOpenPrivacy} />
          <Row icon={HelpCircle} label="Support" sub="support@petia.app" onClick={() => toast.success("Email opened")} />
          <Row icon={CreditCard} label="App version" sub="1.0.0 (build 2026.04)" right={<span />} />
        </div>

        <button
          onClick={() => toast.success("Signed out")}
          className="w-full py-3.5 rounded-3xl border border-border text-muted-foreground font-bold text-sm flex items-center justify-center gap-2 mb-3"
        >
          <LogOut size={16} /> Sign out
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full py-3.5 rounded-3xl text-destructive font-bold text-sm flex items-center justify-center gap-2">
              <Trash2 size={16} /> Delete account
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes all pet profiles, photos, and history. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => toast.success("Account deletion scheduled")}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </>
  );
};

export default AccountSheet;

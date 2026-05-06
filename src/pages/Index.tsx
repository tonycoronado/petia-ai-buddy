import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import HomeScreen from "@/components/petia/HomeScreen";
import FoodScannerScreen from "@/components/petia/FoodScannerScreen";
import HealthDiaryScreen from "@/components/petia/HealthDiaryScreen";
import ChatScreen from "@/components/petia/ChatScreen";
import PetHubScreen from "@/components/petia/pet/PetHubScreen";
import PetProfileSheet from "@/components/petia/PetProfileSheet";
import PaywallScreen from "@/components/petia/PaywallScreen";
import ExpenseTrackerScreen from "@/components/petia/ExpenseTrackerScreen";
import MoodHistoryScreen from "@/components/petia/MoodHistoryScreen";
import WeightTrackerScreen from "@/components/petia/WeightTrackerScreen";
import RemindersScreen from "@/components/petia/RemindersScreen";
import VetVisitsScreen from "@/components/petia/VetVisitsScreen";
import WeeklyInsightsScreen from "@/components/petia/WeeklyInsightsScreen";
import PDFExportScreen from "@/components/petia/PDFExportScreen";
import AccountSheet from "@/components/petia/account/AccountSheet";
import ReferralScreen from "@/components/petia/account/ReferralScreen";
import LegalScreen from "@/components/petia/account/LegalScreen";
import BottomNav from "@/components/petia/BottomNav";
import SplashScreen from "@/components/petia/SplashScreen";
import type { Pet } from "@/components/petia/FloatingBubble";
import { MOCK_PETS } from "@/lib/mockData";
import { AppSettingsProvider } from "@/lib/appSettings";
import { useScreenStack } from "@/lib/useScreenStack";
import { toast } from "sonner";

type SubScreenId = "mood" | "weight" | "reminders" | "vet" | "expenses" | "insights" | "pdf" | "referral" | "terms" | "privacy";

const TERMS = [
  "Welcome to Petia. By using this app, you agree to these Terms of Service.",
  "Petia provides informational pet-care tools. Nothing in the app is veterinary medical advice. Always consult a licensed veterinarian for diagnosis or treatment.",
  "You must be at least 13 years old to use Petia. You are responsible for the accuracy of pet information you provide.",
  "Subscriptions are auto-renewable and can be managed in your store account. Refunds follow Apple/Google store policies.",
  "We may update these Terms from time to time. Continued use means you accept the updated Terms.",
];
const PRIVACY = [
  "Your privacy matters. This Privacy Policy describes how Petia handles your data.",
  "We collect only what's needed to run the app: account email, pet profiles, photos you upload, and usage logs. Photos and pet data are stored encrypted and isolated to your account.",
  "AI features are powered by Anthropic. Your data is never used to train AI models. You can disable AI any time in Settings.",
  "We never sell your personal data. Push notification delivery uses Apple/Google services.",
  "You can export or delete all your data at any time from the Account screen.",
];

const Inner = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [splashExit, setSplashExit] = useState(false);
  const [tab, setTab] = useState("home");
  const { current: subScreen, push, pop, reset } = useScreenStack<SubScreenId>();
  const [activePet, setActivePet] = useState<Pet>(MOCK_PETS[0]);
  const [profileSheet, setProfileSheet] = useState<Pet | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSplashExit(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const openPaywall = () => setShowPaywall(true);

  const handleSelectPet = (pet: Pet) => {
    if (tab === "pet") {
      setActivePet(pet);
      toast.success(`${pet.name} is now active`);
    } else {
      setProfileSheet(pet);
    }
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <AnimatePresence>
        {showSplash && !splashExit && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>
      {showSplash && splashExit && <SplashExiter onDone={() => setShowSplash(false)} />}

      {!showSplash && (
        <>
          <AnimatePresence mode="wait">
            {!subScreen && tab === "home" && (
              <HomeScreen
                pets={MOCK_PETS}
                activePet={activePet}
                onSelectPet={handleSelectPet}
                onOpenScanner={() => setTab("scanner")}
                onOpenAccount={() => setShowAccount(true)}
                onOpenMoodHistory={() => push("mood" as SubScreenId)}
                onOpenReminders={() => push("reminders" as SubScreenId)}
                onOpenInsights={() => push("insights" as SubScreenId)}
              />
            )}
            {!subScreen && tab === "scanner" && (
              <FoodScannerScreen petName={activePet.name} onUpgrade={openPaywall} />
            )}
            {!subScreen && tab === "diary" && <HealthDiaryScreen petName={activePet.name} />}
            {!subScreen && tab === "chat" && <ChatScreen pet={activePet} onUpgrade={openPaywall} />}
            {!subScreen && tab === "pet" && (
              <PetHubScreen
                pets={MOCK_PETS}
                activePet={activePet}
                onSelectPet={(p) => { setActivePet(p); toast.success(`${p.name} is now active`); }}
                onAddPet={openPaywall}
                onOpenReminders={() => push("reminders" as SubScreenId)}
                onOpenWeight={() => push("weight" as SubScreenId)}
                onOpenVet={() => push("vet" as SubScreenId)}
                onOpenExpenses={() => push("expenses" as SubScreenId)}
                onOpenInsights={() => push("insights" as SubScreenId)}
                onOpenPDF={() => push("pdf" as SubScreenId)}
              />
            )}

            {subScreen === "mood" && <MoodHistoryScreen petId={String(activePet.id)} petName={activePet.name} onBack={() => pop()} />}
            {subScreen === "weight" && <WeightTrackerScreen petId={String(activePet.id)} petName={activePet.name} onBack={() => pop()} onUpgrade={openPaywall} />}
            {subScreen === "reminders" && <RemindersScreen petId={String(activePet.id)} petName={activePet.name} onBack={() => pop()} onUpgrade={openPaywall} />}
            {subScreen === "vet" && <VetVisitsScreen petId={String(activePet.id)} petName={activePet.name} onBack={() => pop()} />}
            {subScreen === "expenses" && <ExpenseTrackerScreen onBack={() => pop()} />}
            {subScreen === "insights" && <WeeklyInsightsScreen pet={activePet} onBack={() => pop()} onUpgrade={openPaywall} />}
            {subScreen === "pdf" && <PDFExportScreen petName={activePet.name} onBack={() => pop()} onUpgrade={openPaywall} />}
            {subScreen === "referral" && <ReferralScreen onBack={() => pop()} />}
            {subScreen === "terms" && <LegalScreen title="Terms of Service" body={TERMS} onBack={() => pop()} />}
            {subScreen === "privacy" && <LegalScreen title="Privacy Policy" body={PRIVACY} onBack={() => pop()} />}
          </AnimatePresence>

          <AnimatePresence>
            {showPaywall && <PaywallScreen onClose={() => setShowPaywall(false)} />}
          </AnimatePresence>
          <AnimatePresence>
            {profileSheet && <PetProfileSheet pet={profileSheet} onClose={() => setProfileSheet(null)} />}
          </AnimatePresence>
          <AnimatePresence>
            {showAccount && (
              <AccountSheet
                onClose={() => setShowAccount(false)}
                onOpenPaywall={() => { setShowAccount(false); openPaywall(); }}
                onOpenReferral={() => { setShowAccount(false); push("referral" as SubScreenId); }}
                onOpenTerms={() => { setShowAccount(false); push("terms" as SubScreenId); }}
                onOpenPrivacy={() => { setShowAccount(false); push("privacy" as SubScreenId); }}
              />
            )}
          </AnimatePresence>

          {!subScreen && <BottomNav activeTab={tab} setTab={(t) => { reset(); setTab(t); }} />}
        </>
      )}
    </div>
  );
};

const SplashExiter = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 600);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="fixed inset-0 z-[200] bg-background animate-fade-out pointer-events-none" />;
};

const Index = () => (
  <AppSettingsProvider>
    <Inner />
  </AppSettingsProvider>
);

export default Index;

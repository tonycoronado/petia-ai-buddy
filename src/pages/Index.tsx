import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import TodayScreen from "@/components/petia/TodayScreen";
import HealthScreen from "@/components/petia/HealthScreen";
import CareScreen from "@/components/petia/CareScreen";
import SmartCaptureScreen from "@/components/petia/SmartCaptureScreen";
import FoodScannerScreen from "@/components/petia/FoodScannerScreen";
import HealthDiaryScreen from "@/components/petia/HealthDiaryScreen";
import ChatScreen from "@/components/petia/ChatScreen";
import PetProfileSheet from "@/components/petia/PetProfileSheet";
import PaywallScreen from "@/components/petia/PaywallScreen";
import ImportVetRecordsScreen from "@/components/petia/ImportVetRecordsScreen";
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
import PetSwitcherSheet from "@/components/petia/PetSwitcherSheet";
import OnboardingWizard, { type PetData } from "@/components/petia/OnboardingWizard";
import OnboardingTrialOffer from "@/components/petia/onboarding/OnboardingTrialOffer";
import type { Pet } from "@/components/petia/FloatingBubble";
import { MOCK_PETS } from "@/lib/mockData";
import { AppSettingsProvider } from "@/lib/appSettings";
import { useScreenStack } from "@/lib/useScreenStack";
import { toast } from "sonner";

type SubScreenId =
  | "mood"
  | "weight"
  | "reminders"
  | "vet"
  | "import"
  | "records"
  | "insights"
  | "pdf"
  | "scanner"
  | "diary"
  | "chat"
  | "referral"
  | "terms"
  | "privacy";

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
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [showTrialOffer, setShowTrialOffer] = useState(false);
  const [trialOfferShown, setTrialOfferShown] = useState(false);
  const [onboardedName, setOnboardedName] = useState<string>("your pet");
  const [tab, setTab] = useState("today");
  const { current: subScreen, push, pop, reset } = useScreenStack<SubScreenId>();
  const [activePet, setActivePet] = useState<Pet>(MOCK_PETS[0]);

  const handleOnboardingComplete = (data: PetData) => {
    const name = data.name.trim() || "your pet";
    setOnboardedName(name);
    setActivePet((prev) => ({
      ...prev,
      name,
      img: data.photoUrl || prev.img,
      weight: data.weightValue ? `${data.weightValue.toFixed(1)}kg` : prev.weight,
    }));
    // Defer trial offer — don't show it before user feels Petia's value
    setHasOnboarded(true);
  };

  const finishOnboarding = () => {
    setShowTrialOffer(false);
    setTrialOfferShown(true);
  };

  const triggerDeferredTrialOffer = () => {
    if (trialOfferShown) return;
    setTrialOfferShown(true);
    setTimeout(() => setShowTrialOffer(true), 800);
  };
  const [profileSheet, setProfileSheet] = useState<Pet | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string | undefined>(undefined);
  const [showAccount, setShowAccount] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [followUpFor, setFollowUpFor] = useState<string | null>(null);

  const goToCapture = (followUpId?: string) => {
    setFollowUpFor(followUpId ?? null);
    reset();
    setTab("capture");
  };

  useEffect(() => {
    const t = setTimeout(() => setSplashExit(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const openPaywall = (reason?: string) => {
    setPaywallReason(reason);
    setShowPaywall(true);
  };

  const handleSwitchPet = (pet: Pet) => {
    if (String(pet.id) === String(activePet.id)) {
      setShowSwitcher(false);
      return;
    }
    setActivePet(pet);
    setShowSwitcher(false);
    toast.success(`${pet.name} is now active`);
  };

  const handleSetTab = (t: string) => {
    if (t === "account") {
      setShowAccount(true);
      return;
    }
    reset();
    setTab(t);
  };

  const tapPet = () => setShowSwitcher(true);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <AnimatePresence>
        {showSplash && !splashExit && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>
      {showSplash && splashExit && <SplashExiter onDone={() => setShowSplash(false)} />}

      <AnimatePresence>
        {!showSplash && !hasOnboarded && (
          <OnboardingWizard onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTrialOffer && (
          <OnboardingTrialOffer
            petName={onboardedName}
            onContinueFree={finishOnboarding}
            onStartTrial={finishOnboarding}
          />
        )}
      </AnimatePresence>

      {!showSplash && hasOnboarded && (
        <>
          <AnimatePresence mode="wait">
            {!subScreen && tab === "today" && (
              <TodayScreen
                activePet={activePet}
                onTapPet={tapPet}
                onOpenReminders={() => push("reminders")}
                onOpenInsights={() => push("insights")}
                onOpenDiary={() => push("diary")}
                onOpenWeight={() => push("weight")}
                onOpenMoodHistory={() => push("mood")}
                onOpenFollowUp={() => goToCapture("d-1")}
                onUpgrade={openPaywall}
              />
            )}
            {!subScreen && tab === "health" && (
              <HealthScreen
                activePet={activePet}
                onTapPet={tapPet}
                onOpenDiary={() => push("diary")}
                onOpenWeight={() => push("weight")}
                onOpenVet={() => push("vet")}
                onOpenRecords={() => push("records")}
                onOpenPDF={() => push("pdf")}
                onAddViaCapture={() => goToCapture()}
                onUpgrade={openPaywall}
              />
            )}
            {!subScreen && tab === "capture" && (
              <SmartCaptureScreen
                activePet={activePet}
                onTapPet={tapPet}
                onOpenFullScanner={() => push("scanner")}
                onOpenFullDiary={() => push("diary")}
                onOpenFullImport={() => push("records")}
                onUpgrade={openPaywall}
                followUpFor={followUpFor}
                onClearFollowUp={() => setFollowUpFor(null)}
                onFirstAiResult={triggerDeferredTrialOffer}
              />
            )}
            {!subScreen && tab === "care" && (
              <CareScreen
                activePet={activePet}
                onTapPet={tapPet}
                onOpenReminders={() => push("reminders")}
                onOpenInsights={() => push("insights")}
                onOpenChat={() => push("chat")}
                onOpenWeight={() => push("weight")}
                onUpgrade={openPaywall}
              />
            )}

            {subScreen === "scanner" && (
              <FoodScannerScreen petName={activePet.name} onUpgrade={openPaywall} onBack={() => pop()} />
            )}
            {subScreen === "diary" && <HealthDiaryScreen petName={activePet.name} onBack={() => pop()} />}
            {subScreen === "mood" && <MoodHistoryScreen petId={String(activePet.id)} petName={activePet.name} onBack={() => pop()} />}
            {subScreen === "weight" && <WeightTrackerScreen petId={String(activePet.id)} petName={activePet.name} onBack={() => pop()} />}
            {subScreen === "reminders" && <RemindersScreen petId={String(activePet.id)} petName={activePet.name} onBack={() => pop()} onUpgrade={openPaywall} />}
            {subScreen === "vet" && <VetVisitsScreen petId={String(activePet.id)} petName={activePet.name} onBack={() => pop()} />}
            {subScreen === "import" && <ImportVetRecordsScreen petName={activePet.name} mode="profile" onBack={() => pop()} onSkip={() => pop()} onComplete={() => pop()} />}
            {subScreen === "records" && <ImportVetRecordsScreen petName={activePet.name} mode="library" onBack={() => pop()} onSkip={() => pop()} onComplete={() => pop()} onAddViaCapture={() => { pop(); goToCapture(); }} />}
            {subScreen === "insights" && <WeeklyInsightsScreen pet={activePet} onBack={() => pop()} onUpgrade={openPaywall} />}
            {subScreen === "pdf" && <PDFExportScreen petName={activePet.name} onBack={() => pop()} onUpgrade={openPaywall} />}
            {subScreen === "chat" && <ChatScreen pet={activePet} onUpgrade={openPaywall} />}
            {subScreen === "referral" && <ReferralScreen onBack={() => pop()} />}
            {subScreen === "terms" && <LegalScreen title="Terms of Service" body={TERMS} onBack={() => pop()} />}
            {subScreen === "privacy" && <LegalScreen title="Privacy Policy" body={PRIVACY} onBack={() => pop()} />}
          </AnimatePresence>

          <AnimatePresence>
            {showPaywall && <PaywallScreen onClose={() => { setShowPaywall(false); setPaywallReason(undefined); }} reason={paywallReason} />}
          </AnimatePresence>
          <AnimatePresence>
            {profileSheet && <PetProfileSheet pet={profileSheet} onClose={() => setProfileSheet(null)} />}
          </AnimatePresence>
          <AnimatePresence>
            {showSwitcher && (
              <PetSwitcherSheet
                pets={MOCK_PETS}
                activePetId={String(activePet.id)}
                onSelect={handleSwitchPet}
                onLongPress={(p) => { setShowSwitcher(false); setProfileSheet(p); }}
                onAddPet={() => { setShowSwitcher(false); openPaywall(); }}
                onClose={() => setShowSwitcher(false)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showAccount && (
              <AccountSheet
                onClose={() => setShowAccount(false)}
                onOpenPaywall={() => { setShowAccount(false); openPaywall(); }}
                onOpenReferral={() => { setShowAccount(false); push("referral"); }}
                onOpenTerms={() => { setShowAccount(false); push("terms"); }}
                onOpenPrivacy={() => { setShowAccount(false); push("privacy"); }}
              />
            )}
          </AnimatePresence>

          {!subScreen && <BottomNav activeTab={tab} setTab={handleSetTab} />}
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

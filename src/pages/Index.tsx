import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import HomeScreen from "@/components/petia/HomeScreen";
import FoodScannerScreen from "@/components/petia/FoodScannerScreen";
import HealthDiaryScreen from "@/components/petia/HealthDiaryScreen";
import ChatScreen from "@/components/petia/ChatScreen";
import ProfileScreen from "@/components/petia/ProfileScreen";
import PetProfileSheet from "@/components/petia/PetProfileSheet";
import PaywallScreen from "@/components/petia/PaywallScreen";
import ExpenseTrackerScreen from "@/components/petia/ExpenseTrackerScreen";
import BottomNav from "@/components/petia/BottomNav";
import SplashScreen from "@/components/petia/SplashScreen";
import type { Pet } from "@/components/petia/FloatingBubble";
import { useEffect } from "react";

const MOCK_PETS: Pet[] = [
  {
    id: "1",
    name: "Luna",
    breed: "Golden Retriever",
    age: "3y",
    weight: "28kg",
    img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "2",
    name: "Milo",
    breed: "British Shorthair",
    age: "2y",
    weight: "5kg",
    img: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=200",
  },
];

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [splashExit, setSplashExit] = useState(false);
  const [screen, setScreen] = useState("home");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [activePet] = useState<Pet>(MOCK_PETS[0]);

  // Splash timer
  useEffect(() => {
    const timer = setTimeout(() => setSplashExit(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* Splash */}
      <AnimatePresence>
        {showSplash && !splashExit && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
      {showSplash && splashExit && <SplashExiter onDone={() => setShowSplash(false)} />}

      {/* Main screens */}
      {!showSplash && (
        <>
          <AnimatePresence mode="wait">
            {screen === "home" && (
              <HomeScreen
                pets={MOCK_PETS}
                activePet={activePet}
                onSelectPet={setSelectedPet}
                onOpenScanner={() => setScreen("scanner")}
              />
            )}
            {screen === "scanner" && (
              <FoodScannerScreen onBack={() => setScreen("home")} petName={activePet.name} />
            )}
            {screen === "diary" && <HealthDiaryScreen petName={activePet.name} />}
            {screen === "chat" && <ChatScreen />}
            {screen === "profile" && (
              <ProfileScreen
                onOpenPaywall={() => setShowPaywall(true)}
                onOpenExpenses={() => setScreen("expenses")}
              />
            )}
            {screen === "expenses" && (
              <ExpenseTrackerScreen onBack={() => setScreen("profile")} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPaywall && <PaywallScreen onClose={() => setShowPaywall(false)} />}
          </AnimatePresence>
          <AnimatePresence>
            {selectedPet && (
              <PetProfileSheet pet={selectedPet} onClose={() => setSelectedPet(null)} />
            )}
          </AnimatePresence>

          {screen !== "expenses" && <BottomNav activeTab={screen} setTab={setScreen} />}
        </>
      )}
    </div>
  );
};

const SplashExiter = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 700);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[200] bg-background animate-fade-out pointer-events-none" />
  );
};

export default Index;

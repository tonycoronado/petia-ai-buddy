import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import HomeScreen from "@/components/petia/HomeScreen";
import ScanScreen from "@/components/petia/ScanScreen";
import ResultScreen from "@/components/petia/ResultScreen";
import PetProfileSheet from "@/components/petia/PetProfileSheet";
import PaywallScreen from "@/components/petia/PaywallScreen";
import BottomNav from "@/components/petia/BottomNav";
import type { Pet } from "@/components/petia/FloatingBubble";

const PETS: Pet[] = [
  {
    id: 1,
    name: "Max",
    breed: "Golden Retriever",
    age: "2y",
    weight: "32kg",
    img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    name: "Luna",
    breed: "Siamese Cat",
    age: "4y",
    weight: "5kg",
    img: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=200",
  },
];

const Index = () => {
  const [screen, setScreen] = useState("home");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <HomeScreen
            pets={PETS}
            onSelectPet={setSelectedPet}
            onScan={() => setScreen("scan")}
          />
        )}
        {screen === "scan" && (
          <ScanScreen
            onClose={() => setScreen("home")}
            onCapture={() => setScreen("result")}
          />
        )}
        {screen === "result" && (
          <ResultScreen
            onSave={() => setScreen("home")}
            onChat={() => setScreen("paywall")}
            onDismiss={() => setScreen("home")}
          />
        )}
        {screen === "paywall" && (
          <PaywallScreen onClose={() => setScreen("home")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPet && (
          <PetProfileSheet pet={selectedPet} onClose={() => setSelectedPet(null)} />
        )}
      </AnimatePresence>

      <BottomNav activeTab={screen} setTab={setScreen} />
    </div>
  );
};

export default Index;

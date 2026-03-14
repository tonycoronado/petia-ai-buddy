import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SplashScreen from "@/components/petia/SplashScreen";
import HomeScreen from "@/components/petia/HomeScreen";
import ScanScreen from "@/components/petia/ScanScreen";
import ResultScreen, { type AnalysisResult } from "@/components/petia/ResultScreen";
import HistoryScreen from "@/components/petia/HistoryScreen";
import ChatScreen from "@/components/petia/ChatScreen";
import ProfileScreen from "@/components/petia/ProfileScreen";
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
  const [showSplash, setShowSplash] = useState(true);
  const [splashExit, setSplashExit] = useState(false);
  const [screen, setScreen] = useState("home");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSplashExit(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-pet", {
        body: { imageBase64: base64 },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data as AnalysisResult);
      setScreen("result");
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast.error(err.message || "Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

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
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <HomeScreen
            pets={PETS}
            onSelectPet={setSelectedPet}
            onScan={() => setScreen("scan")}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        )}
        {screen === "scan" && (
          <ScanScreen
            onClose={() => setScreen("home")}
            onCapture={() => setScreen("result")}
          />
        )}
        {screen === "result" && analysisResult && (
          <ResultScreen
            result={analysisResult}
            onSave={() => {
              toast.success("Saved to Max's profile!");
              setScreen("home");
            }}
            onChat={() => setShowPaywall(true)}
            onDismiss={() => setScreen("home")}
          />
        )}
        {screen === "history" && <HistoryScreen />}
        {screen === "chat" && <ChatScreen />}
        {screen === "profile" && (
          <ProfileScreen onOpenPaywall={() => setShowPaywall(true)} />
        )}
      </AnimatePresence>

      {/* Paywall overlay */}
      <AnimatePresence>
        {showPaywall && (
          <PaywallScreen onClose={() => setShowPaywall(false)} />
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

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

      if (error) {
        let backendMessage: string | null = null;
        const context = (error as any)?.context;

        if (context && typeof context.json === "function") {
          try {
            const payload = await context.json();
            if (typeof payload?.message === "string" && payload.message.trim().length > 0) {
              backendMessage = payload.message;
            }
          } catch {
            // ignore parsing errors and use fallback message
          }
        }

        throw new Error(
          backendMessage ||
            (error instanceof Error && error.message.trim().length > 0
              ? error.message
              : "Error analyzing image. Please try again.")
        );
      }

      if (data?.error === true) {
        throw new Error(
          typeof data?.message === "string" && data.message.trim().length > 0
            ? data.message
            : "OpenAI API Error"
        );
      }

      if (typeof data?.error === "string") {
        throw new Error(data.error);
      }

      const safeResult: AnalysisResult = {
        status:
          data?.status === "Green" || data?.status === "Yellow" || data?.status === "Red"
            ? data.status
            : "Yellow",
        title:
          typeof data?.title === "string" && data.title.trim().length > 0
            ? data.title
            : "Analysis Pending",
        description:
          typeof data?.description === "string" && data.description.trim().length > 0
            ? data.description
            : "Could not process the image clearly. Please try again with better lighting.",
      };

      setAnalysisResult(safeResult);
      setScreen("result");
      setIsAnalyzing(false);
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      toast.error(
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : "Error analyzing image. Please try again."
      );
      return;
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

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
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
import OnboardingWizard, { type PetData } from "@/components/petia/OnboardingWizard";
import type { Pet } from "@/components/petia/FloatingBubble";

const SPECIES_IMAGES: Record<string, string> = {
  dog: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200",
  cat: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=200",
};

const WEIGHT_LABELS: Record<string, string> = {
  small: "<10kg",
  medium: "10-25kg",
  large: ">25kg",
};

const AGE_LABELS: Record<string, string> = {
  puppy: "<1y",
  adult: "1-7y",
  senior: "7y+",
};

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [splashExit, setSplashExit] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pendingPetData, setPendingPetData] = useState<PetData | null>(null);

  const [screen, setScreen] = useState("home");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch pets when user is logged in
  useEffect(() => {
    if (!user) {
      setPets([]);
      return;
    }
    const fetchPets = async () => {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Failed to fetch pets:", error);
        return;
      }
      if (data && data.length > 0) {
        setPets(
          data.map((p: any) => ({
            id: p.id,
            name: p.name,
            breed: p.breed || p.species,
            age: AGE_LABELS[p.age_range] || p.age_range,
            weight: WEIGHT_LABELS[p.weight_range] || p.weight_range,
            img: p.img || SPECIES_IMAGES[p.species] || SPECIES_IMAGES.dog,
          }))
        );
      } else {
        // User has no pets, show onboarding
        setShowOnboarding(true);
      }
    };
    fetchPets();
  }, [user]);

  // After auth ready + splash done, decide what to show
  useEffect(() => {
    if (!authReady || showSplash) return;
    if (!user) {
      setShowOnboarding(true);
    }
  }, [authReady, showSplash, user]);

  // Splash timer
  useEffect(() => {
    const timer = setTimeout(() => setSplashExit(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Save pending pet after auth
  useEffect(() => {
    if (user && pendingPetData) {
      savePet(pendingPetData);
      setPendingPetData(null);
    }
  }, [user, pendingPetData]);

  const savePet = async (data: PetData) => {
    const img = data.photoUrl || SPECIES_IMAGES[data.species] || SPECIES_IMAGES.dog;
    const { data: inserted, error } = await supabase
      .from("pets")
      .insert({
        user_id: user!.id,
        name: data.name,
        species: data.species,
        breed: data.breed || null,
        age_range: data.ageRange,
        weight_range: data.weightRange,
        img,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save pet:", error);
      toast.error("Error saving pet profile");
      return;
    }

    setPets((prev) => [
      ...prev,
      {
        id: inserted.id,
        name: inserted.name,
        breed: inserted.breed || inserted.species,
        age: AGE_LABELS[inserted.age_range] || inserted.age_range,
        weight: WEIGHT_LABELS[inserted.weight_range] || inserted.weight_range,
        img: inserted.img || img,
      },
    ]);
    setShowOnboarding(false);
    toast.success(`¡Perfil de ${data.name} creado!`);
  };

  const handleOnboardingComplete = (data: PetData) => {
    setPendingPetData(data);
    setShowOnboarding(false);
    // Auth state change listener + pendingPetData effect will handle saving
  };

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
          } catch {}
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

      const activePetName = pets.length > 0 ? pets[0].name : "Pet";

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

      supabase
        .from("scan_history")
        .insert({
          pet_name: activePetName,
          scan_type: "Health Check",
          status: safeResult.status,
          title: safeResult.title,
          description: safeResult.description,
        })
        .then(({ error: insertErr }) => {
          if (insertErr) console.error("Failed to save scan:", insertErr);
        });
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
      toast.error(
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : "Error analyzing image. Please try again."
      );
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

      {/* Onboarding */}
      <AnimatePresence>
        {!showSplash && showOnboarding && (
          <OnboardingWizard onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      {/* Main screens (only when logged in and not onboarding) */}
      {!showSplash && !showOnboarding && (
        <>
          <AnimatePresence mode="wait">
            {screen === "home" && (
              <HomeScreen
                pets={pets}
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
                  toast.success(`Saved to ${pets[0]?.name ?? "pet"}'s profile!`);
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

          <AnimatePresence>
            {showPaywall && <PaywallScreen onClose={() => setShowPaywall(false)} />}
          </AnimatePresence>
          <AnimatePresence>
            {selectedPet && (
              <PetProfileSheet pet={selectedPet} onClose={() => setSelectedPet(null)} />
            )}
          </AnimatePresence>

          <BottomNav activeTab={screen} setTab={setScreen} />
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

import { createContext, useContext, useState, ReactNode } from "react";

interface Notifications {
  moodReminder: boolean;
  reminders: boolean;
  weeklyInsights: boolean;
  marketing: boolean;
}

interface AppSettings {
  units: "kg" | "lbs";
  language: "EN" | "ES";
  aiEnabled: boolean;
  isPremium: boolean;
  trialActive: boolean;
  trialDaysLeft: number;
  notifications: Notifications;
  setUnits: (u: "kg" | "lbs") => void;
  setLanguage: (l: "EN" | "ES") => void;
  setAiEnabled: (v: boolean) => void;
  setIsPremium: (v: boolean) => void;
  startTrial: () => void;
  toggleNotification: (key: keyof Notifications) => void;
}

const Ctx = createContext<AppSettings | null>(null);

export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [units, setUnits] = useState<"kg" | "lbs">("kg");
  const [language, setLanguage] = useState<"EN" | "ES">("EN");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [trialActive, setTrialActive] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(7);
  const [notifications, setNotifications] = useState<Notifications>({
    moodReminder: true,
    reminders: true,
    weeklyInsights: true,
    marketing: false,
  });

  const startTrial = () => {
    setTrialActive(true);
    setIsPremium(true);
    setTrialDaysLeft(7);
  };

  const toggleNotification = (key: keyof Notifications) =>
    setNotifications((n) => ({ ...n, [key]: !n[key] }));

  return (
    <Ctx.Provider
      value={{
        units,
        language,
        aiEnabled,
        isPremium,
        trialActive,
        trialDaysLeft,
        notifications,
        setUnits,
        setLanguage,
        setAiEnabled,
        setIsPremium,
        startTrial,
        toggleNotification,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAppSettings = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("AppSettings missing provider");
  return v;
};

export const kgToDisplay = (kg: number, units: "kg" | "lbs") =>
  units === "kg" ? `${kg.toFixed(1)} kg` : `${(kg * 2.2046).toFixed(1)} lbs`;

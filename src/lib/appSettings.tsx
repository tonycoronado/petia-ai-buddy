import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Notifications {
  moodReminder: boolean;
  reminders: boolean;
  weeklyInsights: boolean;
  marketing: boolean;
}

type Theme = "light" | "dark" | "system";

interface AppSettings {
  units: "kg" | "lbs";
  language: "EN" | "ES";
  aiEnabled: boolean;
  isPremium: boolean;
  trialActive: boolean;
  trialDaysLeft: number;
  notifications: Notifications;
  theme: Theme;
  setUnits: (u: "kg" | "lbs") => void;
  setLanguage: (l: "EN" | "ES") => void;
  setAiEnabled: (v: boolean) => void;
  setIsPremium: (v: boolean) => void;
  startTrial: () => void;
  toggleNotification: (key: keyof Notifications) => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<AppSettings | null>(null);

const THEME_KEY = "petia-theme";

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);
};

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
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(THEME_KEY) as Theme) || "light";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

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
        theme,
        setUnits,
        setLanguage,
        setAiEnabled,
        setIsPremium,
        startTrial,
        toggleNotification,
        setTheme,
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

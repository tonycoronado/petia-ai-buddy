import { Home, History, MessageCircle, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setTab: (tab: string) => void;
}

const tabs = [
  { id: "home", icon: Home },
  { id: "history", icon: History },
  { id: "chat", icon: MessageCircle },
  { id: "profile", icon: User },
];

const BottomNav = ({ activeTab, setTab }: BottomNavProps) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 glass rounded-4xl shadow-soft flex items-center justify-around px-6 z-50">
    {tabs.map(({ id, icon: Icon }) => (
      <button
        key={id}
        onClick={() => setTab(id)}
        className={`p-3 rounded-2xl transition-all duration-200 ${
          activeTab === id
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon size={24} strokeWidth={2.5} />
      </button>
    ))}
  </div>
);

export default BottomNav;

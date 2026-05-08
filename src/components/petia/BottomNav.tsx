import { Home, PawPrint, Plus, MessageCircle, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setTab: (tab: string) => void;
  onCapture: () => void;
}

const tabs = [
  { id: "home", icon: Home },
  { id: "care", icon: PawPrint },
  { id: "chat", icon: MessageCircle },
  { id: "account", icon: User },
];

const BottomNav = ({ activeTab, setTab, onCapture }: BottomNavProps) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md h-20 glass rounded-4xl shadow-soft flex items-center justify-around px-3 z-50">
    {tabs.slice(0, 2).map(({ id, icon: Icon }) => (
      <button
        key={id}
        onClick={() => setTab(id)}
        className={`p-3 rounded-2xl transition-all duration-200 ${
          activeTab === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon size={22} strokeWidth={2.5} />
      </button>
    ))}

    <button
      onClick={onCapture}
      aria-label="Quick log"
      className="w-14 h-14 rounded-full gradient-cta text-primary-foreground shadow-glow flex items-center justify-center -mt-6 active:scale-95 transition-transform"
    >
      <Plus size={26} strokeWidth={3} />
    </button>

    {tabs.slice(2).map(({ id, icon: Icon }) => (
      <button
        key={id}
        onClick={() => setTab(id)}
        className={`p-3 rounded-2xl transition-all duration-200 ${
          activeTab === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon size={22} strokeWidth={2.5} />
      </button>
    ))}
  </div>
);

export default BottomNav;

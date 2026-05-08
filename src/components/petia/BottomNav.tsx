import { Home, HeartPulse, Camera, PawPrint, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setTab: (tab: string) => void;
}

const LEFT = [
  { id: "today", icon: Home, label: "Today" },
  { id: "health", icon: HeartPulse, label: "Health" },
];
const RIGHT = [
  { id: "care", icon: PawPrint, label: "Care" },
  { id: "account", icon: User, label: "Account" },
];

const NavBtn = ({
  id,
  Icon,
  label,
  active,
  onClick,
}: {
  id: string;
  Icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    key={id}
    onClick={onClick}
    aria-label={label}
    className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all ${
      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    <Icon size={20} strokeWidth={2.5} />
    <span
      className={`text-[9px] font-black uppercase tracking-wider ${
        active ? "opacity-100" : "opacity-70"
      }`}
    >
      {label}
    </span>
  </button>
);

const BottomNav = ({ activeTab, setTab }: BottomNavProps) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md h-20 glass rounded-4xl shadow-soft flex items-center justify-around px-3 z-50">
    {LEFT.map(({ id, icon, label }) => (
      <NavBtn
        key={id}
        id={id}
        Icon={icon}
        label={label}
        active={activeTab === id}
        onClick={() => setTab(id)}
      />
    ))}

    <button
      onClick={() => setTab("capture")}
      aria-label="Smart Capture"
      className={`w-16 h-16 rounded-full gradient-cta text-primary-foreground shadow-glow flex flex-col items-center justify-center -mt-8 active:scale-95 transition-transform ${
        activeTab === "capture" ? "ring-4 ring-primary/30" : ""
      }`}
    >
      <Camera size={24} strokeWidth={2.5} />
      <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">
        Capture
      </span>
    </button>

    {RIGHT.map(({ id, icon, label }) => (
      <NavBtn
        key={id}
        id={id}
        Icon={icon}
        label={label}
        active={activeTab === id}
        onClick={() => setTab(id)}
      />
    ))}
  </div>
);

export default BottomNav;

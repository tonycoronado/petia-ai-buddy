import { ChevronDown } from "lucide-react";
import type { Pet } from "./FloatingBubble";

interface PetHeaderProps {
  activePet: Pet;
  onTapPet: () => void;
  onLongPressPet?: () => void;
  right?: React.ReactNode;
  title?: string;
  subtitle?: string;
  status?: string;
  size?: "sm" | "md" | "lg";
}

const PetHeader = ({
  activePet,
  onTapPet,
  right,
  title,
  subtitle,
  status,
  size = "md",
}: PetHeaderProps) => {
  const isLg = size === "lg";
  const avatar = isLg ? "w-16 h-16" : "w-12 h-12";
  const nameSize = isLg ? "text-lg" : "text-base";
  return (
    <header className="flex items-center justify-between mb-5">
      <button
        onClick={onTapPet}
        className="flex items-center gap-3 -ml-1 p-1 pr-3 rounded-full hover:bg-muted/50 active:scale-[0.98] transition min-h-[44px]"
      >
        <div className={`${avatar} rounded-full gradient-accent p-0.5 shadow-soft shrink-0`}>
          <img
            src={activePet.img}
            alt={activePet.name}
            className="w-full h-full rounded-full object-cover border-2 border-card"
          />
        </div>
        <div className="text-left">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">
            {subtitle ?? "Active pet"}
          </p>
          <p className={`font-black text-foreground ${nameSize} flex items-center gap-1 leading-tight mt-0.5`}>
            {title ?? activePet.name}
            <ChevronDown size={14} className="text-muted-foreground" />
          </p>
          {status && (
            <p className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5 truncate max-w-[200px]">
              {status}
            </p>
          )}
        </div>
      </button>
      {right}
    </header>
  );
};

export default PetHeader;

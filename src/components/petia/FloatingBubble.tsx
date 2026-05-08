import { motion } from "framer-motion";
import { useRef } from "react";

interface Pet {
  id: number | string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  img: string;
}

interface FloatingBubbleProps {
  pet: Pet;
  onClick: (pet: Pet) => void;
  onLongPress?: (pet: Pet) => void;
  delay?: number;
  size?: "sm" | "md" | "lg";
  active?: boolean;
}

const SIZES = {
  sm: "w-14 h-14",
  md: "w-20 h-20",
  lg: "w-20 h-20",
};

const FloatingBubble = ({
  pet,
  onClick,
  onLongPress,
  delay = 0,
  size = "md",
  active = false,
}: FloatingBubbleProps) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longFired = useRef(false);

  const start = () => {
    longFired.current = false;
    if (!onLongPress) return;
    timer.current = setTimeout(() => {
      longFired.current = true;
      onLongPress(pet);
    }, 450);
  };
  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
  };
  const handleClick = () => {
    if (longFired.current) return;
    onClick(pet);
  };

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      onClick={handleClick}
      onPointerDown={start}
      onPointerUp={clear}
      onPointerLeave={clear}
      onPointerCancel={clear}
      className="relative group cursor-pointer select-none"
    >
      <div
        className={`${SIZES[size]} rounded-full p-1 gradient-accent ${
          active ? "shadow-glow ring-2 ring-primary" : "shadow-glow"
        }`}
      >
        <img
          src={pet.img}
          alt={pet.name}
          draggable={false}
          className="w-full h-full rounded-full object-cover border-2 border-card"
        />
      </div>
      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card px-3 py-0.5 rounded-full text-[10px] font-bold shadow-sm border border-border uppercase tracking-wider text-foreground whitespace-nowrap">
        {pet.name}
      </span>
    </motion.div>
  );
};

export default FloatingBubble;
export type { Pet };

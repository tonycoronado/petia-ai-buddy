import { motion } from "framer-motion";

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: string;
  weight: string;
  img: string;
}

interface FloatingBubbleProps {
  pet: Pet;
  onClick: (pet: Pet) => void;
  delay?: number;
}

const FloatingBubble = ({ pet, onClick, delay = 0 }: FloatingBubbleProps) => (
  <motion.div
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    onClick={() => onClick(pet)}
    className="relative group cursor-pointer"
  >
    <div className="w-20 h-20 rounded-full p-1 gradient-accent shadow-glow">
      <img
        src={pet.img}
        alt={pet.name}
        className="w-full h-full rounded-full object-cover border-2 border-card"
      />
    </div>
    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card px-3 py-0.5 rounded-full text-[10px] font-bold shadow-sm border border-border uppercase tracking-wider text-foreground">
      {pet.name}
    </span>
  </motion.div>
);

export default FloatingBubble;
export type { Pet };

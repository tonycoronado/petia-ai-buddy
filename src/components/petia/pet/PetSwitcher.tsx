import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import FloatingBubble, { type Pet } from "../FloatingBubble";

interface PetSwitcherProps {
  pets: Pet[];
  activePetId: string;
  onSelect: (pet: Pet) => void;
  onAdd: () => void;
}

const PetSwitcher = ({ pets, activePetId, onSelect, onAdd }: PetSwitcherProps) => (
  <div className="flex items-end gap-6 overflow-x-auto no-scrollbar pb-6 pt-2 px-1">
    {pets.map((pet, i) => (
      <div
        key={pet.id}
        className={`relative transition-all ${
          activePetId === pet.id ? "scale-100" : "scale-90 opacity-70"
        }`}
      >
        <FloatingBubble pet={pet} onClick={onSelect} delay={i * 0.4} />
        {activePetId === pet.id && (
          <motion.span
            layoutId="active-pet-dot"
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-cta border-2 border-card shadow-glow"
          />
        )}
      </div>
    ))}
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onAdd}
      className="w-20 h-20 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors shrink-0"
    >
      <Plus size={20} />
      <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Add</span>
    </motion.button>
  </div>
);

export default PetSwitcher;

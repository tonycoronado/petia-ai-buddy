import { motion } from "framer-motion";
import { X, Plus, Check } from "lucide-react";
import FloatingBubble, { type Pet } from "../FloatingBubble";

interface PetSwitcherSheetProps {
  pets: Pet[];
  activePetId: string;
  onSelect: (pet: Pet) => void;
  onLongPress?: (pet: Pet) => void;
  onAddPet: () => void;
  onClose: () => void;
}

const PetSwitcherSheet = ({
  pets,
  activePetId,
  onSelect,
  onLongPress,
  onAddPet,
  onClose,
}: PetSwitcherSheetProps) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[80]"
    />
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 220 }}
      className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl"
    >
      <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-black text-foreground">Switch pet</h3>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted">
          <X size={18} className="text-muted-foreground" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground font-medium mb-6">
        Tap to switch. Hold for full profile.
      </p>

      <div className="flex items-end justify-around gap-4 pb-6 pt-2">
        {pets.map((pet, i) => (
          <div key={pet.id} className="flex flex-col items-center">
            <div className={String(pet.id) === activePetId ? "" : "opacity-60"}>
              <FloatingBubble
                pet={pet}
                delay={i * 0.4}
                active={String(pet.id) === activePetId}
                onClick={onSelect}
                onLongPress={onLongPress}
              />
            </div>
            {String(pet.id) === activePetId && (
              <span className="mt-3 text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                <Check size={10} /> Active
              </span>
            )}
          </div>
        ))}
        <button
          onClick={onAddPet}
          className="w-16 h-16 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground"
        >
          <Plus size={18} />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">
            Add
          </span>
        </button>
      </div>
    </motion.div>
  </>
);

export default PetSwitcherSheet;

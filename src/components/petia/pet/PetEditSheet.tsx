import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Pet } from "../FloatingBubble";
import { PET_DETAILS } from "@/lib/mockData";

interface PetEditSheetProps {
  pet: Pet;
  onClose: () => void;
}

const PetEditSheet = ({ pet, onClose }: PetEditSheetProps) => {
  const details = PET_DETAILS[String(pet.id)];
  const [name, setName] = useState(pet.name);
  const [breed, setBreed] = useState(pet.breed);
  const [conditions, setConditions] = useState(details?.conditions.join(", ") ?? "");
  const [allergies, setAllergies] = useState(details?.allergies.join(", ") ?? "");

  return (
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
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl max-h-[88vh] overflow-y-auto"
      >
        <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-foreground">Edit {pet.name}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full p-1 gradient-accent shadow-glow">
            <img src={pet.img} alt={pet.name} className="w-full h-full rounded-full object-cover border-2 border-card" />
          </div>
          <button className="text-xs font-bold text-primary underline">Change photo</button>
        </div>

        {[
          { label: "Name", val: name, set: setName },
          { label: "Breed", val: breed, set: setBreed },
          { label: "Conditions (comma-separated)", val: conditions, set: setConditions },
          { label: "Allergies (comma-separated)", val: allergies, set: setAllergies },
        ].map((f) => (
          <div key={f.label} className="mb-4">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">
              {f.label}
            </label>
            <input
              value={f.val}
              onChange={(e) => f.set(e.target.value)}
              className="w-full glass rounded-2xl px-4 py-3 text-sm font-medium text-foreground outline-none shadow-soft"
            />
          </div>
        ))}

        {details && (
          <div className="glass rounded-3xl p-4 shadow-soft mb-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
              Vet on file
            </p>
            <p className="text-sm font-bold text-foreground">{details.vetName}</p>
            <p className="text-xs text-muted-foreground font-medium">{details.vetPhone}</p>
            <p className="text-xs text-muted-foreground font-medium">{details.vetAddress}</p>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            toast.success(`${name}'s profile saved`);
            onClose();
          }}
          className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2"
        >
          <Save size={16} /> Save changes
        </motion.button>
      </motion.div>
    </>
  );
};

export default PetEditSheet;

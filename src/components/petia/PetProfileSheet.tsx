import { motion } from "framer-motion";
import { Activity, Droplets, PawPrint, ShieldCheck, TrendingUp, Heart } from "lucide-react";
import type { Pet } from "./FloatingBubble";

interface PetProfileSheetProps {
  pet: Pet;
  onClose: () => void;
}

const MOCK_TIMELINE = [
  { id: 1, date: "Apr 6", type: "Mood Check", result: "Happy", icon: Heart },
  { id: 2, date: "Apr 5", type: "Food Scan", result: "Good Match", icon: ShieldCheck },
  { id: 3, date: "Apr 2", type: "Health Check", result: "Monitoring", icon: Activity },
  { id: 4, date: "Mar 28", type: "Weight Log", result: "On Track", icon: TrendingUp },
];

const PetProfileSheet = ({ pet, onClose }: PetProfileSheetProps) => (
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
      className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl"
    >
      <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-8" />

      <div className="flex items-center gap-6 mb-10">
        <img
          src={pet.img}
          className="w-24 h-24 rounded-4xl object-cover shadow-lg"
          alt={pet.name}
        />
        <div>
          <h3 className="text-3xl font-black text-foreground">{pet.name}</h3>
          <p className="text-muted-foreground font-bold">{pet.breed}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Age", val: pet.age, icon: Activity },
          { label: "Weight", val: pet.weight, icon: Droplets },
          { label: "Breed", val: pet.breed.split(" ")[0], icon: PawPrint },
        ].map((stat) => (
          <div key={stat.label} className="bg-muted p-4 rounded-4xl text-center">
            <stat.icon size={16} className="mx-auto mb-2 text-muted-foreground" />
            <div className="font-black text-sm text-foreground">{stat.val}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <h4 className="font-black uppercase tracking-widest text-xs text-muted-foreground mb-4 px-2">
        Recent Activity
      </h4>
      <div className="space-y-2">
        {MOCK_TIMELINE.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-5 bg-muted rounded-4xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-card flex items-center justify-center text-primary shadow-sm">
                <item.icon size={20} />
              </div>
              <div>
                <div className="font-bold text-sm text-foreground">{item.type}</div>
                <div className="text-xs text-muted-foreground font-medium">{item.date}</div>
              </div>
            </div>
            <span className="text-xs font-black text-primary uppercase tracking-widest">
              {item.result}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  </>
);

export default PetProfileSheet;

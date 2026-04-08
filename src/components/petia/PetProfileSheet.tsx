import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Droplets, PawPrint, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Pet } from "./FloatingBubble";

interface PetProfileSheetProps {
  pet: Pet;
  onClose: () => void;
}

const PetProfileSheet = ({ pet, onClose }: PetProfileSheetProps) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase
        .from("scan_history")
        .select("*")
        .eq("pet_name", pet.name)
        .order("created_at", { ascending: false })
        .limit(5);
      setHistory(data || []);
      setLoading(false);
    };
    fetchHistory();
  }, [pet.name]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

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
            { label: "Breed", val: pet.breed, icon: PawPrint },
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
          Recent History
        </h4>
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-6">
              No scans yet. Start by scanning {pet.name}!
            </p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-5 bg-muted rounded-4xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-card flex items-center justify-center text-primary shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground font-medium">{formatDate(item.created_at)}</div>
                  </div>
                </div>
                <span className={`text-xs font-black uppercase tracking-widest ${
                  item.status === "Green" ? "text-emerald-600" : item.status === "Red" ? "text-red-600" : "text-amber-600"
                }`}>
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
};

export default PetProfileSheet;

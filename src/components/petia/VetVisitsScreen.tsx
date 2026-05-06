import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, X, Stethoscope, Calendar, Building2 } from "lucide-react";
import { useState } from "react";
import { MOCK_VET_VISITS, PET_DETAILS, type VetVisit } from "@/lib/mockData";
import { toast } from "sonner";
import EmptyState from "./EmptyState";

interface VetVisitsScreenProps {
  petId: string;
  petName: string;
  onBack: () => void;
}

const VetVisitsScreen = ({ petId, petName, onBack }: VetVisitsScreenProps) => {
  const details = PET_DETAILS[petId];
  const [visits, setVisits] = useState<VetVisit[]>(MOCK_VET_VISITS.filter((v) => v.petId === petId));
  const [selected, setSelected] = useState<VetVisit | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [reason, setReason] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  const handleAdd = () => {
    if (!reason.trim()) return;
    setVisits([
      { id: `v${Date.now()}`, petId, date: "Today", reason, clinic: details?.vetAddress.split(",")[0] ?? "", vet: details?.vetName ?? "", diagnosis },
      ...visits,
    ]);
    setReason("");
    setDiagnosis("");
    setShowAdd(false);
    toast.success("Vet visit logged");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 min-h-screen"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-muted">
            <ChevronLeft size={22} className="text-foreground" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Vet Visits</h1>
            <p className="text-xs text-muted-foreground font-medium">{petName}'s clinical history</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowAdd(true)} className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow">
          <Plus size={18} />
        </motion.button>
      </div>

      {visits.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No vet visits yet"
          description="Log every visit to keep a complete clinical record you can share with your vet."
          ctaLabel="Add first visit"
          onCta={() => setShowAdd(true)}
        />
      ) : (
        <div className="space-y-3">
          {visits.map((v, i) => (
            <motion.button
              key={v.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(v)}
              className="w-full glass rounded-3xl p-4 flex items-center gap-4 shadow-soft text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                <Stethoscope size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{v.reason}</p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  {v.date} • {v.clinic}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[80]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl">
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-foreground">{selected.reason}</h3>
                <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-muted"><X size={18} className="text-muted-foreground" /></button>
              </div>
              <div className="flex gap-3 text-[11px] text-muted-foreground font-medium mb-5">
                <span className="flex items-center gap-1"><Calendar size={12} /> {selected.date}</span>
                <span className="flex items-center gap-1"><Building2 size={12} /> {selected.clinic}</span>
              </div>
              {selected.diagnosis && (<><p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Diagnosis</p><p className="text-sm font-bold text-foreground mb-4">{selected.diagnosis}</p></>)}
              {selected.treatment && (<><p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Treatment</p><p className="text-sm text-foreground font-medium mb-4">{selected.treatment}</p></>)}
              {selected.followUp && (<div className="glass rounded-3xl p-3 shadow-soft"><p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Follow-up</p><p className="text-sm font-bold text-foreground">{selected.followUp}</p></div>)}
            </motion.div>
          </>
        )}
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[80]" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl">
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-foreground">Log Vet Visit</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-muted"><X size={18} className="text-muted-foreground" /></button>
              </div>
              <input placeholder="Reason for visit *" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full glass rounded-2xl px-5 py-3.5 text-sm text-foreground outline-none mb-3 shadow-soft" />
              <input placeholder="Diagnosis (optional)" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full glass rounded-2xl px-5 py-3.5 text-sm text-foreground outline-none mb-3 shadow-soft" />
              <p className="text-[10px] text-muted-foreground font-medium mb-5 px-2">
                Vet auto-prefilled: {details?.vetName} at {details?.vetAddress.split(",")[0]}
              </p>
              <motion.button whileTap={{ scale: 0.96 }} onClick={handleAdd} className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow">Save</motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VetVisitsScreen;

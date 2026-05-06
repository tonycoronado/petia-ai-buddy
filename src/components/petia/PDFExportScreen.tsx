import { motion } from "framer-motion";
import { ChevronLeft, FileText, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { useAppSettings } from "@/lib/appSettings";
import PremiumGate from "./PremiumGate";

interface PDFExportScreenProps {
  petName: string;
  onBack: () => void;
  onUpgrade: () => void;
}

const INCLUDED = [
  "Pet profile (name, breed, DOB, vet info)",
  "Vet visit history with diagnosis & treatment",
  "Vaccination records",
  "Active medications",
  "Health diary entries with photos",
  "Weight history chart",
  "Mood patterns (last 30 days)",
];

const PDFExportScreen = ({ petName, onBack, onUpgrade }: PDFExportScreenProps) => {
  const { isPremium } = useAppSettings();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-12 px-6 pb-32 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-muted">
          <ChevronLeft size={22} className="text-foreground" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Health PDF</h1>
          <p className="text-xs text-muted-foreground font-medium">Vet-ready report for {petName}</p>
        </div>
      </div>

      {!isPremium ? (
        <PremiumGate
          title="Health PDF Export"
          description={`Generate a complete vet-ready PDF of ${petName}'s full health record.`}
          onUpgrade={onUpgrade}
        />
      ) : (
        <>
          <div className="glass rounded-4xl p-6 shadow-soft mb-6">
            <div className="w-14 h-14 rounded-3xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow mb-4">
              <FileText size={22} />
            </div>
            <h2 className="text-xl font-black text-foreground mb-1">{petName}'s Health Record</h2>
            <p className="text-xs text-muted-foreground font-medium mb-5">
              Updated today • Ready to share with your vet
            </p>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
              Included
            </p>
            <ul className="space-y-2">
              {INCLUDED.map((i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-foreground font-medium">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => toast.success("PDF generated — share sheet opened")}
            className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow flex items-center justify-center gap-2"
          >
            <Share2 size={16} /> Generate & Share PDF
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default PDFExportScreen;

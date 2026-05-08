import { motion } from "framer-motion";
import { X, Camera, Smile, BookHeart, Scale, Bell, Stethoscope, ScanLine } from "lucide-react";

export type CaptureAction =
  | "scan"
  | "mood"
  | "diary"
  | "weight"
  | "reminder"
  | "vet"
  | "import";

interface CaptureSheetProps {
  petName: string;
  onClose: () => void;
  onAction: (action: CaptureAction) => void;
}

const ACTIONS: { id: CaptureAction; label: string; sub: string; icon: any; accent?: boolean }[] = [
  { id: "scan", label: "Scan food", sub: "Check if it's safe", icon: Camera, accent: true },
  { id: "mood", label: "Log mood", sub: "How they feel today", icon: Smile },
  { id: "diary", label: "Photo journal", sub: "Note an observation", icon: BookHeart },
  { id: "weight", label: "Log weight", sub: "Track changes", icon: Scale },
  { id: "reminder", label: "Add reminder", sub: "Vaccine, meds, more", icon: Bell },
  { id: "vet", label: "Log vet visit", sub: "After an appointment", icon: Stethoscope },
  { id: "import", label: "Import vet records", sub: "Snap past documents", icon: ScanLine },
];

const CaptureSheet = ({ petName, onClose, onAction }: CaptureSheetProps) => (
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
      className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl max-h-[88vh] overflow-y-auto"
    >
      <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-2xl font-black text-foreground">Quick log</h3>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted">
          <X size={18} className="text-muted-foreground" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground font-medium mb-6">For {petName}</p>

      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((a, i) => (
          <motion.button
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onAction(a.id)}
            className="glass rounded-3xl p-4 text-left shadow-soft"
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 ${
                a.accent
                  ? "gradient-cta text-primary-foreground shadow-glow"
                  : "bg-secondary text-foreground"
              }`}
            >
              <a.icon size={18} />
            </div>
            <p className="font-black text-foreground text-sm">{a.label}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{a.sub}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  </>
);

export default CaptureSheet;

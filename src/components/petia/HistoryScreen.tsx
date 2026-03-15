import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ScanSearch } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ScanRecord {
  id: string;
  pet_name: string;
  scan_type: string;
  status: string;
  title: string;
  description: string;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  Green: "bg-primary/15 text-primary",
  Yellow: "bg-warning text-warning-foreground",
  Red: "bg-destructive/15 text-destructive",
};

const PET_IMAGES: Record<string, string> = {
  Max: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=100",
  Luna: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=100",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const HistoryScreen = () => {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      const { data } = await supabase
        .from("scan_history")
        .select("*")
        .order("created_at", { ascending: false });
      setScans((data as ScanRecord[]) ?? []);
      setLoading(false);
    };
    fetchScans();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 px-6 pb-32"
    >
      <h1 className="text-3xl font-black tracking-tight mb-8 text-foreground">
        Scan History
      </h1>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-3xl p-4 flex items-center gap-4 shadow-soft">
              <Skeleton className="w-14 h-14 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {!loading && scans.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
            <ScanSearch className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-bold text-foreground mb-1">No scans yet</p>
          <p className="text-sm text-muted-foreground max-w-[240px]">
            Start by scanning your pet! Results will appear here automatically.
          </p>
        </motion.div>
      )}

      {!loading && scans.length > 0 && (
        <div className="space-y-4">
          {scans.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-3xl p-4 flex items-center gap-4 shadow-soft"
            >
              <img
                src={PET_IMAGES[item.pet_name] ?? PET_IMAGES.Max}
                alt={item.pet_name}
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground">{item.pet_name}</p>
                <p className="text-sm text-muted-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(item.created_at)}
                </p>
              </div>
              <span
                className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${STATUS_STYLES[item.status] ?? STATUS_STYLES.Yellow}`}
              >
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryScreen;

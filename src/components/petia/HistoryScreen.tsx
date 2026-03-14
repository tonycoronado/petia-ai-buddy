import { motion } from "framer-motion";

const HISTORY = [
  {
    id: 1,
    pet: "Max",
    img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=100",
    date: "Oct 12, 2023",
    type: "Skin Check",
    status: "Caution",
    statusColor: "bg-warning text-warning-foreground",
  },
  {
    id: 2,
    pet: "Luna",
    img: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=100",
    date: "Oct 10, 2023",
    type: "Food Toxicity",
    status: "Safe",
    statusColor: "bg-primary/15 text-primary",
  },
  {
    id: 3,
    pet: "Max",
    img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=100",
    date: "Sep 28, 2023",
    type: "Mood Analysis",
    status: "Safe",
    statusColor: "bg-primary/15 text-primary",
  },
  {
    id: 4,
    pet: "Luna",
    img: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=100",
    date: "Sep 15, 2023",
    type: "Ear Inspection",
    status: "Caution",
    statusColor: "bg-warning text-warning-foreground",
  },
];

const HistoryScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="pt-16 px-6 pb-32"
  >
    <h1 className="text-3xl font-black tracking-tight mb-8 text-foreground">
      Scan History
    </h1>

    <div className="space-y-4">
      {HISTORY.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-3xl p-4 flex items-center gap-4 shadow-soft"
        >
          <img
            src={item.img}
            alt={item.pet}
            className="w-14 h-14 rounded-2xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground">{item.pet}</p>
            <p className="text-sm text-muted-foreground">{item.type}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
          </div>
          <span
            className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${item.statusColor}`}
          >
            {item.status}
          </span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default HistoryScreen;

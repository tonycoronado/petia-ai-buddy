import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, X, Sparkles, ChevronRight } from "lucide-react";
import {
  MOCK_YEARLY_EXPENSES,
  MOCK_YEARLY_TOP_CATEGORIES,
  MOCK_AI_EXPENSE_ESTIMATE,
} from "@/lib/mockData";

interface ExpenseTrackerScreenProps {
  onBack: () => void;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

const CATEGORIES = ["Food", "Vet", "Grooming", "Toys", "Insurance", "Other"];

const CATEGORY_EMOJIS: Record<string, string> = {
  Food: "🍖",
  Vet: "🏥",
  Grooming: "✂️",
  Toys: "🎾",
  Insurance: "🛡️",
  Other: "📦",
};

const MOCK_EXPENSES: Expense[] = [
  { id: "1", date: "Apr 7", category: "Food", description: "Royal Canin Adult 12kg", amount: 62.99 },
  { id: "2", date: "Apr 5", category: "Grooming", description: "Monthly grooming session", amount: 45.0 },
  { id: "3", date: "Apr 1", category: "Vet", description: "Annual vaccination", amount: 120.0 },
  { id: "4", date: "Mar 28", category: "Toys", description: "Chew toys (x3)", amount: 24.99 },
  { id: "5", date: "Mar 20", category: "Food", description: "Treats & snacks", amount: 18.5 },
  { id: "6", date: "Mar 15", category: "Insurance", description: "Monthly pet insurance", amount: 35.0 },
];

const MONTHLY_BREAKDOWN = [
  { category: "Food", amount: 81.49, percent: 26 },
  { category: "Vet", amount: 120.0, percent: 39 },
  { category: "Grooming", amount: 45.0, percent: 15 },
  { category: "Toys", amount: 24.99, percent: 8 },
  { category: "Insurance", amount: 35.0, percent: 12 },
];

const ExpenseTrackerScreen = ({ onBack }: ExpenseTrackerScreenProps) => {
  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const [showAdd, setShowAdd] = useState(false);
  const [showAIDetail, setShowAIDetail] = useState(false);
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [newCategory, setNewCategory] = useState("Food");
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const totalMonth = MONTHLY_BREAKDOWN.reduce((s, c) => s + c.amount, 0);
  const totalYear = MOCK_YEARLY_EXPENSES.reduce((s, m) => s + m.amount, 0);
  const maxMonthly = Math.max(...MOCK_YEARLY_EXPENSES.map((m) => m.amount), 1);

  const handleAddExpense = () => {
    if (!newDesc.trim() || !newAmount.trim()) return;
    const expense: Expense = {
      id: Date.now().toString(),
      date: "Today",
      category: newCategory,
      description: newDesc,
      amount: parseFloat(newAmount) || 0,
    };
    setExpenses([expense, ...expenses]);
    setShowAdd(false);
    setNewDesc("");
    setNewAmount("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-12 px-6 pb-32 min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ChevronLeft size={22} className="text-foreground" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Expense Tracker</h1>
          <p className="text-xs text-muted-foreground font-medium">
            {view === "monthly" ? "April 2026" : "Year 2026"}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAdd(true)}
          className="w-10 h-10 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      {/* Segment toggle */}
      <div className="glass rounded-full p-1 shadow-soft mb-6 grid grid-cols-2 gap-1">
        {(["monthly", "yearly"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              view === v
                ? "gradient-cta text-primary-foreground shadow-glow"
                : "text-muted-foreground"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === "monthly" ? (
        <>
          {/* Monthly total */}
          <div className="glass rounded-4xl p-6 shadow-soft mb-6 text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
              Total This Month
            </p>
            <p className="text-4xl font-black text-foreground">${totalMonth.toFixed(2)}</p>
            <button
              onClick={() => setShowAIDetail(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary font-bold"
            >
              <Sparkles size={12} /> AI estimate next month: ~${MOCK_AI_EXPENSE_ESTIMATE.predicted}
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Category breakdown */}
          <div className="glass rounded-4xl p-5 shadow-soft mb-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
              Breakdown by Category
            </p>
            <div className="space-y-3">
              {MONTHLY_BREAKDOWN.map((cat) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <span className="text-lg">{CATEGORY_EMOJIS[cat.category]}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-foreground">{cat.category}</span>
                      <span className="text-xs font-bold text-foreground">${cat.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percent}%` }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="h-full gradient-cta rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">
            Recent Expenses
          </p>
          <div className="space-y-2">
            {expenses.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-3xl p-4 flex items-center gap-3 shadow-soft"
              >
                <span className="text-xl">{CATEGORY_EMOJIS[exp.category] || "📦"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm truncate">{exp.description}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {exp.category} • {exp.date}
                  </p>
                </div>
                <span className="font-black text-foreground text-sm">${exp.amount.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Yearly total */}
          <div className="glass rounded-4xl p-6 shadow-soft mb-6 text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
              Year to Date
            </p>
            <p className="text-4xl font-black text-foreground">${totalYear.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Across {MOCK_YEARLY_EXPENSES.filter((m) => m.amount > 0).length} months
            </p>
          </div>

          {/* Monthly bars */}
          <div className="glass rounded-4xl p-5 shadow-soft mb-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
              Monthly Spend
            </p>
            <div className="flex items-end justify-between gap-1.5 h-32">
              {MOCK_YEARLY_EXPENSES.map((m, i) => {
                const h = m.amount > 0 ? Math.max(8, (m.amount / maxMonthly) * 100) : 4;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.04, duration: 0.5 }}
                      className={`w-full rounded-t-lg ${m.amount > 0 ? "gradient-cta" : "bg-muted"}`}
                    />
                    <span className="text-[9px] font-bold text-muted-foreground">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top categories of the year */}
          <div className="glass rounded-4xl p-5 shadow-soft">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
              Top Categories This Year
            </p>
            <div className="space-y-3">
              {MOCK_YEARLY_TOP_CATEGORIES.map((cat) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <span className="text-lg">{CATEGORY_EMOJIS[cat.category]}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-foreground">{cat.category}</span>
                      <span className="text-xs font-bold text-foreground">${cat.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percent}%` }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="h-full gradient-cta rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Add Expense Sheet */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-foreground">Add Expense</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      newCategory === cat
                        ? "gradient-cta text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {CATEGORY_EMOJIS[cat]} {cat}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full glass rounded-2xl px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none mb-3 shadow-soft"
              />
              <input
                type="number"
                placeholder="Amount ($)"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full glass rounded-2xl px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none mb-6 shadow-soft"
              />

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAddExpense}
                className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow"
              >
                Add Expense
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Estimate Detail Sheet */}
      <AnimatePresence>
        {showAIDetail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAIDetail(false)}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[48px] z-[90] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-foreground">AI Estimate Detail</h3>
                <button onClick={() => setShowAIDetail(false)} className="p-2 rounded-xl hover:bg-muted">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="glass rounded-4xl p-6 shadow-soft mb-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground shadow-glow">
                  <Sparkles size={20} />
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Predicted Next Month
                </p>
                <p className="text-4xl font-black text-foreground">
                  ~${MOCK_AI_EXPENSE_ESTIMATE.predicted}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/15 text-primary">
                  {MOCK_AI_EXPENSE_ESTIMATE.confidence} confidence
                </span>
                <p className="text-[11px] text-muted-foreground font-medium mt-2">
                  {MOCK_AI_EXPENSE_ESTIMATE.basis}
                </p>
              </div>

              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">
                How we calculated it
              </p>
              <div className="glass rounded-3xl p-2 shadow-soft divide-y divide-border mb-5">
                {MOCK_AI_EXPENSE_ESTIMATE.breakdown.map((b) => (
                  <div key={b.label} className="flex items-center justify-between px-3 py-3">
                    <span className="text-xs font-bold text-foreground">{b.label}</span>
                    <span className="text-xs font-black text-foreground">{b.value}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed text-center">
                AI estimates are informational. Actual spending may vary based on your pet's needs.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExpenseTrackerScreen;

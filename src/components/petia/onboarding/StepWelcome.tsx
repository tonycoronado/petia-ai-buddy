import { motion } from "framer-motion";

interface Props { next: () => void; skipAll?: () => void; }

const StepWelcome = ({ next, skipAll }: Props) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
    <span className="text-6xl mb-6 block">🐾</span>
    <h1 className="text-4xl font-black tracking-tight text-foreground mb-3 leading-tight">
      Meet Petia
    </h1>
    <p className="text-muted-foreground font-medium mb-12 leading-relaxed text-base max-w-[280px] mx-auto">
      Your pet's calm, personal care companion.
    </p>
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={next}
      className="w-full py-4 gradient-cta text-primary-foreground rounded-3xl font-bold shadow-glow"
    >
      Get started
    </motion.button>
    {skipAll && (
      <button
        onClick={skipAll}
        className="mt-4 text-xs font-bold text-muted-foreground underline underline-offset-4"
      >
        Just let me in
      </button>
    )}
  </motion.div>
);

export default StepWelcome;

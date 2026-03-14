import { motion } from "framer-motion";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onAnimationComplete={(def: { opacity?: number }) => {
        if (def.opacity === 0) onFinish();
      }}
      className="fixed inset-0 z-[200] bg-background flex items-center justify-center"
    >
      {/* Pulsing glow behind logo */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-64 h-64 rounded-full gradient-accent blur-3xl"
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <h1 className="text-7xl font-black tracking-tighter text-foreground">
          Petia
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-muted-foreground text-sm font-medium mt-2 tracking-widest uppercase"
        >
          AI Pet Care
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;

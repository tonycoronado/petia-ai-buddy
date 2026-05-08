import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import type { Pet } from "./FloatingBubble";
import { PET_DETAILS } from "@/lib/mockData";
import { useAppSettings } from "@/lib/appSettings";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatScreenProps {
  pet: Pet;
  onUpgrade: () => void;
  onBack?: () => void;
}

const FREE_LIMIT = 3;

const ChatScreen = ({ pet, onUpgrade }: ChatScreenProps) => {
  const { isPremium } = useAppSettings();
  const details = PET_DETAILS[String(pet.id)];
  const ctxLine = details
    ? `${pet.breed} • ${pet.age} • ${pet.weight}${details.allergies.length ? ` • allergies: ${details.allergies.join(", ")}` : ""}`
    : `${pet.breed} • ${pet.age} • ${pet.weight}`;

  const RESPONSES = [
    `Based on ${pet.name}'s profile (${ctxLine}), I'd monitor closely for 24–48 hours. If symptoms persist or worsen, please book a vet visit.\n\n⚕️ This is not a diagnosis. If you are concerned about ${pet.name}'s health, please consult a veterinarian.`,
    `${pet.breed}s of ${pet.name}'s age and weight benefit from 30–60 minutes of moderate daily activity. Keep portions consistent with the food you scanned recently.\n\n⚕️ This is not a diagnosis. If you are concerned about ${pet.name}'s health, please consult a veterinarian.`,
    `For coat and joint support, Omega-3 (fish oil) is well tolerated. ${details?.allergies.length ? `Note ${pet.name}'s allergy to ${details.allergies.join(", ")}.` : ""} I'd start small and observe for 7 days.\n\n⚕️ This is not a diagnosis. If you are concerned about ${pet.name}'s health, please consult a veterinarian.`,
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! 👋 I'm your Petia care assistant. I know ${pet.name}'s profile (${ctxLine}). How can I help today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [count, setCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
  }, [messages, typing]);

  const handleSend = () => {
    const t = input.trim();
    if (!t || typing) return;
    if (!isPremium && count >= FREE_LIMIT) {
      onUpgrade();
      return;
    }
    setMessages((m) => [...m, { role: "user", content: t }]);
    setInput("");
    setTyping(true);
    setCount((c) => c + 1);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: RESPONSES[Math.floor(Math.random() * RESPONSES.length)] }]);
      setTyping(false);
    }, 1500);
  };

  const limitReached = !isPremium && count >= FREE_LIMIT;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-screen">
      <div className="pt-16 px-6 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight text-foreground">AI Care Assistant</h1>
          {isPremium && (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full gradient-cta text-primary-foreground">
              <Sparkles size={10} /> Priority
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">
          Personalized for {pet.name} • {ctxLine}
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 space-y-4 pb-4 no-scrollbar">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-5 py-3.5 text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "gradient-cta text-primary-foreground rounded-3xl rounded-br-lg" : "glass rounded-3xl rounded-bl-lg text-foreground shadow-soft"}`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass rounded-3xl rounded-bl-lg px-5 py-3.5 shadow-soft flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </motion.div>
        )}
        {limitReached && (
          <button onClick={onUpgrade} className="w-full glass rounded-3xl p-4 shadow-soft text-left flex items-center gap-3 border border-primary/20">
            <div className="w-9 h-9 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground"><Sparkles size={16} /></div>
            <div className="flex-1">
              <p className="font-black text-foreground text-sm">Free chat limit reached</p>
              <p className="text-[11px] text-muted-foreground font-medium">Upgrade for unlimited priority AI chat</p>
            </div>
          </button>
        )}
      </div>

      <div className="px-6 pb-32 pt-2">
        <div className="glass rounded-3xl flex items-center gap-3 px-5 py-3 shadow-soft">
          <input
            type="text"
            placeholder={`Ask about ${pet.name}'s health...`}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            disabled={typing || limitReached}
          />
          <button onClick={handleSend} disabled={typing || !input.trim() || limitReached} className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-primary-foreground shrink-0 disabled:opacity-50">
            <Send size={18} />
          </button>
        </div>
        {!isPremium && !limitReached && (
          <p className="text-[10px] text-muted-foreground font-medium text-center mt-2">
            {FREE_LIMIT - count} free messages left today
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ChatScreen;

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MOCK_RESPONSES: string[] = [
  "That's a great question! Based on Luna's profile as a 3-year-old Golden Retriever, I'd recommend monitoring this closely for 24-48 hours. If you notice any changes, it's best to visit your vet.\n\n⚕️ This is not a diagnosis. If you are concerned about Luna's health, please consult a veterinarian.",
  "Golden Retrievers are prone to hip dysplasia and skin allergies. Since Luna is still young, maintaining a healthy weight and regular exercise is key. I'd suggest 30-60 minutes of moderate activity daily.\n\n⚕️ This is not a diagnosis. If you are concerned about Luna's health, please consult a veterinarian.",
  "For Luna's coat health, Omega-3 fatty acids are wonderful! You can add fish oil supplements to her food — about 1000mg per day for her weight. It helps with skin, coat, and joint health.\n\n⚕️ This is not a diagnosis. If you are concerned about Luna's health, please consult a veterinarian.",
  "That's actually quite normal for Golden Retrievers! They tend to shed more during spring and fall. Regular brushing (2-3 times a week) and a good diet will help manage it.\n\n⚕️ This is not a diagnosis. If you are concerned about Luna's health, please consult a veterinarian.",
];

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! 👋 I'm your Petia care assistant. I know all about Luna — her breed, age, weight, and health history. How can I help today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen"
    >
      {/* Header */}
      <div className="pt-16 px-6 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            AI Care Assistant
          </h1>
          <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Online
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">
          Personalized advice for Luna
        </p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 space-y-4 pb-4 no-scrollbar"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i < 2 ? i * 0.15 : 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-5 py-3.5 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === "user"
                  ? "gradient-cta text-primary-foreground rounded-3xl rounded-br-lg"
                  : "glass rounded-3xl rounded-bl-lg text-foreground shadow-soft"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass rounded-3xl rounded-bl-lg px-5 py-3.5 shadow-soft flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-32 pt-2">
        <div className="glass rounded-3xl flex items-center gap-3 px-5 py-3 shadow-soft">
          <input
            type="text"
            placeholder="Ask about Luna's health..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-primary-foreground shrink-0 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatScreen;

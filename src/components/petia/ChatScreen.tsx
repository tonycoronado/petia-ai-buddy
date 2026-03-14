import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface Message {
  id: number;
  from: "ai" | "user";
  text: string;
}

const MESSAGES: Message[] = [
  {
    id: 1,
    from: "ai",
    text: "Hi there! I'm Petia's Vet AI. How can I help Max or Luna today?",
  },
  {
    id: 2,
    from: "user",
    text: "Max has been scratching his ear a lot today.",
  },
  {
    id: 3,
    from: "ai",
    text: "I see. Based on his profile, he doesn't have a history of ear infections. Would you like to use the scanner to take a picture of the inside of his ear?",
  },
];

const ChatScreen = () => (
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
          Vet AI Assistant
        </h1>
        <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Online
        </span>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4 no-scrollbar">
      {MESSAGES.map((msg, i) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] px-5 py-3.5 text-sm leading-relaxed ${
              msg.from === "user"
                ? "gradient-cta text-primary-foreground rounded-3xl rounded-br-lg"
                : "glass rounded-3xl rounded-bl-lg text-foreground shadow-soft"
            }`}
          >
            {msg.text}
          </div>
        </motion.div>
      ))}
    </div>

    {/* Input */}
    <div className="px-6 pb-32 pt-2">
      <div className="glass rounded-3xl flex items-center gap-3 px-5 py-3 shadow-soft">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          readOnly
        />
        <button className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-primary-foreground shrink-0">
          <Send size={18} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default ChatScreen;

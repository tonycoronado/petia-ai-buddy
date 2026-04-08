import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PetContext {
  name: string;
  species?: string;
  breed?: string;
  age?: string;
  weight?: string;
}

interface ChatScreenProps {
  petContext?: PetContext;
}

const DISCLAIMER = "\n\n⚠️ This is not a diagnosis. If you are concerned about your pet's health, please consult a veterinarian.";

const ChatScreen = ({ petContext }: ChatScreenProps) => {
  const petName = petContext?.name || "your pet";

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi there! 👋 I'm Petia, your Vet AI assistant. How can I help ${petName} today?`,
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

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-vet", {
        body: {
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          petContext,
        },
      });

      if (error) {
        let backendMessage: string | null = null;
        const context = (error as any)?.context;
        if (context && typeof context.json === "function") {
          try {
            const payload = await context.json();
            if (typeof payload?.message === "string" && payload.message.trim().length > 0) {
              backendMessage = payload.message;
            }
          } catch {
            // ignore
          }
        }
        throw new Error(
          backendMessage ||
            (error instanceof Error && error.message.trim().length > 0
              ? error.message
              : "Network error, please try again")
        );
      }

      if (data?.error === true) {
        throw new Error(
          typeof data?.message === "string" && data.message.trim().length > 0
            ? data.message
            : "AI error"
        );
      }

      const aiContent =
        typeof data?.content === "string" && data.content.trim().length > 0
          ? data.content + DISCLAIMER
          : "Sorry, I couldn't process that. Could you try again?";

      setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
    } catch (e) {
      console.error(e);
      toast.error(
        e instanceof Error && e.message.trim().length > 0
          ? e.message
          : "Network error, please try again"
      );
    } finally {
      setIsTyping(false);
    }
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
            Vet AI Assistant
          </h1>
          <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Online
          </span>
        </div>
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
            <div className="glass rounded-3xl rounded-bl-lg px-5 py-3.5 shadow-soft flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              Typing...
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-32 pt-2">
        <div className="glass rounded-3xl flex items-center gap-3 px-5 py-3 shadow-soft">
          <input
            type="text"
            placeholder="Type a message..."
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

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

interface ChatMessage {
  role: string;
  content: string;
  timestamp: bigint;
}

interface ChatMemoryEntry {
  key: string;
  value: string;
  timestamp: bigint;
}

const FEELING_WORDS = [
  "stressed",
  "tired",
  "happy",
  "sad",
  "anxious",
  "excited",
  "overwhelmed",
  "lonely",
  "grateful",
  "scared",
  "worried",
  "angry",
  "frustrated",
  "calm",
  "peaceful",
];

function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function extractMemories(
  text: string,
  existingKeys: Set<string>,
): ChatMemoryEntry[] {
  const entries: ChatMemoryEntry[] = [];
  const lower = text.toLowerCase();

  for (const feeling of FEELING_WORDS) {
    if (lower.includes(feeling) && !existingKeys.has(`feeling:${feeling}`)) {
      entries.push({
        key: `feeling:${feeling}`,
        value: feeling,
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      });
    }
  }

  const nameMatch = text.matchAll(/\bmy\s+(?:\w+\s+)?([A-Z][a-z]+)/g);
  for (const m of nameMatch) {
    const name = m[1];
    const key = `name:${name.toLowerCase()}`;
    if (!existingKeys.has(key)) {
      entries.push({
        key,
        value: name,
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      });
    }
  }

  return entries;
}

function buildMemoryContext(memories: ChatMemoryEntry[]): string {
  if (memories.length === 0) return "";
  const feelings = memories
    .filter((m) => m.key.startsWith("feeling:"))
    .map((m) => `feels ${m.value}`);
  const names = memories
    .filter((m) => m.key.startsWith("name:"))
    .map((m) => `mentioned someone named ${m.value}`);
  return [...feelings, ...names].join(", ");
}

interface Props {
  userName: string;
}

export default function ChatTab({ userName }: Props) {
  const { actor } = useActor();
  const chatActor = actor as any;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [memories, setMemories] = useState<ChatMemoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!chatActor) return;
    Promise.all([
      chatActor.getChatHistory() as Promise<ChatMessage[]>,
      chatActor.getChatMemories() as Promise<ChatMemoryEntry[]>,
    ]).then(([history, mems]) => {
      const sorted = [...history].sort((a, b) =>
        Number(a.timestamp - b.timestamp),
      );
      setMessages(sorted);
      setMemories(mems);
    });
  }, [chatActor]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll-to-bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !chatActor || isTyping) return;

    setInput("");
    setError(null);

    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const existingKeys = new Set(memories.map((m) => m.key));
    const newMemories = extractMemories(text, existingKeys);
    let allMemories = memories;
    if (newMemories.length > 0) {
      allMemories = [...memories, ...newMemories];
      setMemories(allMemories);
      (chatActor.saveChatMemories(newMemories) as Promise<void>).catch(
        () => {},
      );
    }

    try {
      const memCtx = buildMemoryContext(allMemories);
      const response = (await chatActor.sendChatMessage(
        text,
        memCtx,
        userName,
      )) as string;
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errMsg: ChatMessage = {
        role: "assistant",
        content:
          "Something went quiet on my end. Take a breath — I'm still here. 🌿",
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      };
      setMessages((prev) => [...prev, errMsg]);
      setError("Connection interrupted. Try again in a moment.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <header className="px-5 pt-10 pb-3 bg-background/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <h1 className="font-display text-base font-semibold text-foreground">
            safe space
          </h1>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 ml-8">
          just for you, always private
        </p>
      </header>

      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        data-ocid="chat.list"
      >
        {messages.length === 0 && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full pt-20 text-center px-6"
            data-ocid="chat.empty_state"
          >
            <span className="text-5xl mb-4">🫧</span>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              This is your safe space.
              <br />
              Say anything.
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <motion.div
                key={`${String(msg.timestamp)}-${i}`}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`flex flex-col ${
                  isUser ? "items-end" : "items-start"
                }`}
                data-ocid={`chat.item.${i + 1}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-3xl ${
                    isUser
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-card text-foreground border border-border/50"
                  }`}
                >
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-2">
                  {formatRelativeTime(msg.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-start"
              data-ocid="chat.loading_state"
            >
              <div className="bg-card border border-border/50 rounded-3xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 block"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.7,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: dot * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p
            className="text-center text-[11px] text-muted-foreground/70 py-1"
            data-ocid="chat.error_state"
          >
            {error}
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-4 pt-2 bg-background/90 backdrop-blur-sm border-t border-border/40">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="write something…"
            rows={1}
            data-ocid="chat.textarea"
            className="resize-none min-h-[42px] max-h-[120px] rounded-2xl text-sm py-2.5 px-4 bg-card border-border/50 focus-visible:ring-1 focus-visible:ring-primary/40 placeholder:text-muted-foreground/50"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            data-ocid="chat.submit_button"
            className="rounded-2xl shrink-0 w-10 h-10 bg-primary hover:bg-primary/90 disabled:opacity-40"
          >
            <Send size={16} />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

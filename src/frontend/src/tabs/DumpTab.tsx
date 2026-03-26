import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CALMING_RESPONSES, MOOD_FLIP_RESPONSES } from "../types/kenori";

export default function DumpTab() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [released, setReleased] = useState(false);
  const [flipped, setFlipped] = useState<string | null>(null);
  const [flippedOnce, setFlippedOnce] = useState(false);

  const handleRelease = () => {
    if (!text.trim()) return;
    const idx = Math.floor(Math.random() * CALMING_RESPONSES.length);
    setResponse(CALMING_RESPONSES[idx]);
    setReleased(true);
  };

  const handleReset = () => {
    setText("");
    setResponse(null);
    setReleased(false);
    setFlipped(null);
    setFlippedOnce(false);
  };

  const handleMoodFlip = () => {
    const idx = Math.floor(Math.random() * MOOD_FLIP_RESPONSES.length);
    setFlipped(MOOD_FLIP_RESPONSES[idx]);
    setFlippedOnce(true);
  };

  return (
    <div className="px-5 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold">Overthink Dump</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Let it all out. No judgment here. 🤗
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!released ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="kenori-card space-y-1 p-4">
              <p className="text-xs text-muted-foreground mb-2">
                Your thoughts stay here — they're not saved anywhere.
              </p>
              <Textarea
                placeholder="What's been spinning in your head? Write it all down…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                data-ocid="dump.textarea"
                className="rounded-2xl text-base min-h-[200px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              onClick={handleRelease}
              disabled={!text.trim()}
              data-ocid="dump.primary_button"
              className="w-full rounded-full py-6 text-base font-semibold"
            >
              Release it 💨
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="kenori-card bg-muted/40 border border-border space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                What you let go of
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed line-clamp-4 italic">
                &ldquo;{text}&rdquo;
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="kenori-card text-center py-8 space-y-3"
              style={{ background: "oklch(var(--accent) / 0.3)" }}
            >
              <div className="text-4xl">🌸</div>
              <p className="font-heading text-xl font-semibold text-foreground leading-snug px-4">
                {response}
              </p>
            </motion.div>

            {/* Mood Flip */}
            <Button
              onClick={handleMoodFlip}
              variant="outline"
              data-ocid="dump.mood_flip.button"
              className="w-full rounded-full py-5 border-border"
            >
              {flippedOnce ? "Flip again ✨" : "Mood Flip ✨"}
            </Button>

            <AnimatePresence>
              {flipped && (
                <motion.div
                  key={flipped}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  data-ocid="dump.mood_flip.card"
                  className="kenori-card text-center py-6 space-y-2"
                >
                  <div className="text-2xl">🌱</div>
                  <p className="font-heading text-base font-medium leading-snug px-4">
                    {flipped}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={handleReset}
              variant="outline"
              data-ocid="dump.secondary_button"
              className="w-full rounded-full py-5 border-border"
            >
              Dump again 💭
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

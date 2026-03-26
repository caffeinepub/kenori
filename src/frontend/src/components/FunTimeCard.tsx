import { motion } from "motion/react";
import { useState } from "react";
import { getTodaysFunTime } from "../data/funTimeData";

const todayItem = getTodaysFunTime();

export default function FunTimeCard() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="kenori-card space-y-3" data-ocid="home.funtime.card">
      <div className="space-y-0.5">
        <h2 className="font-heading text-lg font-semibold">
          ✨ Today's Fun Time
        </h2>
        <p className="text-xs text-muted-foreground">
          a little brain sparkle 🧠
        </p>
      </div>

      <p className="text-sm text-foreground leading-relaxed">
        {todayItem.question}
      </p>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          data-ocid="home.funtime.primary_button"
          className="w-full rounded-full border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        >
          Reveal Answer 👀
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            style={{
              maxHeight: revealed ? "200px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.4s ease",
            }}
          >
            <div
              className="rounded-2xl px-4 py-3 space-y-1.5"
              style={{ background: "oklch(var(--accent) / 0.15)" }}
            >
              <p className="text-sm font-semibold text-foreground">
                {todayItem.answer}
              </p>
              <p className="text-xs text-muted-foreground">
                {todayItem.positiveMessage}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground text-right">
        come back tomorrow for a new one →
      </p>
    </div>
  );
}

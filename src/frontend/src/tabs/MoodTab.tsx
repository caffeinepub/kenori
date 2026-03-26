import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useMemo } from "react";
import { toast } from "sonner";
import type { AllUserData } from "../backend.d";
import { Mood, useLogMood } from "../hooks/useQueries";
import { MOOD_META } from "../types/kenori";

interface Props {
  userData: AllUserData | null | undefined;
  isLoading: boolean;
}

const MOODS = [Mood.happy, Mood.excited, Mood.neutral, Mood.sad, Mood.anxious];

export default function MoodTab({ userData, isLoading }: Props) {
  const logMood = useLogMood();

  const todayMood = useMemo(() => {
    if (!userData?.moodLog) return null;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const entry = userData.moodLog.find((m) => {
      const d = new Date(Number(m.timestamp) / 1_000_000);
      return d >= todayStart;
    });
    return entry?.mood || null;
  }, [userData?.moodLog]);

  const calendarDays = useMemo(() => {
    const days: { date: Date; mood: string | null }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const dayStart = d.getTime();
      const dayEnd = dayStart + 86400000;
      const moodEntry = userData?.moodLog?.find((m) => {
        const t = Number(m.timestamp) / 1_000_000;
        return t >= dayStart && t < dayEnd;
      });
      days.push({ date: d, mood: moodEntry?.mood || null });
    }
    return days;
  }, [userData?.moodLog]);

  const handleMoodLog = async (mood: Mood) => {
    try {
      await logMood.mutateAsync({
        mood,
        timestamp: BigInt(Date.now()) * 1_000_000n,
      });
      toast.success("Mood logged 🌸");
    } catch {
      toast.error("Couldn't log mood");
    }
  };

  return (
    <div className="px-5 py-6 space-y-6">
      <h1 className="font-heading text-3xl font-bold">Mood</h1>

      <div className="kenori-card space-y-3">
        <h2 className="font-heading text-lg font-semibold">
          {todayMood
            ? `Today you’re feeling ${MOOD_META[todayMood]?.emoji}`
            : "Log today’s mood"}
        </h2>
        {isLoading ? (
          <div className="flex gap-2 flex-wrap" data-ocid="mood.loading_state">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2" data-ocid="mood.log.row">
            {MOODS.map((m) => {
              const meta = MOOD_META[m];
              const sel = todayMood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMoodLog(m)}
                  data-ocid="mood.log.toggle"
                  style={
                    sel
                      ? {
                          background: meta.bg,
                          borderColor: meta.color,
                          color: meta.color,
                        }
                      : {}
                  }
                  className={`mood-chip border-2 ${sel ? "font-semibold" : "bg-muted/60 text-muted-foreground border-transparent"}`}
                >
                  {meta.emoji} {meta.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="kenori-card space-y-4">
        <h2 className="font-heading text-lg font-semibold">Last 30 days</h2>
        {isLoading ? (
          <Skeleton className="h-40 rounded-2xl" />
        ) : (
          <div className="grid grid-cols-10 gap-1.5">
            {calendarDays.map((day, i) => {
              const meta = day.mood ? MOOD_META[day.mood] : null;
              const isToday = i === 29;
              return (
                <motion.div
                  key={day.date.toDateString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.01 }}
                  title={`${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}${
                    day.mood
                      ? ` — ${MOOD_META[day.mood]?.label || day.mood}`
                      : ""
                  }`}
                  className={`aspect-square rounded-lg flex items-center justify-center ${
                    isToday ? "ring-2 ring-primary ring-offset-1" : ""
                  }`}
                  style={{ background: meta ? meta.bg : "oklch(var(--muted))" }}
                >
                  {meta ? (
                    <span className="text-xs">{meta.emoji}</span>
                  ) : (
                    <span className="text-[8px] text-muted-foreground">
                      {day.date.getDate()}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="kenori-card">
        <h2 className="font-heading text-base font-semibold mb-3">
          Mood legend
        </h2>
        <div className="space-y-2">
          {MOODS.map((m) => {
            const meta = MOOD_META[m];
            return (
              <div key={m} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: meta.bg }}
                >
                  {meta.emoji}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

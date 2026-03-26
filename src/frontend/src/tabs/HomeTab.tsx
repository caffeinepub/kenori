import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { AllUserData } from "../backend.d";
import AvatarPreview from "../components/AvatarPreview";
import FunTimeCard from "../components/FunTimeCard";
import {
  Mood,
  useAddNote,
  useLogMood,
  useReplaceAllNotes,
} from "../hooks/useQueries";
import type { ActiveTab } from "../types/kenori";
import { CALMING_RESPONSES, MOOD_META } from "../types/kenori";
import { getCalmPoints } from "../utils/calmPoints";
import { formatEntryDate } from "../utils/dateFormat";

interface Props {
  userData: AllUserData | null | undefined;
  isLoading: boolean;
  userName: string;
  onNavigate: (tab: ActiveTab) => void;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const SHORTCUTS: {
  tab: ActiveTab;
  emoji: string;
  label: string;
  desc: string;
}[] = [
  {
    tab: "journal",
    emoji: "📓",
    label: "Write in journal",
    desc: "Pour your heart out",
  },
  {
    tab: "mood",
    emoji: "🌸",
    label: "Mood history",
    desc: "See your patterns",
  },
];

export default function HomeTab({
  userData,
  isLoading,
  userName,
  onNavigate,
}: Props) {
  const logMood = useLogMood();
  const addNote = useAddNote();
  const replaceAllNotes = useReplaceAllNotes();

  const [noteText, setNoteText] = useState("");
  const [dumpText, setDumpText] = useState("");
  const [dumpResponse, setDumpResponse] = useState<string | null>(null);
  const [dumpReleased, setDumpReleased] = useState(false);
  const [calmPoints, setCalmPoints] = useState(() => getCalmPoints());

  useEffect(() => {
    const handler = () => setCalmPoints(getCalmPoints());
    window.addEventListener("calmpoints", handler);
    return () => window.removeEventListener("calmpoints", handler);
  }, []);

  const profile = userData?.profile;
  const avatarId = profile?.avatarHairStyle || "preset_1";

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

  const recentEntries = useMemo(() => {
    if (!userData?.journal) return [];
    return [...userData.journal]
      .sort((a, b) => Number(b.timestamp - a.timestamp))
      .slice(0, 3);
  }, [userData?.journal]);

  const notes = useMemo(
    () => userData?.tasks?.slice(0, 3) || [],
    [userData?.tasks],
  );
  const allNotes = useMemo(() => userData?.tasks || [], [userData?.tasks]);

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

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await addNote.mutateAsync({ text: noteText.trim(), completed: false });
      setNoteText("");
      toast.success("Note added ✅");
    } catch {
      toast.error("Couldn't add note");
    }
  };

  const handleDeleteNote = async (index: number) => {
    const updated = allNotes.filter((_, i) => i !== index);
    try {
      await replaceAllNotes.mutateAsync(updated);
    } catch {
      toast.error("Couldn't delete note");
    }
  };

  const handleDumpRelease = () => {
    if (!dumpText.trim()) return;
    const idx = Math.floor(Math.random() * CALMING_RESPONSES.length);
    setDumpResponse(CALMING_RESPONSES[idx]);
    setDumpReleased(true);
  };

  const handleDumpReset = () => {
    setDumpText("");
    setDumpResponse(null);
    setDumpReleased(false);
  };

  const moods = [
    Mood.happy,
    Mood.excited,
    Mood.neutral,
    Mood.sad,
    Mood.anxious,
  ];

  return (
    <div className="px-5 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="rounded-full bg-muted/50 p-1.5 shrink-0">
          <AvatarPreview avatarId={avatarId} size={44} />
        </div>
        <div className="flex-1">
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {getGreeting()}, {userName} ✨
            </h1>
            {calmPoints > 0 && (
              <span
                data-ocid="home.calm_points.pill"
                className="text-xs text-muted-foreground shrink-0"
              >
                🌙 {calmPoints} calm {calmPoints === 1 ? "point" : "points"}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mood check-in */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="kenori-card space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">
            How are you feeling?
          </h2>
          {todayMood && (
            <span className="text-xs text-muted-foreground">
              {MOOD_META[todayMood]?.emoji} Logged
            </span>
          )}
        </div>
        {isLoading ? (
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2" data-ocid="home.mood.row">
            {moods.map((m) => {
              const meta = MOOD_META[m];
              const sel = todayMood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMoodLog(m)}
                  data-ocid="home.mood.toggle"
                  style={
                    sel
                      ? {
                          background: meta.bg,
                          borderColor: meta.color,
                          color: meta.color,
                        }
                      : {}
                  }
                  className={`mood-chip border-2 ${
                    sel
                      ? "font-semibold"
                      : "bg-muted/60 text-muted-foreground border-transparent"
                  }`}
                >
                  {meta.emoji} {meta.label}
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Recent journal entries */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Recent entries</h2>
          <button
            type="button"
            onClick={() => onNavigate("journal")}
            data-ocid="home.journal.link"
            className="text-sm text-primary font-medium"
          >
            See all →
          </button>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        ) : recentEntries.length === 0 ? (
          <div
            className="kenori-card text-center py-8"
            data-ocid="home.journal.empty_state"
          >
            <p className="text-4xl mb-2">📓</p>
            <p className="text-muted-foreground text-sm">
              No entries yet. Start your first one!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry, i) => {
              const meta = MOOD_META[entry.mood];
              return (
                <div
                  key={entry.timestamp.toString()}
                  className="kenori-card space-y-2"
                  data-ocid={`home.journal.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">
                      {entry.title || "Untitled"}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full shrink-0 font-medium"
                      style={{ background: meta?.bg, color: meta?.color }}
                    >
                      {meta?.emoji} {meta?.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.body}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatEntryDate(entry.timestamp)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Quick Notes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="kenori-card space-y-3"
      >
        <h2 className="font-heading text-lg font-semibold">Quick Notes</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Add a note or reminder…"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            data-ocid="home.notes.input"
            className="rounded-2xl py-4 px-3 text-sm flex-1"
          />
          <Button
            onClick={handleAddNote}
            disabled={!noteText.trim() || addNote.isPending}
            data-ocid="home.notes.add_button"
            size="sm"
            className="rounded-2xl h-10 w-10 p-0 shrink-0"
          >
            {addNote.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isLoading ? (
          <div className="space-y-2" data-ocid="home.notes.loading_state">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-10 rounded-xl" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <p
            className="text-xs text-muted-foreground text-center py-2"
            data-ocid="home.notes.empty_state"
          >
            No notes yet — add your first one above!
          </p>
        ) : (
          <div className="space-y-1.5" data-ocid="home.notes.list">
            <AnimatePresence initial={false}>
              {notes.map((note, i) => (
                <motion.div
                  key={`note-${i}-${note.text.slice(0, 8)}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 py-2 px-3 bg-muted/40 rounded-xl"
                  data-ocid={`home.notes.item.${i + 1}`}
                >
                  <span className="flex-1 text-sm truncate">{note.text}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(i)}
                    data-ocid={`home.notes.delete_button.${i + 1}`}
                    className="text-muted-foreground hover:text-destructive p-1 shrink-0 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {(userData?.tasks?.length || 0) > 3 && (
              <p className="text-xs text-muted-foreground text-center pt-1">
                +{(userData?.tasks?.length || 0) - 3} more notes
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Shortcuts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-2 gap-3"
      >
        {SHORTCUTS.map((item) => (
          <button
            key={item.tab}
            type="button"
            onClick={() => onNavigate(item.tab)}
            data-ocid={`home.${item.tab}.button`}
            className="kenori-card text-left space-y-1 hover:shadow-card transition-shadow active:scale-[0.98]"
          >
            <span className="text-2xl">{item.emoji}</span>
            <p className="font-semibold text-sm text-foreground">
              {item.label}
            </p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </button>
        ))}
      </motion.div>

      {/* Overthink Dump card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="kenori-card space-y-3"
      >
        <div className="space-y-0.5">
          <h2 className="font-heading text-lg font-semibold">
            Overthink Dump 💭
          </h2>
          <p className="text-xs text-muted-foreground">
            Let it all out. No judgment. 🤗
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!dumpReleased ? (
            <motion.div
              key="dump-input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <Textarea
                placeholder="What's spinning in your head?"
                value={dumpText}
                onChange={(e) => setDumpText(e.target.value)}
                data-ocid="home.dump.textarea"
                className="rounded-2xl text-sm min-h-[90px] resize-none px-3 py-2.5"
              />
              <Button
                onClick={handleDumpRelease}
                disabled={!dumpText.trim()}
                data-ocid="home.dump.primary_button"
                className="w-full rounded-full"
                size="sm"
              >
                Release it 💨
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="dump-response"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <div
                className="rounded-2xl py-5 px-4 text-center space-y-2"
                style={{ background: "oklch(var(--accent) / 0.25)" }}
              >
                <div className="text-3xl">🌸</div>
                <p className="font-heading text-base font-semibold text-foreground leading-snug">
                  {dumpResponse}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDumpReset}
                data-ocid="home.dump.secondary_button"
                className="text-xs text-muted-foreground underline w-full text-center"
              >
                Dump again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Today's Fun Time card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <FunTimeCard />
      </motion.div>

      <p className="text-xs text-center text-muted-foreground pb-2">
        © {new Date().getFullYear()}. Built with ♥ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { AllUserData } from "../backend.d";
import {
  Mood,
  useAddJournalEntry,
  useDeleteJournalEntry,
  useEditJournalEntry,
} from "../hooks/useQueries";
import type { JournalEntry } from "../hooks/useQueries";
import { MOOD_META } from "../types/kenori";
import { formatEntryDate } from "../utils/dateFormat";

interface Props {
  userData: AllUserData | null | undefined;
  isLoading: boolean;
}

const MOODS = [Mood.happy, Mood.excited, Mood.neutral, Mood.sad, Mood.anxious];

function EditEntryDialog({
  entry,
  onSave,
}: {
  entry: JournalEntry;
  onSave: (updated: JournalEntry) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const [body, setBody] = useState(entry.body);
  const [mood, setMood] = useState<Mood>(entry.mood as Mood);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!body.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: title.trim() || "Untitled",
        body: body.trim(),
        mood,
        timestamp: entry.timestamp,
      });
      setOpen(false);
      toast.success("Entry updated ✏️");
    } catch {
      toast.error("Couldn't update entry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setTitle(entry.title);
          setBody(entry.body);
          setMood(entry.mood as Mood);
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          data-ocid="journal.edit_button"
          className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[410px] rounded-3xl p-6"
        data-ocid="journal.edit.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Edit Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            placeholder="Title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-ocid="journal.edit.input"
            className="rounded-2xl py-5 px-4 text-base"
          />
          <Textarea
            placeholder="What's on your mind?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            data-ocid="journal.edit.textarea"
            className="rounded-2xl text-base min-h-[120px] resize-none px-4 py-3"
          />
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const meta = MOOD_META[m];
              const sel = mood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
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
          <Button
            onClick={handleSave}
            disabled={!body.trim() || saving}
            data-ocid="journal.edit.save_button"
            className="w-full rounded-full py-5"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function JournalTab({ userData, isLoading }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<Mood>(Mood.neutral);
  const addEntry = useAddJournalEntry();
  const deleteEntry = useDeleteJournalEntry();
  const editEntry = useEditJournalEntry();

  const entries = useMemo(() => {
    if (!userData?.journal) return [];
    return [...userData.journal].sort((a, b) =>
      Number(b.timestamp - a.timestamp),
    );
  }, [userData?.journal]);

  const handleSubmit = async () => {
    if (!body.trim()) return;
    try {
      await addEntry.mutateAsync({
        title: title.trim() || "Untitled",
        body: body.trim(),
        mood,
        timestamp: BigInt(Date.now()) * 1_000_000n,
      });
      setTitle("");
      setBody("");
      setMood(Mood.neutral);
      setOpen(false);
      toast.success("Entry saved 📓");
    } catch {
      toast.error("Couldn't save entry");
    }
  };

  const handleDelete = async (timestamp: bigint) => {
    try {
      await deleteEntry.mutateAsync(timestamp);
      toast.success("Entry deleted");
    } catch {
      toast.error("Couldn't delete entry");
    }
  };

  const handleEdit = async (
    originalTimestamp: bigint,
    updated: JournalEntry,
  ) => {
    await editEntry.mutateAsync({ originalTimestamp, updated });
  };

  return (
    <div className="px-5 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Journal</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="journal.open_modal_button"
              className="rounded-full gap-1"
              size="sm"
            >
              <Plus className="h-4 w-4" /> New Entry
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-[410px] rounded-3xl p-6"
            data-ocid="journal.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">
                New Entry
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <Input
                placeholder="Give it a title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-ocid="journal.input"
                className="rounded-2xl py-5 px-4 text-base"
              />
              <Textarea
                placeholder="What's on your mind today?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                data-ocid="journal.textarea"
                className="rounded-2xl text-base min-h-[140px] resize-none px-4 py-3"
              />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  How are you feeling?
                </p>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => {
                    const meta = MOOD_META[m];
                    const sel = mood === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMood(m)}
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
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!body.trim() || addEntry.isPending}
                data-ocid="journal.submit_button"
                className="w-full rounded-full py-5"
              >
                {addEntry.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save entry 📓"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4" data-ocid="journal.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div
          className="kenori-card text-center py-12"
          data-ocid="journal.empty_state"
        >
          <p className="text-5xl mb-3">📓</p>
          <p className="font-heading text-xl font-semibold mb-1">
            Your journal awaits
          </p>
          <p className="text-muted-foreground text-sm">
            Tap &lsquo;New Entry&rsquo; to write your first thought.
          </p>
        </div>
      ) : (
        <div className="space-y-4" data-ocid="journal.list">
          {entries.map((entry, i) => {
            const meta = MOOD_META[entry.mood];
            return (
              <motion.div
                key={entry.timestamp.toString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="kenori-card space-y-2"
                data-ocid={`journal.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading font-semibold text-lg leading-tight flex-1">
                    {entry.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: meta?.bg, color: meta?.color }}
                    >
                      {meta?.emoji} {meta?.label}
                    </span>
                    <EditEntryDialog
                      entry={entry}
                      onSave={(updated) => handleEdit(entry.timestamp, updated)}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          data-ocid={`journal.delete_button.${i + 1}`}
                          className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        className="max-w-[340px] rounded-3xl"
                        data-ocid="journal.delete.dialog"
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete this entry?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This can't be undone. Your entry will be permanently
                            removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            data-ocid="journal.delete.cancel_button"
                            className="rounded-full"
                          >
                            Keep it
                          </AlertDialogCancel>
                          <AlertDialogAction
                            data-ocid="journal.delete.confirm_button"
                            className="rounded-full bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDelete(entry.timestamp)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
                  {entry.body}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatEntryDate(entry.timestamp)}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

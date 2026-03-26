import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { AllUserData } from "../backend.d";
import { useAddNote } from "../hooks/useQueries";

interface Props {
  userData: AllUserData | null | undefined;
  isLoading: boolean;
}

export default function NotesTab({ userData, isLoading }: Props) {
  const [noteText, setNoteText] = useState("");
  const addNote = useAddNote();

  const [cycleOn, setCycleOn] = useState(
    () => localStorage.getItem("kenori_cycle_on") === "true",
  );
  const [cycleDates, setCycleDates] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("kenori_cycle_dates") || "[]");
    } catch {
      return [];
    }
  });

  const notes = useMemo(() => userData?.tasks || [], [userData?.tasks]);

  const handleAdd = async () => {
    if (!noteText.trim()) return;
    try {
      await addNote.mutateAsync({ text: noteText.trim(), completed: false });
      setNoteText("");
      toast.success("Task added ✅");
    } catch {
      toast.error("Couldn't add task");
    }
  };

  const toggleCycle = (val: boolean) => {
    setCycleOn(val);
    localStorage.setItem("kenori_cycle_on", String(val));
  };

  const markPeriodStart = () => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!cycleDates.includes(today)) {
      const updated = [today, ...cycleDates].slice(0, 12);
      setCycleDates(updated);
      localStorage.setItem("kenori_cycle_dates", JSON.stringify(updated));
      toast.success("Period start logged 🌺");
    } else {
      toast.info("Already logged today");
    }
  };

  const removeCycleDate = (date: string) => {
    const updated = cycleDates.filter((d) => d !== date);
    setCycleDates(updated);
    localStorage.setItem("kenori_cycle_dates", JSON.stringify(updated));
  };

  return (
    <div className="px-5 py-6 space-y-5">
      <h1 className="font-heading text-3xl font-bold">Notes</h1>

      <div className="flex gap-2">
        <Input
          placeholder="Add a task or reminder…"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          data-ocid="notes.input"
          className="rounded-2xl py-5 px-4 text-base flex-1"
        />
        <Button
          onClick={handleAdd}
          disabled={!noteText.trim() || addNote.isPending}
          data-ocid="notes.add_button"
          className="rounded-2xl shrink-0 h-[46px] w-[46px] p-0"
        >
          {addNote.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="notes.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-2xl" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div
          className="kenori-card text-center py-10"
          data-ocid="notes.empty_state"
        >
          <p className="text-4xl mb-2">✅</p>
          <p className="text-muted-foreground text-sm">
            No tasks yet. Add something above!
          </p>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="notes.list">
          <AnimatePresence initial={false}>
            {notes.map((note, i) => (
              <motion.div
                key={note.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="kenori-card flex items-center gap-3 py-3.5"
                data-ocid={`notes.item.${i + 1}`}
              >
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await addNote.mutateAsync({
                        text: note.text,
                        completed: !note.completed,
                      });
                    } catch {
                      toast.error("Couldn't update task");
                    }
                  }}
                  data-ocid={`notes.checkbox.${i + 1}`}
                  className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                    note.completed
                      ? "bg-primary border-primary"
                      : "border-border"
                  }`}
                >
                  {note.completed && (
                    <span className="text-[10px] text-primary-foreground">
                      ✓
                    </span>
                  )}
                </button>
                <span
                  className={`flex-1 text-sm ${note.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {note.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="kenori-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-semibold">
              Cycle Tracking
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Optional feature
            </p>
          </div>
          <Switch
            checked={cycleOn}
            onCheckedChange={toggleCycle}
            data-ocid="notes.cycle.switch"
          />
        </div>
        <AnimatePresence>
          {cycleOn && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <Button
                onClick={markPeriodStart}
                data-ocid="notes.cycle.primary_button"
                variant="outline"
                className="w-full rounded-full border-primary/30 text-primary hover:bg-primary/10"
              >
                🌺 Mark period start today
              </Button>
              {cycleDates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Logged dates
                  </p>
                  {cycleDates.map((date, i) => (
                    <div
                      key={date}
                      className="flex items-center justify-between py-2 px-3 bg-muted/40 rounded-xl"
                      data-ocid={`notes.cycle.item.${i + 1}`}
                    >
                      <span className="text-sm">🌺 {date}</span>
                      <button
                        type="button"
                        onClick={() => removeCycleDate(date)}
                        data-ocid={`notes.cycle.delete_button.${i + 1}`}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

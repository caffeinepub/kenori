import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DailyMood, JournalEntry, Note, UserProfile } from "../backend.d";
import { Mood } from "../backend.d";
import { useActor } from "./useActor";

export { Mood };
export type { JournalEntry, DailyMood, Note, UserProfile };

export function useAllUserData() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allUserData"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAllUserData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      return actor.saveUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUserData"] }),
  });
}

export function useAddJournalEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: JournalEntry) => {
      if (!actor) throw new Error("No actor");
      return actor.addJournalEntry(entry);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUserData"] }),
  });
}

export function useDeleteJournalEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (timestamp: bigint) => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).deleteJournalEntry(timestamp) as Promise<void>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUserData"] }),
  });
}

export function useEditJournalEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      originalTimestamp,
      updated,
    }: {
      originalTimestamp: bigint;
      updated: JournalEntry;
    }) => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).editJournalEntry(
        originalTimestamp,
        updated,
      ) as Promise<void>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUserData"] }),
  });
}

export function useLogMood() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mood: DailyMood) => {
      if (!actor) throw new Error("No actor");
      return actor.logDailyMood(mood);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUserData"] }),
  });
}

export function useAddNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (note: Note) => {
      if (!actor) throw new Error("No actor");
      return actor.addNote(note);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUserData"] }),
  });
}

export function useReplaceAllNotes() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notes: Note[]) => {
      if (!actor) throw new Error("No actor");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).replaceAllNotes(notes) as Promise<void>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUserData"] }),
  });
}

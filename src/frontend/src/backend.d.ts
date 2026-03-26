import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AllUserData {
    tasks: Array<Note>;
    moodLog: Array<DailyMood>;
    journal: Array<JournalEntry>;
    profile: UserProfile;
}
export type Time = bigint;
export interface JournalEntry {
    title: string;
    body: string;
    mood: Mood;
    timestamp: Time;
}
export interface DailyMood {
    mood: Mood;
    timestamp: Time;
}
export interface UserProfile {
    bio: string;
    avatarOutfitColor: string;
    name: string;
    themePreference: string;
    avatarSkinTone: string;
    avatarHairStyle: string;
    profilePhotoUrl?: string;
}
export interface Note {
    text: string;
    completed: boolean;
}
export interface ChatMessage {
    role: string;
    content: string;
    timestamp: Time;
}
export interface ChatMemoryEntry {
    key: string;
    value: string;
    timestamp: Time;
}
export enum Mood {
    sad = "sad",
    anxious = "anxious",
    happy = "happy",
    excited = "excited",
    neutral = "neutral"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addJournalEntry(entry: JournalEntry): Promise<void>;
    deleteJournalEntry(timestamp: Time): Promise<void>;
    editJournalEntry(originalTimestamp: Time, updated: JournalEntry): Promise<void>;
    addNote(note: Note): Promise<void>;
    replaceAllNotes(notes: Array<Note>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllUserData(): Promise<AllUserData | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMoodLogByDay(timestamp: Time): Promise<Array<DailyMood>>;
    getSortedJournalEntries(): Promise<Array<JournalEntry>>;
    getTaskList(): Promise<Array<Note>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logDailyMood(mood: DailyMood): Promise<void>;
    saveUserProfile(profile: UserProfile): Promise<void>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getChatMemories(): Promise<Array<ChatMemoryEntry>>;
    saveChatMemories(entries: Array<ChatMemoryEntry>): Promise<void>;
    sendChatMessage(userMessage: string, memoryContext: string, userName: string): Promise<string>;
    setOpenAIKey(key: string): Promise<void>;
}

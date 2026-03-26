export type ActiveTab = "home" | "journal" | "mood" | "profile";

export const MOOD_META: Record<
  string,
  { label: string; emoji: string; color: string; bg: string }
> = {
  happy: { label: "Good Day", emoji: "🌸", color: "#c05a72", bg: "#f9c6d0" },
  excited: { label: "Excited", emoji: "✨", color: "#b07a10", bg: "#fde8b4" },
  neutral: { label: "Neutral", emoji: "🌙", color: "#6a5acd", bg: "#d4c5f9" },
  sad: { label: "Low Energy", emoji: "🫧", color: "#3a6fa6", bg: "#bdd7f5" },
  anxious: {
    label: "Overthinking",
    emoji: "🌀",
    color: "#c07830",
    bg: "#fdd5b5",
  },
};

export const CALMING_RESPONSES = [
  "You're doing better than you think. 🌷",
  "This moment will pass. You are safe. 🕊️",
  "Take a breath. One thing at a time. 🌬️",
  "Your feelings are valid. You don't have to fix everything today. 🌿",
  "You've handled hard things before. You'll handle this too. 💪",
  "It's okay to not be okay. Be gentle with yourself. 🤍",
  "Rest is productive. You don't always have to be 'on.' 🌙",
  "You are more than your thoughts. 🌸",
  "Small steps still move you forward. 🐾",
  "You showed up today. That already counts. ✨",
];

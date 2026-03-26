export type ActiveTab = "home" | "journal" | "mood" | "profile" | "chat";

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

export const MOOD_FLIP_RESPONSES = [
  "I am still figuring things out, and that's okay.",
  "I don't have to solve everything right now.",
  "I've felt overwhelmed before and found my way through.",
  "This feeling is temporary. I am not stuck forever.",
  "I am allowed to take things one small step at a time.",
  "I don't need to be perfect. I just need to keep going.",
  "I am doing my best with what I have today.",
  "Even on hard days, I am still worthy of care.",
  "I can rest without guilt. Rest is part of healing.",
  "My thoughts are not facts. I can choose a gentler story.",
  "I am safe in this moment, even if things feel uncertain.",
  "Something good is still possible, even today.",
  "I am more resilient than I sometimes remember.",
  "It's okay to feel this way. It doesn't define me.",
  "I trust myself to handle what comes next.",
  "Breathing slowly is enough right now.",
  "I have survived every hard day so far.",
];

export interface FunTimeItem {
  question: string;
  answer: string;
  positiveMessage: string;
}

export function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export const FUN_TIME_DATA: FunTimeItem[] = [
  {
    question:
      "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
    answer: "An echo",
    positiveMessage: "nice thinking 🧠✨",
  },
  {
    question: "The more you take, the more you leave behind. What am I?",
    answer: "Footsteps",
    positiveMessage: "brilliant! 🌟",
  },
  {
    question: "What has hands but can't clap?",
    answer: "A clock",
    positiveMessage: "you've got it 💛",
  },
  {
    question:
      "I'm light as a feather, yet the strongest person can't hold me for more than 5 minutes. What am I?",
    answer: "Breath",
    positiveMessage: "so clever! 🌸",
  },
  {
    question:
      "What comes once in a minute, twice in a moment, but never in a thousand years?",
    answer: "The letter M",
    positiveMessage: "sharp mind! ✨",
  },
  {
    question:
      "I have cities but no houses, forests but no trees, and water but no fish. What am I?",
    answer: "A map",
    positiveMessage: "you figured it out 🗺️",
  },
  {
    question: "What can you catch but not throw?",
    answer: "A cold",
    positiveMessage: "ha! got it 😄✨",
  },
  {
    question: "I have a tail and a head, but no body. What am I?",
    answer: "A coin",
    positiveMessage: "nice one! 💫",
  },
  {
    question: "What gets wetter as it dries?",
    answer: "A towel",
    positiveMessage: "brilliant thinking 🧠",
  },
  {
    question: "I'm tall when I'm young, short when I'm old. What am I?",
    answer: "A candle",
    positiveMessage: "warm and wise 🕯️",
  },
  {
    question: "What has to be broken before you can use it?",
    answer: "An egg",
    positiveMessage: "cracked it! 🥚✨",
  },
  {
    question: "What has one eye but can't see?",
    answer: "A needle",
    positiveMessage: "sharp as a needle 🌟",
  },
  {
    question: "What goes up but never comes down?",
    answer: "Your age",
    positiveMessage: "aging gracefully 😊💛",
  },
  {
    question: "I have keys but no locks. I have space but no room. What am I?",
    answer: "A keyboard",
    positiveMessage: "you're on a roll 🎉",
  },
  {
    question: "What has many teeth but can't bite?",
    answer: "A comb",
    positiveMessage: "well-groomed thinking! 🌸",
  },
  {
    question: "What can travel around the world while staying in a corner?",
    answer: "A stamp",
    positiveMessage: "world traveler brain 🌍✨",
  },
  {
    question: "What has a neck but no head?",
    answer: "A bottle",
    positiveMessage: "bottled brilliance 💫",
  },
  {
    question: "What starts with E, ends with E, but only has one letter in it?",
    answer: "An envelope",
    positiveMessage: "letter perfect! ✉️💛",
  },
  {
    question: "I have branches but no fruit, trunk or leaves. What am I?",
    answer: "A bank",
    positiveMessage: "smart saver! 🧠🌟",
  },
  {
    question: "What is full of holes but still holds water?",
    answer: "A sponge",
    positiveMessage: "soaking it all in 🌸",
  },
  {
    question: "The more you have of it, the less you see. What is it?",
    answer: "Darkness",
    positiveMessage: "you light up the room 💡✨",
  },
  {
    question: "What has four fingers and a thumb but is not alive?",
    answer: "A glove",
    positiveMessage: "fits perfectly! 🧤💛",
  },
  {
    question: "What runs but never walks, has a mouth but never talks?",
    answer: "A river",
    positiveMessage: "going with the flow 🌊✨",
  },
  {
    question:
      "I'm not alive but I grow. I don't have lungs but I need air. What am I?",
    answer: "Fire",
    positiveMessage: "you're on fire! 🔥🌟",
  },
  {
    question: "What invention lets you look right through a wall?",
    answer: "A window",
    positiveMessage: "clear thinking! 🪟💛",
  },
  {
    question: "What disappears as soon as you say its name?",
    answer: "Silence",
    positiveMessage: "quietly brilliant 🤫✨",
  },
  {
    question: "I go in hard, come out soft, and you blow me. What am I?",
    answer: "Chewing gum",
    positiveMessage: "chewy and clever! 🌸",
  },
  {
    question:
      "What is as light as a feather but even the world's strongest person can't hold it for long?",
    answer: "Breath",
    positiveMessage: "breathe it in 🧘✨",
  },
  {
    question: "What comes down but never goes up?",
    answer: "Rain",
    positiveMessage: "sunny disposition! ☔💛",
  },
  {
    question: "I have a face and two hands but no arms or legs. What am I?",
    answer: "A clock",
    positiveMessage: "great timing! ⏰🌟",
  },
  {
    question: "What can you keep after giving it to someone?",
    answer: "Your word",
    positiveMessage: "words of wisdom 💬✨",
  },
  {
    question: "The more it dries, the wetter it gets. What is it?",
    answer: "A towel",
    positiveMessage: "wrapped up in brilliance 🛁💛",
  },
];

export function getTodaysFunTime(): FunTimeItem {
  const day = getDayOfYear();
  return FUN_TIME_DATA[day % FUN_TIME_DATA.length];
}

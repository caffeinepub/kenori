import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_AVATAR_ID } from "@/config/avatarPresets";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AvatarPreview from "./AvatarPreview";
import AvatarSelectorGrid from "./AvatarSelectorGrid";

interface Props {
  onComplete: (
    name: string,
    theme: "light" | "dark",
    avatarId: string,
  ) => Promise<void>;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [avatarId, setAvatarId] = useState(DEFAULT_AVATAR_ID);
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onComplete(name.trim(), theme, avatarId);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="mx-auto max-w-[430px] w-full">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-8"
            >
              <div className="space-y-3">
                <div className="text-7xl">🌸</div>
                <h1 className="font-heading text-5xl font-bold text-foreground">
                  kenori
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed">
                  a soft space for your thoughts, feelings, and all the little
                  things that matter
                </p>
              </div>
              <Button
                onClick={() => setStep(1)}
                data-ocid="onboarding.primary_button"
                className="w-full rounded-full py-6 text-base font-semibold"
              >
                Let's get started ✨
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="text-4xl">💌</div>
                <h2 className="font-heading text-3xl font-bold text-foreground">
                  What should we call you?
                </h2>
                <p className="text-muted-foreground text-sm">
                  This is your space — make it yours.
                </p>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Your name…"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && name.trim() && setStep(2)
                  }
                  data-ocid="onboarding.input"
                  className="rounded-2xl py-5 text-base px-5 border-border bg-card"
                  autoFocus
                />
                <Button
                  onClick={() => setStep(2)}
                  disabled={!name.trim()}
                  data-ocid="onboarding.submit_button"
                  className="w-full rounded-full py-6 text-base font-semibold"
                >
                  Continue →
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="text-4xl">🎨</div>
                <h2 className="font-heading text-3xl font-bold text-foreground">
                  Choose your vibe
                </h2>
                <p className="text-muted-foreground text-sm">
                  You can always change this later.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  data-ocid="onboarding.light.toggle"
                  className={`kenori-card flex flex-col items-center gap-3 py-8 cursor-pointer transition-all border-2 ${
                    theme === "light"
                      ? "border-primary shadow-card"
                      : "border-transparent"
                  }`}
                >
                  <span className="text-3xl">☀️</span>
                  <span className="font-semibold text-foreground">Light</span>
                  <span className="text-xs text-muted-foreground">
                    Soft & airy
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  data-ocid="onboarding.dark.toggle"
                  className={`kenori-card flex flex-col items-center gap-3 py-8 cursor-pointer transition-all border-2 ${
                    theme === "dark"
                      ? "border-primary shadow-card"
                      : "border-transparent"
                  }`}
                >
                  <span className="text-3xl">🌙</span>
                  <span className="font-semibold text-foreground">Dark</span>
                  <span className="text-xs text-muted-foreground">
                    Calm & cozy
                  </span>
                </button>
              </div>
              <Button
                onClick={() => setStep(3)}
                data-ocid="onboarding.continue_button"
                className="w-full rounded-full py-6 text-base font-semibold"
              >
                Continue →
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <AvatarPreview avatarId={avatarId} size={72} />
                </div>
                <div className="space-y-1">
                  <h2 className="font-heading text-3xl font-bold text-foreground">
                    🪞 Choose your avatar
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Pick the one that feels like you.
                  </p>
                </div>
              </div>
              <AvatarSelectorGrid selected={avatarId} onChange={setAvatarId} />
              <Button
                onClick={handleFinish}
                disabled={saving}
                data-ocid="onboarding.save_button"
                className="w-full rounded-full py-6 text-base font-semibold"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting
                    up…
                  </>
                ) : (
                  `Let's go 🌸`
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

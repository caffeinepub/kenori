import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="mx-auto max-w-[430px] w-full text-center space-y-8">
        <div className="space-y-2">
          <div className="text-6xl mb-4">🌸</div>
          <h1 className="font-heading text-5xl font-bold text-foreground tracking-tight">
            kenori
          </h1>
          <p className="text-muted-foreground font-body text-base">
            your soft little corner of the internet
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {[
            "📓 Journal",
            "🌸 Mood Tracker",
            "✅ Notes",
            "💭 Overthink Dump",
          ].map((f) => (
            <span
              key={f}
              className="px-3 py-1.5 bg-primary/20 text-foreground rounded-full text-sm font-medium"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="kenori-card space-y-4">
          <p className="text-foreground font-body text-sm leading-relaxed">
            Sign in to start your journey. Your journal is private and stored
            securely on the Internet Computer.
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            data-ocid="login.primary_button"
            className="w-full rounded-full py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "✨ Begin your journey"
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
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
    </div>
  );
}

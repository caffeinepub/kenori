import { User } from "lucide-react";
import type { ActiveTab } from "../types/kenori";

const TABS: { id: ActiveTab; label: string; emoji: string; icon?: boolean }[] =
  [
    { id: "home", label: "Home", emoji: "🏠" },
    { id: "journal", label: "Journal", emoji: "📓" },
    { id: "mood", label: "Mood", emoji: "🌸" },
    { id: "profile", label: "Profile", emoji: "", icon: true },
    { id: "chat", label: "Chat", emoji: "💬" },
  ];

interface Props {
  active: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

export default function TabBar({ active, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border shadow-card z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-1 py-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            data-ocid={`nav.${tab.id}.link`}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all min-w-[52px] ${
              active === tab.id
                ? "bg-primary/20 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon ? (
              <User
                size={20}
                className={`transition-transform ${
                  active === tab.id ? "scale-110" : ""
                }`}
              />
            ) : (
              <span
                className={`text-xl transition-transform ${
                  active === tab.id ? "scale-110" : ""
                }`}
              >
                {tab.emoji}
              </span>
            )}
            <span
              className={`text-[10px] font-medium ${
                active === tab.id ? "text-foreground" : ""
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

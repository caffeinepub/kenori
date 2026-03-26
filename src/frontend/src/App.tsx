import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import LoginScreen from "./components/LoginScreen";
import Onboarding from "./components/Onboarding";
import TabBar from "./components/TabBar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useAllUserData, useSaveProfile } from "./hooks/useQueries";
import HomeTab from "./tabs/HomeTab";
import JournalTab from "./tabs/JournalTab";
import MoodTab from "./tabs/MoodTab";
import ProfileTab from "./tabs/ProfileTab";
import type { ActiveTab } from "./types/kenori";

export default function App() {
  const { loginStatus, isInitializing } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success";

  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [onboarded, setOnboarded] = useState(
    () => !!localStorage.getItem("kenori_onboarded"),
  );
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (
      (localStorage.getItem("kenori_theme") as "light" | "dark") || "light"
    );
  });

  const { data: userData, isLoading } = useAllUserData();
  const saveProfile = useSaveProfile();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    if (userData?.profile?.themePreference) {
      const t = userData.profile.themePreference as "light" | "dark";
      setTheme(t);
      localStorage.setItem("kenori_theme", t);
    }
  }, [userData?.profile?.themePreference]);

  const handleOnboardingComplete = async (
    name: string,
    chosenTheme: "light" | "dark",
  ) => {
    setTheme(chosenTheme);
    localStorage.setItem("kenori_theme", chosenTheme);
    localStorage.setItem("kenori_name", name);
    await saveProfile.mutateAsync({
      name,
      themePreference: chosenTheme,
      bio: "",
      avatarHairStyle: "short",
      avatarSkinTone: "medium",
      avatarOutfitColor: "pink",
    });
    localStorage.setItem("kenori_onboarded", "true");
    setOnboarded(true);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">🌸</div>
          <p className="text-muted-foreground font-body">Loading KENORI…</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen />
        <Toaster />
      </>
    );
  }

  if (!onboarded) {
    return (
      <>
        <Onboarding onComplete={handleOnboardingComplete} />
        <Toaster />
      </>
    );
  }

  const userName =
    userData?.profile?.name || localStorage.getItem("kenori_name") || "you";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[430px] min-h-screen relative bg-background shadow-card">
        <main className="tab-bar-safe overflow-y-auto">
          {activeTab === "home" && (
            <HomeTab
              userData={userData}
              isLoading={isLoading}
              userName={userName}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === "journal" && (
            <JournalTab userData={userData} isLoading={isLoading} />
          )}
          {activeTab === "mood" && (
            <MoodTab userData={userData} isLoading={isLoading} />
          )}
          {activeTab === "profile" && (
            <ProfileTab userData={userData} isLoading={isLoading} />
          )}
        </main>
        <TabBar active={activeTab} onChange={setActiveTab} />
      </div>
      <Toaster />
    </div>
  );
}

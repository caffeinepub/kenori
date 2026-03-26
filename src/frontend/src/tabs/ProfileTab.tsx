import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_AVATAR_ID } from "@/config/avatarPresets";
import { Camera, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { AllUserData } from "../backend.d";
import AvatarPreview from "../components/AvatarPreview";
import AvatarSelectorGrid from "../components/AvatarSelectorGrid";
import { useSaveProfile } from "../hooks/useQueries";
import { useStorageClient } from "../hooks/useStorageClient";

interface Props {
  userData: AllUserData | null | undefined;
  isLoading: boolean;
}

export default function ProfileTab({ userData, isLoading }: Props) {
  const profile = userData?.profile;
  const saveProfile = useSaveProfile();
  const storageClient = useStorageClient();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [avatarId, setAvatarId] = useState(
    profile?.avatarHairStyle || DEFAULT_AVATAR_ID,
  );
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(
    profile?.profilePhotoUrl,
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storageClient) return;
    setIsUploadingPhoto(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes);
      const url = await storageClient.getDirectURL(hash);
      setPhotoUrl(url);
      toast.success("Photo uploaded! Save your profile to keep it.");
    } catch {
      toast.error("Photo upload failed");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveProfile.mutateAsync({
        name: name || profile?.name || "",
        bio,
        themePreference: profile?.themePreference || "light",
        avatarHairStyle: avatarId,
        avatarSkinTone: profile?.avatarSkinTone || "medium",
        avatarOutfitColor: profile?.avatarOutfitColor || "pink",
        profilePhotoUrl: photoUrl,
      });
      toast.success("Profile saved 🌸");
    } catch {
      toast.error("Couldn't save profile");
    }
  };

  if (isLoading) {
    return (
      <div className="px-5 py-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="px-5 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-heading text-3xl font-bold text-foreground">
          My Profile 🌸
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Personalize your KENORI experience
        </p>
      </motion.div>

      {/* Avatar Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="kenori-card space-y-4"
        data-ocid="profile.avatar.card"
      >
        <div className="flex items-center gap-3">
          <AvatarPreview avatarId={avatarId} size={56} />
          <div>
            <h2 className="font-heading text-lg font-semibold">Your Avatar</h2>
            <p className="text-xs text-muted-foreground">Tap to change</p>
          </div>
        </div>
        <AvatarSelectorGrid selected={avatarId} onChange={setAvatarId} />
      </motion.div>

      {/* About Me */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="kenori-card space-y-5"
        data-ocid="profile.about.card"
      >
        <h2 className="font-heading text-lg font-semibold">About Me</h2>

        {/* Profile Photo */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted/50 flex items-center justify-center border-2 border-border">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <AvatarPreview avatarId={avatarId} size={80} />
              )}
            </div>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={isUploadingPhoto}
              data-ocid="profile.upload_button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
            >
              {isUploadingPhoto ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Camera size={12} />
              )}
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              data-ocid="profile.dropzone"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {name || "Your name"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tap the camera to change photo
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            data-ocid="profile.name.input"
            className="rounded-xl"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-bio" className="text-sm font-medium">
            Bio
          </Label>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A little about you..."
            data-ocid="profile.bio.textarea"
            rows={3}
            className="rounded-xl resize-none"
          />
        </div>
      </motion.div>

      {/* Save */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={handleSave}
          disabled={saveProfile.isPending}
          data-ocid="profile.save.submit_button"
          className="w-full rounded-2xl h-12 text-base font-semibold"
        >
          {saveProfile.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Changes 🌸"
          )}
        </Button>
      </motion.div>

      <p className="text-xs text-center text-muted-foreground pb-2">
        © {new Date().getFullYear()}. Built with ♥ using{" "}
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
  );
}

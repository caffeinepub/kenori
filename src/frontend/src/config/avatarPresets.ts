export interface AvatarPreset {
  id: string;
  label: string;
  src: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "preset_1",
    label: "Short Hoodie",
    src: "/assets/generated/avatar_1.dim_200x200.png",
  },
  {
    id: "preset_2",
    label: "Long Sweater",
    src: "/assets/generated/avatar_2.dim_200x200.png",
  },
  {
    id: "preset_3",
    label: "Wavy Dress",
    src: "/assets/generated/avatar_3.dim_200x200.png",
  },
  {
    id: "preset_4",
    label: "Bun Kurti",
    src: "/assets/generated/avatar_4.dim_200x200.png",
  },
  {
    id: "preset_5",
    label: "Ponytail Tee",
    src: "/assets/generated/avatar_5.dim_200x200.png",
  },
  {
    id: "preset_6",
    label: "Auburn Knit",
    src: "/assets/generated/avatar_6.dim_200x200.png",
  },
  {
    id: "preset_7",
    label: "Curly Shirt",
    src: "/assets/generated/avatar_7.dim_200x200.png",
  },
  {
    id: "preset_8",
    label: "Bun Dress",
    src: "/assets/generated/avatar_8.dim_200x200.png",
  },
];

export const DEFAULT_AVATAR_ID = "preset_1";

export function getAvatarSrc(presetId: string | undefined): string {
  const preset = AVATAR_PRESETS.find((p) => p.id === presetId);
  return preset?.src ?? AVATAR_PRESETS[0].src;
}

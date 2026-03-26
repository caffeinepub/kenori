import { AVATAR_PRESETS } from "@/config/avatarPresets";

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export default function AvatarSelectorGrid({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {AVATAR_PRESETS.map((preset, i) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onChange(preset.id)}
          data-ocid={`avatar.item.${i + 1}`}
          className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all duration-150 ${
            selected === preset.id
              ? "border-primary shadow-md scale-105"
              : "border-transparent opacity-80 hover:opacity-100"
          }`}
        >
          <img
            src={preset.src}
            alt={preset.label}
            className="w-full h-full object-cover object-top"
            draggable={false}
          />
          {selected === preset.id && (
            <div className="absolute inset-0 bg-primary/10 flex items-end justify-center pb-1">
              <span className="text-[10px] font-semibold text-primary bg-background/80 rounded-full px-1.5 py-0.5">
                ✓
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

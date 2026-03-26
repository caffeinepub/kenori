import { getAvatarSrc } from "@/config/avatarPresets";

interface Props {
  avatarId?: string;
  size?: number;
  className?: string;
}

export default function AvatarPreview({
  avatarId,
  size = 80,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-full overflow-hidden bg-muted flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={getAvatarSrc(avatarId)}
        alt="Your avatar"
        className="w-full h-full object-cover object-top"
        draggable={false}
      />
    </div>
  );
}

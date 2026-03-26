interface AvatarPreviewProps {
  hairStyle?: string;
  skinTone?: string;
  outfitColor?: string; // stores outfit type: hoodie | tshirt | sweater | kurti | dress | shirt
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: 52, md: 100, lg: 156 };

// Natural skin tones: base, shadow, highlight
const SKIN: Record<string, [string, string, string]> = {
  porcelain: ["#F5DDC8", "#D9B898", "#FFF0E4"],
  light: ["#EEC9A0", "#C9A06A", "#F8DFBE"],
  medium: ["#C88C5E", "#A06838", "#DDA87A"],
  tan: ["#B07438", "#885218", "#C88E50"],
  brown: ["#7A4828", "#58300E", "#9A6040"],
  deep: ["#4A2510", "#2C0E00", "#6A3820"],
};

// Hair — single warm dark brown with shine
const H = { b: "#2C1A0C", m: "#4A2E18", s: "#7A4E30" };

// Lip color relative to skin
const LIP: Record<string, string> = {
  porcelain: "#D4937A",
  light: "#C2784E",
  medium: "#9A5030",
  tan: "#863818",
  brown: "#5E2010",
  deep: "#3A0C00",
};

// Outfit types
const OUTFIT: Record<string, { c: string; d: string; a: string }> = {
  hoodie: { c: "#88A8C0", d: "#5A7A98", a: "#A8C4D8" },
  tshirt: { c: "#B8A898", d: "#887868", a: "#D4C8BC" },
  sweater: { c: "#9888B8", d: "#685888", a: "#BCB0D4" },
  kurti: { c: "#88A898", d: "#587868", a: "#ACCAB8" },
  dress: { c: "#B88898", d: "#886878", a: "#D4AABC" },
  shirt: { c: "#8898B8", d: "#587088", a: "#AABCCC" },
};

// ── Hair layer rendered BEHIND the face ────────────────────────────────────
function BackHair({ style, cy }: { style: string; cy: number }) {
  const base = H.b;
  if (style === "short") {
    // Tight cap — barely visible behind head
    return <ellipse cx="100" cy={cy - 6} rx="54" ry="52" fill={base} />;
  }
  if (style === "long") {
    return (
      <g>
        <ellipse cx="100" cy={cy - 6} rx="55" ry="54" fill={base} />
        {/* Side panels */}
        <rect x="43" y={cy + 30} width="20" height="110" rx="10" fill={base} />
        <rect x="137" y={cy + 30} width="20" height="110" rx="10" fill={base} />
      </g>
    );
  }
  if (style === "waves") {
    return (
      <g>
        <ellipse cx="100" cy={cy - 6} rx="55" ry="54" fill={base} />
        {/* Wavy left panel */}
        <path
          d={`M 43 ${cy + 35} Q 38 ${cy + 65} 45 ${cy + 90} Q 38 ${cy + 115} 43 ${cy + 140} L 63 ${cy + 140} Q 60 ${cy + 112} 65 ${cy + 90} Q 58 ${cy + 64} 63 ${cy + 35} Z`}
          fill={base}
        />
        {/* Wavy right panel */}
        <path
          d={`M 157 ${cy + 35} Q 162 ${cy + 65} 155 ${cy + 90} Q 162 ${cy + 115} 157 ${cy + 140} L 137 ${cy + 140} Q 140 ${cy + 112} 135 ${cy + 90} Q 142 ${cy + 64} 137 ${cy + 35} Z`}
          fill={base}
        />
      </g>
    );
  }
  if (style === "ponytail") {
    return (
      <g>
        <ellipse cx="100" cy={cy - 6} rx="54" ry="52" fill={base} />
        {/* Ponytail tail going up from back of head */}
        <path
          d={`M 100 ${cy - 54} Q 80 ${cy - 80} 88 ${cy - 108} Q 96 ${cy - 124} 100 ${cy - 124} Q 104 ${cy - 124} 112 ${cy - 108} Q 120 ${cy - 80} 100 ${cy - 54}`}
          fill={H.m}
        />
      </g>
    );
  }
  // bun
  return (
    <g>
      <ellipse cx="100" cy={cy - 6} rx="53" ry="51" fill={base} />
    </g>
  );
}

// ── Hair layer rendered IN FRONT of the face ───────────────────────────────
function FrontHair({ style, cy }: { style: string; cy: number }) {
  const base = H.b;
  const mid = H.m;
  const shine = H.s;

  if (style === "short") {
    // Soft hairline with subtle fringe
    return (
      <g>
        <path
          d={`M 50 ${cy - 30} Q 52 ${cy - 54} 100 ${cy - 56} Q 148 ${cy - 54} 150 ${cy - 30}`}
          fill={base}
          strokeLinecap="round"
        />
        {/* Shine strip */}
        <path
          d={`M 80 ${cy - 52} Q 100 ${cy - 58} 120 ${cy - 52}`}
          stroke={shine}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
    );
  }

  if (style === "long") {
    return (
      <g>
        <path
          d={`M 50 ${cy - 30} Q 52 ${cy - 54} 100 ${cy - 56} Q 148 ${cy - 54} 150 ${cy - 30}`}
          fill={base}
        />
        {/* Centre part line */}
        <path
          d={`M 100 ${cy - 56} L 100 ${cy - 36}`}
          stroke={mid}
          strokeWidth="2"
          fill="none"
        />
        {/* Shine */}
        <path
          d={`M 78 ${cy - 52} Q 89 ${cy - 58} 100 ${cy - 57} Q 111 ${cy - 58} 122 ${cy - 52}`}
          stroke={shine}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
    );
  }

  if (style === "waves") {
    return (
      <g>
        <path
          d={`M 50 ${cy - 28} Q 54 ${cy - 50} 100 ${cy - 54} Q 146 ${cy - 50} 150 ${cy - 28}`}
          fill={base}
        />
        {/* Wavy highlights */}
        <path
          d={`M 70 ${cy - 50} Q 82 ${cy - 56} 94 ${cy - 52} Q 106 ${cy - 58} 118 ${cy - 52} Q 126 ${cy - 50} 130 ${cy - 48}`}
          stroke={shine}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
    );
  }

  if (style === "ponytail") {
    return (
      <g>
        {/* Pulled back cap — smooth with centre part */}
        <path
          d={`M 50 ${cy - 20} Q 54 ${cy - 54} 100 ${cy - 56} Q 146 ${cy - 54} 150 ${cy - 20}`}
          fill={base}
        />
        <path
          d={`M 100 ${cy - 56} L 100 ${cy - 44}`}
          stroke={mid}
          strokeWidth="2"
          fill="none"
        />
        {/* Hair elastic */}
        <ellipse cx="100" cy={cy - 58} rx="8" ry="5" fill={mid} />
        <ellipse
          cx="100"
          cy={cy - 58}
          rx="5"
          ry="3"
          fill={shine}
          opacity="0.4"
        />
      </g>
    );
  }

  // bun
  return (
    <g>
      {/* Pulled-back cap */}
      <path
        d={`M 52 ${cy - 18} Q 55 ${cy - 53} 100 ${cy - 56} Q 145 ${cy - 53} 148 ${cy - 18}`}
        fill={base}
      />
      {/* Bun circle */}
      <circle cx="100" cy={cy - 65} r="18" fill={mid} />
      <circle cx="100" cy={cy - 65} r="14" fill={base} />
      {/* Bun shine */}
      <ellipse
        cx="96"
        cy={cy - 72}
        rx="6"
        ry="3.5"
        fill={shine}
        opacity="0.45"
        transform="rotate(-20, 96, -72)"
      />
      {/* Wispy strands */}
      <path
        d={`M 86 ${cy - 54} Q 80 ${cy - 60} 82 ${cy - 50}`}
        stroke={mid}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M 114 ${cy - 54} Q 120 ${cy - 60} 118 ${cy - 50}`}
        stroke={mid}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

// ── Outfit / upper body ────────────────────────────────────────────────────
function OutfitBody({
  type,
  neckX1,
  neckX2,
  neckY,
}: { type: string; neckX1: number; neckX2: number; neckY: number }) {
  const o = OUTFIT[type] ?? OUTFIT.tshirt;

  // Shared torso shape
  const torso = `M 28 ${neckY + 8} Q 44 ${neckY + 2} ${neckX1} ${neckY} L ${neckX2} ${neckY} Q 156 ${neckY + 2} 172 ${neckY + 8} L 176 260 L 24 260 Z`;

  if (type === "hoodie") {
    return (
      <g>
        <path d={torso} fill={o.c} />
        {/* Hood/kangaroo pocket area */}
        <rect
          x="82"
          y="198"
          width="36"
          height="16"
          rx="4"
          fill={o.d}
          opacity="0.5"
        />
        {/* Front drawstrings */}
        <line
          x1="97"
          y1="172"
          x2="93"
          y2="200"
          stroke={o.d}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="103"
          y1="172"
          x2="107"
          y2="200"
          stroke={o.d}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* U-neck */}
        <path
          d={`M ${neckX1} ${neckY} Q ${neckX1} ${neckY + 18} 100 ${neckY + 22} Q ${neckX2} ${neckY + 18} ${neckX2} ${neckY}`}
          fill={o.a}
          opacity="0.3"
        />
      </g>
    );
  }

  if (type === "tshirt") {
    return (
      <g>
        <path d={torso} fill={o.c} />
        {/* Crew neck */}
        <path
          d={`M ${neckX1} ${neckY} Q ${neckX1} ${neckY + 14} 100 ${neckY + 17} Q ${neckX2} ${neckY + 14} ${neckX2} ${neckY}`}
          fill={o.a}
          opacity="0.35"
        />
        {/* Shoulder seams */}
        <line
          x1="48"
          y1={neckY + 6}
          x2="38"
          y2={neckY + 22}
          stroke={o.d}
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="152"
          y1={neckY + 6}
          x2="162"
          y2={neckY + 22}
          stroke={o.d}
          strokeWidth="1"
          opacity="0.5"
        />
      </g>
    );
  }

  if (type === "sweater") {
    // Ribbed turtleneck
    return (
      <g>
        <path d={torso} fill={o.c} />
        {/* Turtleneck collar */}
        <rect
          x={neckX1 - 4}
          y={neckY - 16}
          width={neckX2 - neckX1 + 8}
          height="22"
          rx="6"
          fill={o.c}
        />
        {/* Ribbing lines on collar */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={neckX1 - 2}
            y1={neckY - 14 + i * 6}
            x2={neckX2 + 2}
            y2={neckY - 14 + i * 6}
            stroke={o.d}
            strokeWidth="1"
            opacity="0.4"
          />
        ))}
        {/* Sweater bottom ribbing hint */}
        <rect
          x="28"
          y="242"
          width="144"
          height="8"
          rx="0"
          fill={o.d}
          opacity="0.2"
        />
      </g>
    );
  }

  if (type === "kurti") {
    // Mandarin / band collar, A-line shape
    return (
      <g>
        <path d={torso} fill={o.c} />
        {/* Mandarin collar — two upright rectangles */}
        <rect
          x={neckX1 - 2}
          y={neckY - 12}
          width={neckX2 - neckX1 + 4}
          height="16"
          rx="5"
          fill={o.c}
        />
        <line
          x1="100"
          y1={neckY - 12}
          x2="100"
          y2={neckY + 40}
          stroke={o.d}
          strokeWidth="1.5"
          opacity="0.5"
        />
        {/* Block print stripe detail */}
        <rect
          x="35"
          y={neckY + 50}
          width="130"
          height="6"
          rx="2"
          fill={o.d}
          opacity="0.25"
        />
        <rect
          x="35"
          y={neckY + 64}
          width="130"
          height="6"
          rx="2"
          fill={o.d}
          opacity="0.18"
        />
      </g>
    );
  }

  if (type === "dress") {
    // Scoop neck / flowing
    return (
      <g>
        <path d={torso} fill={o.c} />
        {/* Scoop neck */}
        <path
          d={`M ${neckX1} ${neckY} Q ${neckX1 - 4} ${neckY + 22} 100 ${neckY + 28} Q ${neckX2 + 4} ${neckY + 22} ${neckX2} ${neckY}`}
          fill={o.a}
          opacity="0.35"
        />
        {/* A-line flare hint at bottom */}
        <path
          d={"M 60 220 Q 60 250 48 260 L 152 260 Q 140 250 140 220"}
          fill={o.a}
          opacity="0.2"
        />
      </g>
    );
  }

  // shirt (button-down)
  return (
    <g>
      <path d={torso} fill={o.c} />
      {/* Collar left */}
      <path
        d={`M 100 ${neckY} L ${neckX1} ${neckY} L ${neckX1} ${neckY + 14} L 100 ${neckY + 8} Z`}
        fill={o.a}
      />
      {/* Collar right */}
      <path
        d={`M 100 ${neckY} L ${neckX2} ${neckY} L ${neckX2} ${neckY + 14} L 100 ${neckY + 8} Z`}
        fill={o.a}
      />
      {/* Button placket */}
      <line
        x1="100"
        y1={neckY + 8}
        x2="100"
        y2="240"
        stroke={o.d}
        strokeWidth="1.5"
        opacity="0.5"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx="100"
          cy={neckY + 24 + i * 20}
          r="2"
          fill={o.d}
          opacity="0.7"
        />
      ))}
    </g>
  );
}

export default function AvatarPreview({
  hairStyle = "short",
  skinTone = "medium",
  outfitColor = "tshirt",
  size = "md",
}: AvatarPreviewProps) {
  const dim = SIZE_MAP[size] ?? SIZE_MAP.md;

  const [skinBase, skinShadow, skinLight] = SKIN[skinTone] ?? SKIN.medium;
  const lipColor = LIP[skinTone] ?? LIP.medium;

  // Face geometry (in 200×260 coordinate space)
  const FCX = 100;
  const FCY = 90;
  const FRX = 50;
  const FRY = 55;

  const eyeY = 84;
  const eyeLX = 82;
  const eyeRX = 118;

  const browsY = 71;

  const noseY = 106;

  const lipTopY = 120;
  const lipBotY = 130;

  const neckX1 = 90;
  const neckX2 = 110;
  const neckY1 = FCY + FRY - 4; // ≈141
  const neckY2 = neckY1 + 24; // ≈165

  const bodyTop = neckY2 - 8;

  const gradId = `sg-${skinTone}`;
  const shadowId = `sh-${skinTone}`;

  return (
    <svg
      width={dim}
      height={Math.round(dim * (260 / 200))}
      viewBox="0 0 200 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Avatar"
    >
      <defs>
        {/* Skin highlight gradient */}
        <radialGradient id={gradId} cx="42%" cy="38%" r="55%">
          <stop offset="0%" stopColor={skinLight} />
          <stop offset="60%" stopColor={skinBase} />
          <stop offset="100%" stopColor={skinShadow} />
        </radialGradient>
        {/* Subtle neck shadow */}
        <linearGradient id={shadowId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skinBase} />
          <stop offset="100%" stopColor={skinShadow} />
        </linearGradient>
      </defs>

      {/* ── OUTFIT / BODY ── */}
      <OutfitBody
        type={outfitColor}
        neckX1={neckX1}
        neckX2={neckX2}
        neckY={bodyTop}
      />

      {/* ── NECK ── */}
      <rect
        x={neckX1}
        y={neckY1}
        width={neckX2 - neckX1}
        height={neckY2 - neckY1}
        rx="4"
        fill={`url(#${shadowId})`}
      />

      {/* ── BACK HAIR ── */}
      <BackHair style={hairStyle} cy={FCY} />

      {/* ── HEAD / FACE ── */}
      <ellipse cx={FCX} cy={FCY} rx={FRX} ry={FRY} fill={`url(#${gradId})`} />

      {/* ── FRONT HAIR ── */}
      <FrontHair style={hairStyle} cy={FCY} />

      {/* ── EYEBROWS ── */}
      <path
        d={`M ${eyeLX - 12} ${browsY + 2} Q ${eyeLX} ${browsY - 5} ${eyeLX + 12} ${browsY + 1}`}
        stroke={H.b}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${eyeRX - 12} ${browsY + 1} Q ${eyeRX} ${browsY - 5} ${eyeRX + 12} ${browsY + 2}`}
        stroke={H.b}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── EYES ── */}
      {/* Left eye white */}
      <path
        d={`M ${eyeLX - 11} ${eyeY} Q ${eyeLX - 5} ${eyeY - 7} ${eyeLX} ${eyeY - 7} Q ${eyeLX + 5} ${eyeY - 7} ${eyeLX + 11} ${eyeY} Q ${eyeLX + 5} ${eyeY + 7} ${eyeLX} ${eyeY + 6} Q ${eyeLX - 5} ${eyeY + 7} ${eyeLX - 11} ${eyeY} Z`}
        fill="#F6F0EA"
      />
      {/* Left iris */}
      <circle cx={eyeLX} cy={eyeY} r="5.5" fill="#4A3020" />
      {/* Left pupil */}
      <circle cx={eyeLX} cy={eyeY} r="3" fill="#1A0C04" />
      {/* Left eye shine */}
      <circle cx={eyeLX + 2} cy={eyeY - 2} r="1.6" fill="#FFFFFF" />
      {/* Left top lash line */}
      <path
        d={`M ${eyeLX - 11} ${eyeY} Q ${eyeLX} ${eyeY - 9} ${eyeLX + 11} ${eyeY}`}
        stroke="#2A1008"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right eye white */}
      <path
        d={`M ${eyeRX - 11} ${eyeY} Q ${eyeRX - 5} ${eyeY - 7} ${eyeRX} ${eyeY - 7} Q ${eyeRX + 5} ${eyeY - 7} ${eyeRX + 11} ${eyeY} Q ${eyeRX + 5} ${eyeY + 7} ${eyeRX} ${eyeY + 6} Q ${eyeRX - 5} ${eyeY + 7} ${eyeRX - 11} ${eyeY} Z`}
        fill="#F6F0EA"
      />
      {/* Right iris */}
      <circle cx={eyeRX} cy={eyeY} r="5.5" fill="#4A3020" />
      {/* Right pupil */}
      <circle cx={eyeRX} cy={eyeY} r="3" fill="#1A0C04" />
      {/* Right eye shine */}
      <circle cx={eyeRX + 2} cy={eyeY - 2} r="1.6" fill="#FFFFFF" />
      {/* Right top lash line */}
      <path
        d={`M ${eyeRX - 11} ${eyeY} Q ${eyeRX} ${eyeY - 9} ${eyeRX + 11} ${eyeY}`}
        stroke="#2A1008"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── NOSE (subtle) ── */}
      <path
        d={`M ${FCX - 4} ${noseY} Q ${FCX - 6} ${noseY + 6} ${FCX - 3} ${noseY + 8}`}
        stroke={skinShadow}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d={`M ${FCX + 4} ${noseY} Q ${FCX + 6} ${noseY + 6} ${FCX + 3} ${noseY + 8}`}
        stroke={skinShadow}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* ── LIPS ── */}
      {/* Upper lip */}
      <path
        d={`M ${FCX - 13} ${lipTopY} Q ${FCX - 7} ${lipTopY - 5} ${FCX} ${lipTopY - 3} Q ${FCX + 7} ${lipTopY - 5} ${FCX + 13} ${lipTopY} Q ${FCX + 7} ${lipTopY + 3} ${FCX} ${lipTopY + 3} Q ${FCX - 7} ${lipTopY + 3} ${FCX - 13} ${lipTopY} Z`}
        fill={lipColor}
        opacity="0.85"
      />
      {/* Lower lip */}
      <path
        d={`M ${FCX - 13} ${lipTopY} Q ${FCX - 8} ${lipBotY} ${FCX} ${lipBotY} Q ${FCX + 8} ${lipBotY} ${FCX + 13} ${lipTopY}`}
        fill={lipColor}
        opacity="0.75"
      />
      {/* Lip center line */}
      <line
        x1={FCX - 13}
        y1={lipTopY}
        x2={FCX + 13}
        y2={lipTopY}
        stroke={skinShadow}
        strokeWidth="0.8"
        opacity="0.4"
      />
      {/* Lower lip highlight */}
      <ellipse
        cx={FCX}
        cy={lipTopY + 6}
        rx="6"
        ry="2.5"
        fill="#FFFFFF"
        opacity="0.18"
      />
    </svg>
  );
}

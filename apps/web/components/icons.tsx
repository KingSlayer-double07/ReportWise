// ─── Centralized Icon Components ─────────────────────────────────────────────
// All icons accept an optional `className` for Tailwind sizing/coloring.

interface IconProps {
  className?: string;
}

export const MenuIcon = ({ className }: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const XIcon = ({ className }: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface ArrowRightProps extends IconProps {
  size?: number;
}

export const ArrowRight = ({ size = 16, className }: ArrowRightProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ChevronDown = ({ className }: IconProps) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const LogoMark = ({ className }: IconProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    className={className}
  >
    <rect width="32" height="32" rx="8" fill="#0c1c37" />
    <rect x="7" y="8" width="12" height="2.5" rx="1.25" fill="gold" />
    <rect x="7" y="13" width="18" height="2.5" rx="1.25" fill="gold" opacity="0.7" />
    <rect x="7" y="18" width="10" height="2.5" rx="1.25" fill="gold" opacity="0.5" />
    <rect x="19" y="16" width="6" height="8" rx="1" fill="gold" />
  </svg>
);

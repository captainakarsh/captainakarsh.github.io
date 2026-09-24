import type { SVGProps } from "react";

// Stroke icons adapted from Lucide (ISC license).
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function make(paths: React.ReactNode, displayName: string) {
  const Icon = ({ size = 18, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths}
    </svg>
  );
  Icon.displayName = displayName;
  return Icon;
}

export const ArrowRight = make(<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>, "ArrowRight");
export const ArrowUpRight = make(<><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>, "ArrowUpRight");
export const ArrowUp = make(<><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></>, "ArrowUp");
export const Github = make(
  <>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </>,
  "Github",
);
export const Linkedin = make(
  <>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </>,
  "Linkedin",
);
export const Mail = make(
  <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
  "Mail",
);
export const Sun = make(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </>,
  "Sun",
);
export const Moon = make(<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />, "Moon");
export const Search = make(<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>, "Search");
export const Menu = make(<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>, "Menu");
export const X = make(<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>, "X");
export const Sparkles = make(
  <>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" />
  </>,
  "Sparkles",
);
export const Send = make(<><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>, "Send");
export const Copy = make(
  <><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>,
  "Copy",
);
export const Check = make(<path d="M20 6 9 17l-5-5" />, "Check");
export const MapPin = make(
  <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  "MapPin",
);
export const Clock = make(<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>, "Clock");
export const Briefcase = make(
  <><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" /></>,
  "Briefcase",
);
export const Code = make(<><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></>, "Code");
export const Trophy = make(
  <>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </>,
  "Trophy",
);
export const GraduationCap = make(
  <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
  "GraduationCap",
);
export const Award = make(
  <><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></>,
  "Award",
);
export const Loader = make(<path d="M21 12a9 9 0 1 1-6.219-8.56" />, "Loader");
export const FileText = make(
  <>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
  </>,
  "FileText",
);
export const Play = make(<path d="M6 3 20 12 6 21Z" />, "Play");
export const Globe = make(
  <>
    <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
  </>,
  "Globe",
);
export const Zap = make(
  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />,
  "Zap",
);
export const Printer = make(
  <>
    <path d="M6 9V2h12v7" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </>,
  "Printer",
);
export const CornerDownLeft = make(<><path d="m9 10-5 5 5 5" /><path d="M20 4v7a4 4 0 0 1-4 4H4" /></>, "CornerDownLeft");
export const RotateCcw = make(<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></>, "RotateCcw");
export const Square = make(<rect width="14" height="14" x="5" y="5" rx="2" />, "Square");
export const Layers = make(
  <>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </>,
  "Layers",
);
export const Terminal = make(<><path d="m4 17 6-6-6-6" /><path d="M12 19h8" /></>, "Terminal");
export const Server = make(
  <>
    <rect width="20" height="8" x="2" y="2" rx="2" /><rect width="20" height="8" x="2" y="14" rx="2" />
    <path d="M6 6h.01" /><path d="M6 18h.01" />
  </>,
  "Server",
);
export const Star = ({ size = 14, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

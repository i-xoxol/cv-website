const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Line icons for research themes, keyed by theme id. */
export function ThemeIcon({ id }: { id: string }) {
  switch (id) {
    case "metadata-privacy":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" {...common}>
          <circle cx="6" cy="16" r="2.5" />
          <circle cx="26" cy="7" r="2.2" />
          <circle cx="26" cy="16" r="2.2" />
          <circle cx="26" cy="25" r="2.2" />
          <path d="M8.5 16h6M14.5 16l9-8M14.5 16h9M14.5 16l9 8" strokeDasharray="2 2.4" />
          <path d="M14.5 16l9-8" />
        </svg>
      );
    case "ai-security":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" {...common}>
          <rect x="9" y="9" width="14" height="14" rx="2.5" />
          <path d="M13 3v6M19 3v6M13 23v6M19 23v6M3 13h6M3 19h6M23 13h6M23 19h6" />
          <path d="M13.5 18.5l2-5 2 5M14.2 17h2.6M19.5 13.5v5" />
        </svg>
      );
    case "data-quality":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" {...common}>
          <circle cx="16" cy="16" r="2.4" />
          <path d="M11 11a7 7 0 0 0 0 10M21 11a7 7 0 0 1 0 10M7.2 7.2a12.5 12.5 0 0 0 0 17.6M24.8 7.2a12.5 12.5 0 0 1 0 17.6" />
        </svg>
      );
    case "android-security":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" {...common}>
          <rect x="8" y="3" width="16" height="26" rx="3" />
          <path d="M14 6h4" />
          <path d="M16 12l5 2v4c0 3-2.2 5-5 6-2.8-1-5-3-5-6v-4z" />
        </svg>
      );
    case "bec":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" {...common}>
          <rect x="3" y="7" width="22" height="16" rx="2.5" />
          <path d="M3.5 8.5l10.5 8 10.5-8" />
          <circle cx="25" cy="23" r="5" />
          <path d="M25 20.6v2.8M25 25.3v.1" />
        </svg>
      );
    default:
      return null;
  }
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...common}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...common}>
      <path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9" />
    </svg>
  );
}

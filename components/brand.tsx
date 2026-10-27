export function IglooMark({
  className = "",
  decorative = true,
}: {
  className?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Igloo"}
    >
      <path d="M4 43a28 28 0 0 1 56 0H4Z" fill="currentColor" />
      <path
        d="M4 32h56M11 20h42M20 9h24M19 20l-3 12M44 20l4 12M30 9v11M31 20v12M16 32v11M48 32v11"
        stroke="var(--logo-line, #fff)"
        strokeWidth="2.5"
      />
      <path d="M24 45V34a8 8 0 0 1 16 0v11" fill="var(--logo-line, #fff)" />
    </svg>
  );
}
export function GithubMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.59c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

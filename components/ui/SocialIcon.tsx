export type SocialPlatform = "instagram" | "telegram" | "youtube" | "facebook";

const PATHS: Record<SocialPlatform, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  telegram: (
    <path d="M21.5 3.5 2.75 10.9c-1 .4-1 1.86.03 2.22l4.1 1.42 1.6 5.16c.28.9 1.42 1.16 2.06.46l2.28-2.47 4.4 3.24c.86.63 2.1.17 2.33-.87l3.13-14.5c.26-1.2-.93-2.2-2.13-1.86Zm-3.1 3.63-8.1 7.35-.34 3.5-1.53-4.94 9.97-5.91Z" />
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14 8.5h2.2V5.3h-2.5c-2.4 0-3.7 1.5-3.7 3.8v1.9H7.8v3.2H10V21h3V14.2h2.2l.5-3.2H13v-1.6c0-.6.2-.9.9-.9Z" />
  ),
};

export function SocialIcon({
  platform,
  size = 16,
  className,
}: {
  platform: SocialPlatform;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[platform]}
    </svg>
  );
}

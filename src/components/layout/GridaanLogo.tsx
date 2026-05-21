export default function GridaanLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="GridaanLogoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#071428" />
          <stop offset="45%" stopColor="#1344b7" />
          <stop offset="100%" stopColor="#2E84FF" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#GridaanLogoGradient)" />
      <path
        d="M30.5 16.5H19.5C16.5 16.5 14 19 14 22v4c0 3 2.5 5.5 5.5 5.5h6.5v3.5c0 0.9 0.7 1.5 1.5 1.5h3c0.8 0 1.5-0.7 1.5-1.5v-3.5h2.5c2.8 0 5-2.2 5-5v-4c0-2.8-2.2-5-5-5Zm-1.5 5.5H19.5V22c0-1.1 0.9-2 2-2h8c1.1 0 2 0.9 2 2v0.5Z"
        fill="white"
        opacity="0.92"
      />
      <path
        d="M15 22.5C15 19.4 17.4 17 20.5 17h8c3.1 0 5.5 2.4 5.5 5.5v2.5c0 3.1-2.4 5.5-5.5 5.5H29"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

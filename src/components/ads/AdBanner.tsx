interface AdBannerProps {
  position: 'header' | 'sidebar' | 'in-article' | 'footer' | 'sticky-mobile';
  className?: string;
}

export default function AdBanner({ position, className = '' }: AdBannerProps) {
  const sizes: Record<string, string> = {
    'header': 'h-24 md:h-28',
    'sidebar': 'h-64',
    'in-article': 'h-24 md:h-28',
    'footer': 'h-24',
    'sticky-mobile': 'h-16',
  };

  return (
    <div className={`relative bg-[#0B1224] dark:bg-[#0B1224]/50 rounded-xl overflow-hidden border border-[#1E293B]/50 dark:border-[#1E293B]/50 ${sizes[position]} ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-2 text-[#94A3B8] dark:text-[#94A3B8]">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
            <path d="M3 9h6" />
          </svg>
          <span className="text-xs font-medium uppercase tracking-wider">Advertisement</span>
        </div>
        <div className="text-[10px] text-[#94A3B8] dark:text-gray-600">Google AdSense • {position.replace('-', ' ')}</div>
        <div className="mt-1 px-3 py-1 bg-gray-200/50 dark:bg-[#0B1224]/50 rounded text-[10px] text-[#94A3B8] dark:text-[#94A3B8]">
          728×90 / 300×250 / Responsive
        </div>
      </div>
      {/* In production, this would contain the actual AdSense code:
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXX"
          data-ad-slot="XXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
    </div>
  );
}

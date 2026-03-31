// PrismLogo — Faceted prism mark with rainbow refraction
// Matches brand ref: triangular prism with colored light entering from left

export function PrismLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="RunCouncil logo"
    >
      <defs>
        <linearGradient id="prism-face-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#16213e" />
        </linearGradient>
        <linearGradient id="prism-face-2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0f3460" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>
        <linearGradient id="prism-face-3" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#16213e" />
          <stop offset="100%" stopColor="#0a0a1a" />
        </linearGradient>
        <linearGradient id="spectrum" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="20%" stopColor="#f97316" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="80%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* Rainbow light beam entering from left */}
      <line x1="2" y1="20" x2="13" y2="20" stroke="url(#spectrum)" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      {/* Prism - 3 faces */}
      <polygon points="20,6 12,34 28,34" fill="url(#prism-face-1)" />
      <polygon points="20,6 28,34 34,22" fill="url(#prism-face-2)" />
      <polygon points="20,6 12,34 28,34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      {/* Refracted light beams exiting right */}
      <line x1="30" y1="14" x2="38" y2="10" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="31" y1="17" x2="38" y2="15" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="32" y1="20" x2="38" y2="20" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="31" y1="23" x2="38" y2="25" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="30" y1="26" x2="38" y2="30" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      {/* Subtle highlight on prism */}
      <polygon points="20,8 15,28 20,28" fill="rgba(255,255,255,0.06)" />
    </svg>
  );
}

export function PrismLogoFull({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <PrismLogo size={size} />
      <span className="text-lg font-semibold tracking-tight text-[#111111] dark:text-white">
        RunCouncil
      </span>
    </div>
  );
}

export default PrismLogo;

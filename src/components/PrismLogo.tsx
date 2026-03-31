// PrismLogo — Horizontal logo mark: multiple colored lines converge into one white output
// Brand: orange → yellow → blue gradient, left → right, geometric

export function PrismLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  const w = size * 1.5;
  const h = size;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="RunCouncil"
    >
      <defs>
        <linearGradient id="rc-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      {/* Input lines — multiple colored, fanning in from left */}
      <line x1="0" y1="4" x2="20" y2="14" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      <line x1="0" y1="10" x2="20" y2="14.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <line x1="0" y1="16" x2="20" y2="16" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
      <line x1="0" y1="22" x2="20" y2="17.5" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
      <line x1="0" y1="28" x2="20" y2="18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      {/* Convergence point — small prism triangle */}
      <polygon points="20,10 20,22 30,16" fill="none" stroke="url(#rc-grad)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Output line — single, bold, dark */}
      <line x1="30" y1="16" x2="48" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function PrismLogoFull({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <PrismLogo size={size} />
      <span className="text-lg font-semibold tracking-tight text-[#111111] dark:text-white">
        RunCouncil
      </span>
    </div>
  );
}

export default PrismLogo;

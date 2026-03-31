// PrismLogo — Faceted geometric logo mark
// Three colored triangular facets: red/orange, gold, dark teal

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
      {/* Top-left facet — red/orange */}
      <polygon points="4,28 20,4 20,28" fill="#E84D3D" />
      {/* Top-right facet — gold/amber */}
      <polygon points="20,4 36,28 20,28" fill="#F5A623" />
      {/* Bottom facet — dark teal */}
      <polygon points="4,28 36,28 20,38" fill="#1A8A7D" />
    </svg>
  );
}

export function PrismLogoFull({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <PrismLogo size={size} />
      <span className="text-[22px] font-bold tracking-tight text-[#1A1A2E] dark:text-white">
        RunCouncil
      </span>
    </div>
  );
}

export default PrismLogo;

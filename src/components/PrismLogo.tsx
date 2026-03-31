// PrismLogo — Using the actual generated logo image
import Image from "next/image";

export function PrismLogo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo-icon.png"
      alt="RunCouncil"
      width={size * 1.8}
      height={size}
      className={className}
      priority
    />
  );
}

export function PrismLogoFull({ height = 32, className = "" }: { height?: number; className?: string }) {
  return (
    <Image
      src="/logo-full.png"
      alt="RunCouncil"
      width={Math.round(height * 4.2)}
      height={height}
      className={className}
      priority
    />
  );
}

export default PrismLogo;

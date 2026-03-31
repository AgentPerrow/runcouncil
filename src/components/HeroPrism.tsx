// HeroPrism — Photorealistic prism image for the hero section
import Image from "next/image";

export default function HeroPrism({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Image
        src="/hero-prism.png"
        alt="Light refracting through a prism — multiple perspectives, one clear answer"
        width={435}
        height={288}
        className="w-full h-auto"
        priority
      />
    </div>
  );
}

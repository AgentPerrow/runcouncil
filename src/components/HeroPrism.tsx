// HeroPrism — Large decorative prism illustration for the hero section
// Photorealistic-style dark glass prism with rainbow light refraction

export default function HeroPrism({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          {/* Prism face gradients */}
          <linearGradient id="hero-face-left" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1c1c3a" />
            <stop offset="50%" stopColor="#0e0e24" />
            <stop offset="100%" stopColor="#18182f" />
          </linearGradient>
          <linearGradient id="hero-face-right" x1="0" y1="0" x2="1" y2="0.8">
            <stop offset="0%" stopColor="#1a1a35" />
            <stop offset="100%" stopColor="#0d0d20" />
          </linearGradient>
          <linearGradient id="hero-face-front" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#252550" />
            <stop offset="100%" stopColor="#0f0f25" />
          </linearGradient>
          
          {/* Incoming light beam */}
          <linearGradient id="hero-beam-in" x1="0" y1="0.3" x2="1" y2="0.5">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0.3" />
          </linearGradient>

          {/* Rainbow spectrum for output beams */}
          <linearGradient id="hero-spectrum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff3333" />
            <stop offset="16%" stopColor="#ff8800" />
            <stop offset="33%" stopColor="#ffcc00" />
            <stop offset="50%" stopColor="#33cc33" />
            <stop offset="66%" stopColor="#3399ff" />
            <stop offset="83%" stopColor="#6633ff" />
            <stop offset="100%" stopColor="#9933ff" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Surface reflection gradient */}
          <linearGradient id="surface-fade" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#111122" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#111122" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Subtle surface/ground plane */}
        <ellipse cx="200" cy="290" rx="160" ry="20" fill="url(#surface-fade)" />

        {/* Incoming white light beam */}
        <polygon 
          points="0,140 0,160 145,175 145,165" 
          fill="url(#hero-beam-in)" 
          opacity="0.6"
        />
        
        {/* Glow where beam hits prism */}
        <circle cx="148" cy="170" r="12" fill="white" opacity="0.15" filter="url(#glow)" />

        {/* PRISM — 3D triangular prism */}
        {/* Left face */}
        <polygon points="200,60 130,270 200,280" fill="url(#hero-face-left)" />
        {/* Right face */}
        <polygon points="200,60 270,270 200,280" fill="url(#hero-face-right)" />
        {/* Front/bottom connecting face */}
        <polygon points="130,270 270,270 200,280" fill="url(#hero-face-front)" />
        
        {/* Edge highlights */}
        <line x1="200" y1="60" x2="130" y2="270" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="200" y1="60" x2="270" y2="270" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="130" y1="270" x2="270" y2="270" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        
        {/* Internal reflection / highlight */}
        <polygon points="200,70 155,240 200,245" fill="rgba(255,255,255,0.03)" />
        <polygon points="200,80 175,200 200,205" fill="rgba(255,255,255,0.02)" />

        {/* Refracted rainbow beams exiting right side */}
        {/* Red */}
        <line x1="255" y1="140" x2="380" y2="80" stroke="#ff3333" strokeWidth="3" strokeLinecap="round" opacity="0.7" filter="url(#soft-glow)" />
        <line x1="255" y1="140" x2="380" y2="80" stroke="#ff3333" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        
        {/* Orange */}
        <line x1="258" y1="155" x2="390" y2="110" stroke="#ff8800" strokeWidth="3" strokeLinecap="round" opacity="0.7" filter="url(#soft-glow)" />
        <line x1="258" y1="155" x2="390" y2="110" stroke="#ff8800" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        
        {/* Yellow */}
        <line x1="260" y1="170" x2="400" y2="145" stroke="#ffcc00" strokeWidth="3" strokeLinecap="round" opacity="0.7" filter="url(#soft-glow)" />
        <line x1="260" y1="170" x2="400" y2="145" stroke="#ffcc00" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        
        {/* Green */}
        <line x1="262" y1="185" x2="400" y2="180" stroke="#33cc33" strokeWidth="3" strokeLinecap="round" opacity="0.7" filter="url(#soft-glow)" />
        <line x1="262" y1="185" x2="400" y2="180" stroke="#33cc33" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        
        {/* Blue */}
        <line x1="260" y1="200" x2="395" y2="215" stroke="#3399ff" strokeWidth="3" strokeLinecap="round" opacity="0.7" filter="url(#soft-glow)" />
        <line x1="260" y1="200" x2="395" y2="215" stroke="#3399ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        
        {/* Violet */}
        <line x1="257" y1="215" x2="385" y2="250" stroke="#7733ff" strokeWidth="3" strokeLinecap="round" opacity="0.6" filter="url(#soft-glow)" />
        <line x1="257" y1="215" x2="385" y2="250" stroke="#7733ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

        {/* Subtle prism glow on right side */}
        <circle cx="270" cy="180" r="30" fill="white" opacity="0.04" filter="url(#glow)" />
      </svg>
    </div>
  );
}

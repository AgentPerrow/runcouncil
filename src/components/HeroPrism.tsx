// HeroPrism — High-quality 3D-style prism with rainbow refraction
// CSS gradient approach with SVG for the beams

export default function HeroPrism({ className = "" }: { className?: string }) {
  return (
    <div className={`relative select-none ${className}`}>
      <div className="relative w-full max-w-[560px] mx-auto" style={{ aspectRatio: "16/11" }}>
        <svg
          viewBox="0 0 560 385"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Prism face gradients - dark glass look */}
            <linearGradient id="hp-left" x1="0.3" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#1e1e3f" />
              <stop offset="40%" stopColor="#12122a" />
              <stop offset="100%" stopColor="#1a1a38" />
            </linearGradient>
            <linearGradient id="hp-right" x1="0.5" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#252548" />
              <stop offset="50%" stopColor="#1a1a35" />
              <stop offset="100%" stopColor="#141430" />
            </linearGradient>
            <linearGradient id="hp-bottom" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#1a1a38" />
              <stop offset="100%" stopColor="#0e0e22" />
            </linearGradient>
            
            {/* White input beam gradient */}
            <linearGradient id="hp-beam-in" x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="0.15" />
              <stop offset="100%" stopColor="white" stopOpacity="0.5" />
            </linearGradient>

            {/* Glow filters */}
            <filter id="hp-glow-sm">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="hp-glow-md">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="hp-glow-lg">
              <feGaussianBlur stdDeviation="10" />
            </filter>

            {/* Beam glow colors */}
            <linearGradient id="hp-beam-rainbow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="20%" stopColor="#f97316" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="60%" stopColor="#22c55e" />
              <stop offset="80%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>

            {/* Surface reflection */}
            <radialGradient id="hp-shadow" cx="0.45" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#111128" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#111128" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ground shadow / reflection */}
          <ellipse cx="260" cy="325" rx="180" ry="28" fill="url(#hp-shadow)" />

          {/* === INCOMING WHITE BEAM === */}
          <polygon 
            points="0,175 0,195 195,195 195,185" 
            fill="url(#hp-beam-in)" 
          />
          {/* Beam glow */}
          <line x1="0" y1="190" x2="195" y2="190" stroke="white" strokeWidth="8" opacity="0.06" filter="url(#hp-glow-lg)" />

          {/* Incoming rainbow hint - subtle color separation near prism */}
          <line x1="120" y1="182" x2="195" y2="178" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" />
          <line x1="120" y1="185" x2="195" y2="183" stroke="#f97316" strokeWidth="1.5" opacity="0.4" />
          <line x1="120" y1="188" x2="195" y2="188" stroke="#eab308" strokeWidth="1.5" opacity="0.4" />
          <line x1="120" y1="191" x2="195" y2="193" stroke="#22c55e" strokeWidth="1.5" opacity="0.4" />
          <line x1="120" y1="194" x2="195" y2="198" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
          <line x1="120" y1="197" x2="195" y2="203" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.3" />

          {/* === PRISM — 3D triangular === */}
          {/* Left face (darker) */}
          <polygon points="260,55 180,310 260,320" fill="url(#hp-left)" />
          {/* Right face (slightly lighter) */}
          <polygon points="260,55 340,310 260,320" fill="url(#hp-right)" />
          {/* Bottom face (depth) */}
          <polygon points="180,310 340,310 260,320" fill="url(#hp-bottom)" />
          
          {/* Edge highlights */}
          <line x1="260" y1="55" x2="180" y2="310" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          <line x1="260" y1="55" x2="340" y2="310" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1="180" y1="310" x2="340" y2="310" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="180" y1="310" x2="260" y2="320" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="340" y1="310" x2="260" y2="320" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* Internal reflections */}
          <polygon points="260,68 198,275 260,280" fill="rgba(255,255,255,0.025)" />
          <polygon points="260,90 215,240 255,245" fill="rgba(255,255,255,0.015)" />

          {/* Glow at entry point */}
          <circle cx="195" cy="190" r="15" fill="white" opacity="0.08" filter="url(#hp-glow-md)" />

          {/* === REFRACTED BEAMS EXITING RIGHT === */}
          {/* Each beam: glow layer + sharp line */}
          
          {/* Red */}
          <line x1="330" y1="155" x2="540" y2="80" stroke="#ef4444" strokeWidth="6" opacity="0.15" filter="url(#hp-glow-md)" />
          <line x1="330" y1="155" x2="540" y2="80" stroke="#ef4444" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
          
          {/* Orange */}
          <line x1="333" y1="170" x2="548" y2="115" stroke="#f97316" strokeWidth="6" opacity="0.15" filter="url(#hp-glow-md)" />
          <line x1="333" y1="170" x2="548" y2="115" stroke="#f97316" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
          
          {/* Yellow */}
          <line x1="335" y1="185" x2="555" y2="155" stroke="#eab308" strokeWidth="6" opacity="0.15" filter="url(#hp-glow-md)" />
          <line x1="335" y1="185" x2="555" y2="155" stroke="#eab308" strokeWidth="2.5" opacity="0.75" strokeLinecap="round" />
          
          {/* Green */}
          <line x1="336" y1="200" x2="555" y2="197" stroke="#22c55e" strokeWidth="6" opacity="0.15" filter="url(#hp-glow-md)" />
          <line x1="336" y1="200" x2="555" y2="197" stroke="#22c55e" strokeWidth="2.5" opacity="0.65" strokeLinecap="round" />
          
          {/* Blue */}
          <line x1="335" y1="215" x2="550" y2="240" stroke="#3b82f6" strokeWidth="6" opacity="0.15" filter="url(#hp-glow-md)" />
          <line x1="335" y1="215" x2="550" y2="240" stroke="#3b82f6" strokeWidth="2.5" opacity="0.65" strokeLinecap="round" />
          
          {/* Violet */}
          <line x1="332" y1="228" x2="540" y2="278" stroke="#8b5cf6" strokeWidth="6" opacity="0.12" filter="url(#hp-glow-md)" />
          <line x1="332" y1="228" x2="540" y2="278" stroke="#8b5cf6" strokeWidth="2.5" opacity="0.55" strokeLinecap="round" />

          {/* Exit glow */}
          <circle cx="340" cy="190" r="25" fill="white" opacity="0.04" filter="url(#hp-glow-lg)" />
        </svg>
      </div>
    </div>
  );
}

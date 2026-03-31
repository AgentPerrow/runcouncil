// HeroPrism — Large 3D-style prism with rainbow refraction for hero section

export default function HeroPrism({ className = "" }: { className?: string }) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 600 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="hp-fl" x1="0.3" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#1e1e3f" />
            <stop offset="40%" stopColor="#12122a" />
            <stop offset="100%" stopColor="#1a1a38" />
          </linearGradient>
          <linearGradient id="hp-fr" x1="0.5" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#252548" />
            <stop offset="50%" stopColor="#1a1a35" />
            <stop offset="100%" stopColor="#141430" />
          </linearGradient>
          <linearGradient id="hp-fb" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#1a1a38" />
            <stop offset="100%" stopColor="#0e0e22" />
          </linearGradient>
          <linearGradient id="hp-bi" x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="40%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0.6" />
          </linearGradient>
          <filter id="hp-g1"><feGaussianBlur stdDeviation="3" /></filter>
          <filter id="hp-g2"><feGaussianBlur stdDeviation="6" /></filter>
          <filter id="hp-g3"><feGaussianBlur stdDeviation="10" /></filter>
          <radialGradient id="hp-sh" cx="0.42" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#111128" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#111128" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="280" cy="355" rx="200" ry="30" fill="url(#hp-sh)" />

        {/* Incoming white beam */}
        <polygon points="0,195 0,215 210,212 210,198" fill="url(#hp-bi)" />
        <line x1="0" y1="205" x2="210" y2="205" stroke="white" strokeWidth="10" opacity="0.04" filter="url(#hp-g3)" />

        {/* Rainbow hint near prism entry */}
        <line x1="100" y1="196" x2="210" y2="190" stroke="#ef4444" strokeWidth="2" opacity="0.5" />
        <line x1="100" y1="199" x2="210" y2="196" stroke="#f97316" strokeWidth="2" opacity="0.5" />
        <line x1="100" y1="202" x2="210" y2="202" stroke="#eab308" strokeWidth="2" opacity="0.5" />
        <line x1="100" y1="205" x2="210" y2="208" stroke="#22c55e" strokeWidth="2" opacity="0.5" />
        <line x1="100" y1="208" x2="210" y2="214" stroke="#3b82f6" strokeWidth="2" opacity="0.45" />
        <line x1="100" y1="211" x2="210" y2="220" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" />

        {/* Entry glow */}
        <circle cx="215" cy="205" r="18" fill="white" opacity="0.1" filter="url(#hp-g2)" />

        {/* PRISM */}
        <polygon points="280,60 195,340 365,340" fill="url(#hp-fl)" />
        <polygon points="280,60 365,340 420,260" fill="url(#hp-fr)" />
        <polygon points="195,340 365,340 280,355" fill="url(#hp-fb)" />

        {/* Edge highlights */}
        <line x1="280" y1="60" x2="195" y2="340" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="280" y1="60" x2="365" y2="340" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="280" y1="60" x2="420" y2="260" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <line x1="365" y1="340" x2="420" y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
        <line x1="195" y1="340" x2="365" y2="340" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* Internal reflections */}
        <polygon points="280,72 215,300 280,305" fill="rgba(255,255,255,0.025)" />
        <polygon points="280,95 235,255 275,260" fill="rgba(255,255,255,0.015)" />

        {/* REFRACTED BEAMS exiting right */}
        {/* Red */}
        <line x1="385" y1="155" x2="580" y2="80" stroke="#ef4444" strokeWidth="8" opacity="0.12" filter="url(#hp-g2)" />
        <line x1="385" y1="155" x2="580" y2="80" stroke="#ef4444" strokeWidth="3" opacity="0.75" strokeLinecap="round" />

        {/* Orange */}
        <line x1="390" y1="175" x2="590" y2="120" stroke="#f97316" strokeWidth="8" opacity="0.12" filter="url(#hp-g2)" />
        <line x1="390" y1="175" x2="590" y2="120" stroke="#f97316" strokeWidth="3" opacity="0.75" strokeLinecap="round" />

        {/* Yellow */}
        <line x1="393" y1="195" x2="595" y2="165" stroke="#eab308" strokeWidth="8" opacity="0.12" filter="url(#hp-g2)" />
        <line x1="393" y1="195" x2="595" y2="165" stroke="#eab308" strokeWidth="3" opacity="0.8" strokeLinecap="round" />

        {/* Green */}
        <line x1="393" y1="215" x2="595" y2="210" stroke="#22c55e" strokeWidth="8" opacity="0.12" filter="url(#hp-g2)" />
        <line x1="393" y1="215" x2="595" y2="210" stroke="#22c55e" strokeWidth="3" opacity="0.7" strokeLinecap="round" />

        {/* Blue */}
        <line x1="390" y1="235" x2="590" y2="258" stroke="#3b82f6" strokeWidth="8" opacity="0.12" filter="url(#hp-g2)" />
        <line x1="390" y1="235" x2="590" y2="258" stroke="#3b82f6" strokeWidth="3" opacity="0.7" strokeLinecap="round" />

        {/* Violet */}
        <line x1="385" y1="252" x2="580" y2="300" stroke="#8b5cf6" strokeWidth="8" opacity="0.1" filter="url(#hp-g2)" />
        <line x1="385" y1="252" x2="580" y2="300" stroke="#8b5cf6" strokeWidth="3" opacity="0.6" strokeLinecap="round" />

        {/* Exit glow */}
        <circle cx="395" cy="205" r="35" fill="white" opacity="0.03" filter="url(#hp-g3)" />
      </svg>
    </div>
  );
}

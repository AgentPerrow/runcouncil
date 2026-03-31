// HeroPrism — CSS 3D prism with gradient beams
// Uses CSS transforms for real 3D depth, not flat SVG

export default function HeroPrism({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ perspective: "1200px" }}>
      {/* Container with 3D space */}
      <div className="relative w-full" style={{ height: "380px" }}>
        
        {/* Incoming light beams */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[40%] h-[120px] overflow-hidden">
          {/* White converging beam */}
          <div 
            className="absolute inset-0" 
            style={{
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.4))",
              clipPath: "polygon(0% 20%, 100% 42%, 100% 58%, 0% 80%)",
            }}
          />
          {/* Subtle rainbow separation near prism */}
          <div 
            className="absolute right-0 top-0 w-[60%] h-full" 
            style={{
              background: "linear-gradient(to bottom, #ef444466, #f9731666, #eab30866, #22c55e66, #3b82f666, #8b5cf666)",
              clipPath: "polygon(0% 25%, 100% 40%, 100% 60%, 0% 75%)",
              filter: "blur(1px)",
            }}
          />
        </div>

        {/* 3D Prism using CSS transforms */}
        <div 
          className="absolute left-[28%] top-1/2 -translate-y-[55%]"
          style={{ 
            transformStyle: "preserve-3d",
            transform: "rotateY(-20deg) rotateX(5deg)",
            width: "160px",
            height: "280px",
          }}
        >
          {/* Front face */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(165deg, #252548 0%, #12122a 40%, #1a1a38 100%)",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              transform: "translateZ(40px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Surface reflection */}
            <div 
              className="absolute inset-0"
              style={{
                background: "linear-gradient(170deg, rgba(255,255,255,0.08) 0%, transparent 40%)",
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
          </div>

          {/* Right face */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #1a1a35 0%, #0d0d20 60%, #141430 100%)",
              clipPath: "polygon(50% 0%, 100% 100%, 100% 0%)",
              transform: "rotateY(55deg) translateZ(70px)",
              transformOrigin: "right center",
            }}
          />

          {/* Left face */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(195deg, #1e1e3f 0%, #0e0e24 70%)",
              clipPath: "polygon(50% 0%, 0% 100%, 0% 0%)",
              transform: "rotateY(-55deg) translateZ(70px)",
              transformOrigin: "left center",
            }}
          />

          {/* Bottom face */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "40px",
              background: "linear-gradient(to bottom, #1a1a38, #0e0e22)",
              transform: "rotateX(90deg) translateZ(-1px)",
              transformOrigin: "bottom center",
            }}
          />

          {/* Edge highlight — left */}
          <div 
            className="absolute"
            style={{
              width: "1px",
              height: "100%",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
              left: "50%",
              top: "0",
              transform: "translateZ(41px)",
            }}
          />
        </div>

        {/* Ground reflection */}
        <div 
          className="absolute left-[20%] bottom-[8%] w-[30%] h-[15%]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(15,15,35,0.15), transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Refracted rainbow beams */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[280px]">
          {[
            { color: "#ef4444", y: "8%", angle: -18 },
            { color: "#f97316", y: "18%", angle: -11 },
            { color: "#eab308", y: "30%", angle: -4 },
            { color: "#22c55e", y: "43%", angle: 3 },
            { color: "#3b82f6", y: "56%", angle: 10 },
            { color: "#8b5cf6", y: "68%", angle: 17 },
          ].map((beam, i) => (
            <div key={i} className="absolute left-0 w-full" style={{ top: beam.y }}>
              {/* Glow */}
              <div
                style={{
                  height: "8px",
                  background: `linear-gradient(to right, ${beam.color}88, ${beam.color}22)`,
                  filter: "blur(4px)",
                  transform: `rotate(${beam.angle}deg)`,
                  transformOrigin: "left center",
                }}
              />
              {/* Sharp line */}
              <div
                style={{
                  height: "3px",
                  marginTop: "-5.5px",
                  background: `linear-gradient(to right, ${beam.color}cc, ${beam.color}33)`,
                  transform: `rotate(${beam.angle}deg)`,
                  transformOrigin: "left center",
                  borderRadius: "2px",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

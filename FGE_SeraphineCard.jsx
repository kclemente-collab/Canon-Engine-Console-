import { useState, useEffect } from "react";

const LAVA_CRACKS = [
  "M 20 80 Q 35 60 45 40 Q 52 25 60 10",
  "M 80 90 Q 70 70 75 50 Q 78 35 85 20",
  "M 10 50 Q 25 45 40 55 Q 55 62 70 55",
  "M 30 100 Q 40 85 35 70 Q 32 58 45 45",
  "M 60 95 Q 65 80 72 65 Q 78 52 88 45",
  "M 5 30 Q 20 35 30 28 Q 42 20 50 30",
  "M 75 15 Q 80 30 72 42 Q 65 52 70 65",
  "M 15 65 Q 28 58 38 68 Q 48 76 55 70",
];

const StatRow = ({ label, value, accent }) => (
  <div style={{
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "3px 0",
    borderBottom: "1px solid rgba(255,160,30,0.1)",
  }}>
    <span style={{
      fontSize: "8px", color: "#666",
      textTransform: "uppercase", letterSpacing: "0.12em",
    }}>{label}</span>
    <span style={{
      fontSize: "9px", color: accent || "#ff6820",
      fontWeight: 700, fontFamily: "monospace",
      letterSpacing: "0.05em",
    }}>{value}</span>
  </div>
);

export default function SeraphineCard() {
  const [flipped, setFlipped] = useState(false);
  const [glowPulse, setGlowPulse] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowPulse(p => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const pulseIntensity = 0.4 + 0.3 * Math.sin(glowPulse * 0.063);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030303",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'Georgia', serif",
    }}>

      {/* Title */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <div style={{
          fontSize: "9px", letterSpacing: "0.4em",
          color: "#444", textTransform: "uppercase",
          marginBottom: "4px",
        }}>FERAL GLOSS EMPIRE</div>
        <div style={{
          fontSize: "11px", letterSpacing: "0.2em",
          color: "#666", textTransform: "uppercase",
        }}>Tap card to reveal morph</div>
      </div>

      {/* Card Container */}
      <div
        onClick={() => setFlipped(f => !f)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "320px",
          height: "480px",
          cursor: "pointer",
          perspective: "1200px",
          position: "relative",
        }}
      >
        <div style={{
          width: "100%", height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          filter: hovered ? "drop-shadow(0 0 24px rgba(255,100,20,0.5))" : "drop-shadow(0 0 12px rgba(255,80,10,0.3))",
        }}>

          {/* ── FRONT FACE ── */}
          <div style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: "16px",
            overflow: "hidden",
            border: "2px solid transparent",
            background: "linear-gradient(#0a0a0a, #0a0a0a) padding-box, linear-gradient(135deg, #c8a020, #8a6010, #c8a020, #6a4808, #d4aa30) border-box",
          }}>

            {/* Outer gold frame */}
            <div style={{
              position: "absolute", inset: "6px",
              border: "1px solid rgba(200,160,30,0.3)",
              borderRadius: "12px",
              pointerEvents: "none", zIndex: 10,
            }} />

            {/* Hero image area */}
            <div style={{
              position: "absolute", inset: "10px 10px 140px 10px",
              borderRadius: "8px",
              overflow: "hidden",
              background: "linear-gradient(180deg, #0a0505 0%, #1a0800 40%, #2a1000 70%, #3a1500 100%)",
            }}>
              {/* Volcanic sky */}
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at 50% 20%, rgba(80,40,10,0.8) 0%, rgba(20,8,2,0.95) 60%)",
              }} />

              {/* Lava glow ground */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
                background: `radial-gradient(ellipse at 50% 100%, rgba(255,80,10,${pulseIntensity}) 0%, transparent 70%)`,
                transition: "background 0.1s",
              }} />

              {/* Smoke clouds */}
              {[15, 45, 75].map((x, i) => (
                <div key={i} style={{
                  position: "absolute", top: `${5 + i * 8}%`,
                  left: `${x}%`, width: "60px", height: "30px",
                  background: "rgba(40,30,25,0.6)",
                  borderRadius: "50%",
                  filter: "blur(8px)",
                }} />
              ))}

              {/* Car silhouette */}
              <div style={{
                position: "absolute",
                bottom: "20%", left: "50%",
                transform: "translateX(-50%)",
                width: "85%", height: "45%",
              }}>
                {/* Car body */}
                <svg viewBox="0 0 200 80" style={{ width: "100%", height: "100%" }}>
                  {/* Main body */}
                  <path d="M 10 60 Q 15 45 25 35 Q 40 20 70 18 Q 100 15 130 18 Q 160 20 175 35 Q 185 45 190 60 Z"
                    fill="#0f0f0f" stroke="rgba(200,160,30,0.4)" strokeWidth="0.5" />
                  {/* Roof */}
                  <path d="M 55 35 Q 70 15 100 12 Q 130 10 145 35"
                    fill="#080808" stroke="rgba(200,160,30,0.3)" strokeWidth="0.5" />
                  {/* Windshield */}
                  <path d="M 60 34 Q 72 16 100 13 Q 118 12 130 24 L 125 34 Z"
                    fill="rgba(20,30,40,0.8)" stroke="rgba(100,150,200,0.2)" strokeWidth="0.3" />
                  {/* Wheels */}
                  <circle cx="45" cy="62" r="14" fill="#080808" stroke="rgba(200,160,30,0.5)" strokeWidth="0.8" />
                  <circle cx="45" cy="62" r="8" fill="#050505" stroke="rgba(200,160,30,0.3)" strokeWidth="0.5" />
                  <circle cx="45" cy="62" r="3" fill="rgba(200,160,30,0.6)" />
                  <circle cx="155" cy="62" r="14" fill="#080808" stroke="rgba(200,160,30,0.5)" strokeWidth="0.8" />
                  <circle cx="155" cy="62" r="8" fill="#050505" stroke="rgba(200,160,30,0.3)" strokeWidth="0.5" />
                  <circle cx="155" cy="62" r="3" fill="rgba(200,160,30,0.6)" />
                  {/* Lava cracks on body */}
                  {LAVA_CRACKS.slice(0, 5).map((d, i) => (
                    <path key={i} d={d}
                      fill="none"
                      stroke={`rgba(255,${80 + i * 15},10,${pulseIntensity + 0.2})`}
                      strokeWidth="0.6"
                      transform="scale(1.8, 0.7) translate(5, 20)"
                    />
                  ))}
                  {/* Ground reflection */}
                  <path d="M 10 72 Q 100 68 190 72 L 190 80 Q 100 76 10 80 Z"
                    fill={`rgba(255,60,10,${pulseIntensity * 0.3})`} />
                </svg>
              </div>

              {/* Lava flows background */}
              {[20, 70].map((x, i) => (
                <div key={i} style={{
                  position: "absolute",
                  bottom: 0, left: `${x}%`,
                  width: "3px", height: "40%",
                  background: `linear-gradient(transparent, rgba(255,80,10,${pulseIntensity}))`,
                  borderRadius: "2px",
                  filter: "blur(2px)",
                }} />
              ))}

              {/* Top name bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                padding: "8px 12px",
                background: "linear-gradient(rgba(0,0,0,0.8), transparent)",
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span style={{
                  fontSize: "8px", color: "rgba(200,160,30,0.7)",
                  textTransform: "uppercase", letterSpacing: "0.2em",
                  fontFamily: "monospace",
                }}>FGE-001-VP</span>
                <span style={{
                  fontSize: "8px", color: "rgba(200,160,30,0.5)",
                  textTransform: "uppercase", letterSpacing: "0.15em",
                  fontFamily: "monospace",
                }}>CONCEPT VEHICLE</span>
              </div>
            </div>

            {/* Stats panel */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "140px",
              padding: "10px 14px 8px",
              background: "linear-gradient(rgba(8,4,0,0.95), rgba(5,2,0,0.98))",
              borderTop: "1px solid rgba(200,160,30,0.2)",
            }}>
              {/* Character name */}
              <div style={{ marginBottom: "6px" }}>
                <div style={{
                  fontSize: "22px", fontWeight: 900,
                  letterSpacing: "0.08em",
                  fontFamily: "'Georgia', serif",
                  background: "linear-gradient(135deg, #d4a820 0%, #f0c840 40%, #c49010 70%, #e8b830 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  lineHeight: 1,
                }}>SERAPHINE</div>
                <div style={{
                  fontSize: "8px", color: "#555",
                  textTransform: "uppercase", letterSpacing: "0.25em",
                  marginTop: "2px",
                }}>Fluid Predator · Volcanic Kintsugi</div>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                <StatRow label="Surface" value="Obsidian Kintsugi" />
                <StatRow label="Scene Law" value="Thermal Presence" />
                <StatRow label="Origin" value="Volcanic Event" />
                <StatRow label="Morph Pet" value="Volcanic Serpent" />
                <StatRow label="Fracture Type" value="Lava Network" />
                <StatRow label="Glow Metric" value="9.88" accent="#ff6820" />
              </div>

              {/* Card line */}
              <div style={{
                marginTop: "6px", paddingTop: "5px",
                borderTop: "1px solid rgba(200,160,30,0.15)",
                fontSize: "8px", color: "rgba(200,160,30,0.5)",
                fontStyle: "italic", letterSpacing: "0.05em",
                textAlign: "center",
              }}>
                "She didn't survive the fire. She became it."
              </div>

              {/* Edition footer */}
              <div style={{
                marginTop: "5px",
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span style={{
                  fontSize: "7px", color: "#3a3a3a",
                  textTransform: "uppercase", letterSpacing: "0.15em",
                  fontFamily: "monospace",
                }}>LIMITED #001/100 · 2026</span>
                <span style={{
                  fontSize: "7px", color: "#3a3a3a",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  fontFamily: "monospace",
                }}>NO REFUNDS · FINAL SALE</span>
              </div>
            </div>

            {/* Lava pulse overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `radial-gradient(ellipse at 50% 75%, rgba(255,60,10,${pulseIntensity * 0.08}) 0%, transparent 60%)`,
              borderRadius: "14px",
              transition: "background 0.1s",
            }} />
          </div>

          {/* ── BACK FACE — SERPENT ── */}
          <div style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "16px",
            overflow: "hidden",
            border: "2px solid transparent",
            background: "linear-gradient(#060606, #060606) padding-box, linear-gradient(135deg, #c8a020, #8a6010, #c8a020, #6a4808, #d4aa30) border-box",
          }}>

            {/* Gold frame */}
            <div style={{
              position: "absolute", inset: "6px",
              border: "1px solid rgba(200,160,30,0.3)",
              borderRadius: "12px",
              pointerEvents: "none", zIndex: 10,
            }} />

            {/* Serpent image area */}
            <div style={{
              position: "absolute", inset: "10px 10px 120px 10px",
              borderRadius: "8px", overflow: "hidden",
              background: "radial-gradient(ellipse at 50% 50%, #1a0800 0%, #0a0400 60%, #050200 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>

              {/* Smoke atmosphere */}
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  position: "absolute",
                  top: `${10 + i * 20}%`,
                  left: `${10 + i * 25}%`,
                  width: "80px", height: "40px",
                  background: "rgba(30,20,15,0.5)",
                  borderRadius: "50%",
                  filter: "blur(12px)",
                }} />
              ))}

              {/* Serpent SVG */}
              <svg viewBox="0 0 200 240" style={{ width: "80%", height: "80%" }}>
                {/* Coiled body */}
                <ellipse cx="100" cy="180" rx="70" ry="30"
                  fill="none" stroke="#1a1a1a" strokeWidth="18"
                  strokeLinecap="round" />
                <ellipse cx="100" cy="180" rx="70" ry="30"
                  fill="none" stroke="#0d0d0d" strokeWidth="16"
                  strokeLinecap="round" />
                {/* Lava cracks on coil */}
                <ellipse cx="100" cy="180" rx="70" ry="30"
                  fill="none"
                  stroke={`rgba(255,80,10,${pulseIntensity})`}
                  strokeWidth="0.8" strokeDasharray="8,12"
                  strokeLinecap="round" />

                {/* Rising body */}
                <path d="M 100 155 Q 80 120 90 90 Q 98 65 100 40"
                  fill="none" stroke="#1a1a1a" strokeWidth="22" strokeLinecap="round" />
                <path d="M 100 155 Q 80 120 90 90 Q 98 65 100 40"
                  fill="none" stroke="#0d0d0d" strokeWidth="18" strokeLinecap="round" />
                {/* Lava on body */}
                <path d="M 98 150 Q 82 118 91 88 Q 97 65 99 42"
                  fill="none"
                  stroke={`rgba(255,80,10,${pulseIntensity + 0.1})`}
                  strokeWidth="0.8" strokeDasharray="6,10" />

                {/* Head */}
                <ellipse cx="100" cy="32" rx="16" ry="12"
                  fill="#0f0f0f" stroke="rgba(200,160,30,0.4)" strokeWidth="0.8" />

                {/* Talisman on head */}
                <line x1="100" y1="24" x2="100" y2="40"
                  stroke="rgba(200,160,30,0.7)" strokeWidth="1.2" />
                <line x1="92" y1="30" x2="108" y2="30"
                  stroke="rgba(200,160,30,0.7)" strokeWidth="1.2" />
                <circle cx="100" cy="30" r="5"
                  fill="none" stroke="rgba(200,160,30,0.4)" strokeWidth="0.6" />

                {/* Eyes */}
                <ellipse cx="95" cy="30" rx="2" ry="2.5"
                  fill={`rgba(255,80,10,${pulseIntensity + 0.3})`} />
                <ellipse cx="105" cy="30" rx="2" ry="2.5"
                  fill={`rgba(255,80,10,${pulseIntensity + 0.3})`} />

                {/* Ground lava */}
                <ellipse cx="100" cy="210" rx="60" ry="8"
                  fill={`rgba(255,60,10,${pulseIntensity * 0.4})`}
                  filter="blur(4px)" />

                {/* Scale texture hint */}
                {[0, 1, 2, 3].map(i => (
                  <ellipse key={i}
                    cx={85 + i * 10} cy={180}
                    rx="4" ry="6"
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="0.5"
                    transform={`rotate(${i * 5}, 100, 180)`}
                  />
                ))}
              </svg>

              {/* ID text at base */}
              <div style={{
                position: "absolute", bottom: "8px",
                left: 0, right: 0, textAlign: "center",
                fontSize: "7px", color: "rgba(200,160,30,0.4)",
                fontFamily: "monospace", letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}>
                FGE-001-VP · VOLCANIC SERPENT · MORPH PET
              </div>
            </div>

            {/* Back stats panel */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
              padding: "10px 14px 8px",
              background: "linear-gradient(rgba(8,4,0,0.95), rgba(5,2,0,0.98))",
              borderTop: "1px solid rgba(200,160,30,0.2)",
            }}>
              <div style={{
                fontSize: "14px", fontWeight: 900,
                background: "linear-gradient(135deg, #d4a820, #f0c840, #c49010)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: "0.12em", marginBottom: "6px",
                fontFamily: "'Georgia', serif",
              }}>
                THE VOLCANIC SERPENT
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                <StatRow label="Type" value="Morph Pet" />
                <StatRow label="Origin" value="Seraphine DNA" />
                <StatRow label="Surface" value="Lava Scale Kintsugi" />
                <StatRow label="Talisman" value="Head Emblem" />
              </div>

              <div style={{
                marginTop: "6px", paddingTop: "5px",
                borderTop: "1px solid rgba(200,160,30,0.15)",
                fontSize: "8px", color: "rgba(200,160,30,0.4)",
                fontStyle: "italic", textAlign: "center",
                letterSpacing: "0.05em",
              }}>
                Same fracture. Same fire. Same origin.
              </div>

              <div style={{
                marginTop: "5px",
                display: "flex", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: "7px", color: "#3a3a3a", fontFamily: "monospace", letterSpacing: "0.1em" }}>
                  © FERAL GLOSS ENGINE
                </span>
                <span style={{ fontSize: "7px", color: "#3a3a3a", fontFamily: "monospace", letterSpacing: "0.1em" }}>
                  TRADE AT FGE
                </span>
              </div>
            </div>

            {/* Pulse overlay back */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `radial-gradient(ellipse at 50% 60%, rgba(255,60,10,${pulseIntensity * 0.06}) 0%, transparent 60%)`,
              borderRadius: "14px",
            }} />
          </div>
        </div>
      </div>

      {/* Label */}
      <div style={{
        marginTop: "20px", textAlign: "center",
        fontSize: "9px", color: "#2a2a2a",
        textTransform: "uppercase", letterSpacing: "0.2em",
        lineHeight: 2,
      }}>
        LIMITED EDITION #001/100 · 2026<br />
        FERAL GLOSS ENGINE · NO REFUNDS · FINAL SALE
      </div>
    </div>
  );
}

import { useState } from "react";

const textures = [
  {
    id: "white-marble",
    name: "Carrara Marble",
    category: "Marble",
    tags: ["SSS", "veining", "translucent", "classic"],
    visual: {
      background: "linear-gradient(135deg, #f5f5f0 0%, #e8e4dc 30%, #f0ede6 60%, #e4e0d8 100%)",
      veins: "repeating-linear-gradient(25deg, transparent 0px, transparent 18px, rgba(180,170,155,0.3) 18px, rgba(180,170,155,0.3) 19px, transparent 19px, transparent 35px, rgba(160,150,135,0.2) 35px, rgba(160,150,135,0.2) 36px)",
      accent: "#c8b89a",
    },
    prompt: {
      core: "Carrara white marble surface, fine grey veining on warm white ground, subsurface scattering, translucent depth, light penetrates surface, natural organic crack patterns",
      lighting: "single directional light, soft shadows, photorealistic material",
      quality: "physically based material, Arnold render quality, 8K texture detail, tactile surface",
      fge: "Feral Gloss Empire aesthetic, rugged luxury, worn but intentional",
    },
    properties: {
      SSS: "High",
      Veining: "Fine grey",
      Finish: "Polished",
      Translucency: "Medium",
      "Luxury Tier": "Classic",
    },
  },
  {
    id: "black-marble",
    name: "Nero Marquina",
    category: "Marble",
    tags: ["dramatic", "gold veining", "power", "deep"],
    visual: {
      background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 40%, #1f1f1f 70%, #111111 100%)",
      veins: "repeating-linear-gradient(35deg, transparent 0px, transparent 22px, rgba(200,170,80,0.4) 22px, rgba(200,170,80,0.4) 23px, transparent 23px, transparent 45px, rgba(180,150,60,0.25) 45px, rgba(180,150,60,0.25) 46px)",
      accent: "#c8aa50",
    },
    prompt: {
      core: "Nero Marquina black marble, dramatic gold and white veining on deep black ground, high polish, deep reflective surface, stark contrast veining",
      lighting: "dramatic single light source, strong specular highlights, deep shadows",
      quality: "physically based render, Octane material quality, 8K detail, mirror-like polish",
      fge: "Feral Gloss Empire — near-black palette, electric gold accent, dangerous luxury",
    },
    properties: {
      SSS: "Low",
      Veining: "Gold/white dramatic",
      Finish: "High polish",
      Translucency: "None",
      "Luxury Tier": "Statement",
    },
  },
  {
    id: "onyx",
    name: "Honey Onyx",
    category: "Onyx",
    tags: ["backlit", "translucent", "glowing", "amber"],
    visual: {
      background: "linear-gradient(135deg, #c4822a 0%, #e8a84a 25%, #b87030 50%, #d4943c 75%, #c07828 100%)",
      veins: "repeating-linear-gradient(15deg, transparent 0px, transparent 12px, rgba(255,220,120,0.5) 12px, rgba(255,220,120,0.5) 13px, transparent 13px, transparent 28px, rgba(180,110,20,0.3) 28px, rgba(180,110,20,0.3) 29px)",
      accent: "#f0b840",
    },
    prompt: {
      core: "Honey onyx stone, extreme translucency, amber and gold layered bands, backlit effect, internal glow, warm light scattering through surface, organic flowing layers",
      lighting: "backlit from behind, warm amber light transmission, glowing edges, subsurface luminosity",
      quality: "volumetric light scatter, SSS maximum, physically based material, 8K",
      fge: "Feral Gloss Empire — warm electric accent, translucent depth, luxury that glows from inside",
    },
    properties: {
      SSS: "Extreme",
      Veining: "Flowing amber bands",
      Finish: "Honed or polished",
      Translucency: "Maximum",
      "Luxury Tier": "Showstopper",
    },
  },
  {
    id: "black-onyx",
    name: "Black Onyx",
    category: "Onyx",
    tags: ["deep black", "mystery", "power", "gemstone"],
    visual: {
      background: "linear-gradient(135deg, #0a0a0a 0%, #151515 30%, #080808 60%, #121212 100%)",
      veins: "repeating-linear-gradient(20deg, transparent 0px, transparent 30px, rgba(40,40,50,0.6) 30px, rgba(40,40,50,0.6) 31px, transparent 31px, transparent 55px)",
      accent: "#2a2a3a",
    },
    prompt: {
      core: "Black onyx gemstone surface, near-perfect black, subtle band layers barely visible, deep lustre, gemstone quality polish, mysterious depth",
      lighting: "minimal light, strong specular point highlight, deep void-like surface",
      quality: "gemstone render quality, physically based material, extreme depth, 8K",
      fge: "Feral Gloss Empire — absolute black, near-invisible depth, power without announcement",
    },
    properties: {
      SSS: "None",
      Veining: "Barely visible bands",
      Finish: "Gemstone polish",
      Translucency: "None",
      "Luxury Tier": "Absolute",
    },
  },
  {
    id: "granite",
    name: "Black Galaxy Granite",
    category: "Granite",
    tags: ["speckled", "cosmic", "durable", "star-like"],
    visual: {
      background: "linear-gradient(135deg, #0f0f0f 0%, #141414 50%, #0a0a0a 100%)",
      veins: "radial-gradient(circle at 20% 30%, rgba(200,180,100,0.8) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(180,160,80,0.6) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(220,200,120,0.7) 1px, transparent 1px), radial-gradient(circle at 40% 80%, rgba(160,140,60,0.5) 1px, transparent 1px)",
      accent: "#c8aa50",
    },
    prompt: {
      core: "Black Galaxy granite surface, deep black base with gold and bronze mineral speckles, crystalline inclusions catching light, cosmic star-field pattern, dense and grounded texture",
      lighting: "multiple light sources, each speckle catches light differently, depth in surface",
      quality: "physically based material, crystalline detail, 8K mineral texture",
      fge: "Feral Gloss Empire — cosmic dark energy, earned luxury, the universe compressed into stone",
    },
    properties: {
      SSS: "None",
      Veining: "Gold mineral speckles",
      Finish: "Polished",
      Translucency: "None",
      "Luxury Tier": "Cosmic",
    },
  },
  {
    id: "opal",
    name: "Fire Opal",
    category: "Opal",
    tags: ["iridescent", "color shift", "play of color", "prismatic"],
    visual: {
      background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 20%, #fcee21 40%, #39b54a 60%, #1c75bc 80%, #9e1f63 100%)",
      veins: "linear-gradient(45deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)",
      accent: "#ff6b35",
    },
    prompt: {
      core: "Fire opal gemstone, intense play of color, spectral iridescence shifting from orange to red to green to blue, internal fire effect, prismatic light diffraction, semi-translucent base",
      lighting: "light source reveals full spectrum, color shifts with viewing angle, internal combustion glow",
      quality: "gemstone render, volumetric color scatter, iridescent shader, 8K",
      fge: "Feral Gloss Empire — the electric accent made material, iridescent flash, impossible color",
    },
    properties: {
      SSS: "High",
      Veining: "Spectral color play",
      Finish: "Cabochon / smooth",
      Translucency: "High",
      "Luxury Tier": "Rare",
    },
  },
  {
    id: "pearl",
    name: "South Sea Pearl",
    category: "Pearl",
    tags: ["nacre", "orient", "soft glow", "organic"],
    visual: {
      background: "radial-gradient(ellipse at 35% 35%, #f8f4ee 0%, #ede8e0 40%, #d8d0c4 70%, #c8c0b4 100%)",
      veins: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 40%, rgba(220,210,195,0.4) 60%, transparent 100%)",
      accent: "#e8e0d4",
    },
    prompt: {
      core: "South Sea pearl surface, organic nacre layers, soft orient sheen, warm cream to pink iridescence, natural luster, microscopic layer interference, silky diffuse glow",
      lighting: "soft diffuse light, multiple reflections in nacre layers, gentle orient shimmer",
      quality: "organic material render, nacre shader, soft SSS, 8K",
      fge: "Feral Gloss Empire — silk shirt energy made material, soft luxury that earned its glow",
    },
    properties: {
      SSS: "Medium",
      Veining: "Nacre orient shimmer",
      Finish: "Natural luster",
      Translucency: "Medium",
      "Luxury Tier": "Organic luxury",
    },
  },
  {
    id: "black-pearl",
    name: "Tahitian Black Pearl",
    category: "Pearl",
    tags: ["dark iridescence", "green overtone", "rare", "depth"],
    visual: {
      background: "radial-gradient(ellipse at 35% 35%, #2a2a2a 0%, #1a1a1a 40%, #0f0f0f 70%, #080808 100%)",
      veins: "linear-gradient(135deg, rgba(0,180,100,0.4) 0%, transparent 30%, rgba(80,60,180,0.3) 50%, transparent 70%, rgba(0,150,80,0.3) 100%)",
      accent: "#00b464",
    },
    prompt: {
      core: "Tahitian black pearl, deep charcoal to black base, green and peacock overtone iridescence, dark orient shimmer, mysterious nacre depth, rare dark luster",
      lighting: "precise light reveals green peacock overtone, dark depth with surface luminosity",
      quality: "organic gemstone render, dark nacre shader, iridescent overtone, 8K",
      fge: "Feral Gloss Empire — Raven Voss energy made material, shadow with iridescent truth underneath",
    },
    properties: {
      SSS: "Medium",
      Veining: "Peacock iridescence",
      Finish: "Dark natural luster",
      Translucency: "Low",
      "Luxury Tier": "Ultra-Rare",
    },
  },
  {
    id: "labradorite",
    name: "Labradorite",
    category: "Semi-Precious",
    tags: ["labradorescence", "metallic flash", "blue-green", "schiller"],
    visual: {
      background: "linear-gradient(135deg, #2a2d35 0%, #1e2128 40%, #252830 70%, #1a1d24 100%)",
      veins: "linear-gradient(45deg, rgba(0,150,255,0.5) 0%, rgba(0,200,150,0.4) 25%, rgba(100,50,200,0.3) 50%, rgba(0,180,255,0.4) 75%, transparent 100%)",
      accent: "#0096ff",
    },
    prompt: {
      core: "Labradorite stone surface, labradorescence effect — electric blue and teal metallic flash across dark grey base, schiller effect, angular light-dependent color shift, semi-precious mineral",
      lighting: "directional light triggers full labradorescence, blue-green metallic flash, dark base contrast",
      quality: "iridescent shader, angle-dependent color, physically based material, 8K",
      fge: "Feral Gloss Empire — the talisman material, chrome serpent energy, dark surface hiding electric truth",
    },
    properties: {
      SSS: "Low",
      Veining: "Blue-green flash",
      Finish: "Polished",
      Translucency: "Low",
      "Luxury Tier": "Statement",
    },
  },
  {
    id: "kintsugi-marble",
    name: "Kintsugi Marble",
    category: "Feral Gloss Signature",
    tags: ["cracked", "gold repair", "broken luxury", "constitutional"],
    visual: {
      background: "linear-gradient(135deg, #f0ede6 0%, #e4e0d8 40%, #ece8e0 70%, #d8d4cc 100%)",
      veins: "repeating-linear-gradient(25deg, transparent 0px, transparent 18px, rgba(180,170,155,0.3) 18px, rgba(180,170,155,0.3) 19px, transparent 19px, transparent 35px), linear-gradient(60deg, transparent 0%, transparent 45%, rgba(200,160,40,0.9) 45%, rgba(220,180,60,0.95) 47%, transparent 47%, transparent 70%, rgba(190,150,30,0.8) 70%, rgba(210,170,50,0.9) 72%, transparent 72%)",
      accent: "#c8a030",
    },
    prompt: {
      core: "Cracked Calacatta marble with Kintsugi gold repair, stress fractures filled with liquid gold, white marble base with grey veining, gold crack lines running through surface, repaired and more valuable",
      lighting: "gold repairs catch light stronger than marble surface, warm accent glow in cracks",
      quality: "physically based material, gold liquid in cracks, tactile surface depth, 8K",
      fge: "Feral Gloss Empire — constitutional material, rugged but rich, broken and more valuable because of it, the world's aesthetic law made stone",
    },
    properties: {
      SSS: "Medium",
      Veining: "Grey + gold repair",
      Finish: "Polished with texture",
      Translucency: "Medium",
      "Luxury Tier": "Constitutional",
    },
  },
];

const categories = ["All", ...new Set(textures.map(t => t.category))];

const PropertyBadge = ({ label, value }) => (
  <div style={{
    display: "flex", flexDirection: "column", gap: "2px",
    padding: "6px 10px", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px",
  }}>
    <span style={{ fontSize: "9px", color: "#666", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
    <span style={{ fontSize: "11px", color: "#aaa", fontWeight: 500 }}>{value}</span>
  </div>
);

export default function TextureToolbox() {
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("All");
  const [copied, setCopied] = useState(null);
  const [view, setView] = useState("grid");

  const filtered = category === "All" ? textures : textures.filter(t => t.category === category);

  const copyPrompt = (texture, part) => {
    const text = part === "full"
      ? `${texture.prompt.core}\n${texture.prompt.lighting}\n${texture.prompt.quality}\n${texture.prompt.fge}`
      : texture.prompt[part];
    navigator.clipboard.writeText(text);
    setCopied(`${texture.id}-${part}`);
    setTimeout(() => setCopied(null), 2000);
  };

  const TextureSwatch = ({ t, mini }) => (
    <div
      onClick={() => setSelected(selected?.id === t.id ? null : t)}
      style={{
        cursor: "pointer",
        borderRadius: mini ? "8px" : "12px",
        overflow: "hidden",
        border: selected?.id === t.id
          ? `1px solid ${t.visual.accent}`
          : "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.2s ease",
        background: "#111",
      }}
    >
      <div style={{
        height: mini ? "80px" : "120px",
        background: t.visual.background,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: t.visual.veins,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "8px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
        }}>
          <div style={{ fontSize: mini ? "10px" : "11px", color: "#fff", fontWeight: 600, fontFamily: "Georgia, serif" }}>
            {t.name}
          </div>
          <div style={{ fontSize: "9px", color: t.visual.accent, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {t.category}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      color: "#e0e0e0",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        padding: "24px 20px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, #0f0f0f 0%, #080808 100%)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{
              fontSize: "10px", letterSpacing: "0.3em", color: "#666",
              textTransform: "uppercase", marginBottom: "4px"
            }}>
              FERAL GLOSS EMPIRE
            </div>
            <div style={{
              fontSize: "22px", fontWeight: 700,
              fontFamily: "Georgia, serif",
              background: "linear-gradient(135deg, #fff 0%, #aaa 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}>
              Render Texture Toolbox
            </div>
            <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
              {textures.length} materials — copy prompt to generate
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["grid", "list"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "6px 12px", borderRadius: "6px", fontSize: "11px",
                cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)",
                background: view === v ? "rgba(255,255,255,0.1)" : "transparent",
                color: view === v ? "#fff" : "#555",
              }}>{v}</button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ display: "flex", gap: "6px", marginTop: "16px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "5px 12px", borderRadius: "20px", fontSize: "10px",
              cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)",
              background: category === cat ? "rgba(255,255,255,0.12)" : "transparent",
              color: category === cat ? "#fff" : "#555",
              textTransform: "uppercase", letterSpacing: "0.08em",
              transition: "all 0.15s ease",
            }}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 160px)" }}>
        {/* Grid */}
        <div style={{
          flex: selected ? "0 0 45%" : "1",
          overflowY: "auto", padding: "16px",
          transition: "flex 0.3s ease",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: view === "grid"
              ? selected ? "1fr 1fr" : "1fr 1fr 1fr"
              : "1fr",
            gap: "10px",
          }}>
            {filtered.map(t => (
              view === "grid"
                ? <TextureSwatch key={t.id} t={t} mini={!!selected} />
                : (
                  <div key={t.id} onClick={() => setSelected(selected?.id === t.id ? null : t)}
                    style={{
                      display: "flex", gap: "12px", alignItems: "center",
                      padding: "12px", borderRadius: "10px",
                      border: selected?.id === t.id
                        ? `1px solid ${t.visual.accent}`
                        : "1px solid rgba(255,255,255,0.06)",
                      cursor: "pointer", background: "#0f0f0f",
                    }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "8px",
                      background: t.visual.background, flexShrink: 0,
                      position: "relative", overflow: "hidden",
                    }}>
                      <div style={{ position: "absolute", inset: 0, background: t.visual.veins }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", color: "#ddd", fontWeight: 600, fontFamily: "Georgia, serif" }}>{t.name}</div>
                      <div style={{ fontSize: "10px", color: t.visual.accent, textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.category}</div>
                      <div style={{ fontSize: "10px", color: "#444", marginTop: "2px" }}>{t.tags.join(" · ")}</div>
                    </div>
                  </div>
                )
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{
            flex: "0 0 55%", borderLeft: "1px solid rgba(255,255,255,0.06)",
            overflowY: "auto", padding: "20px",
            background: "#0a0a0a",
          }}>
            {/* Swatch Large */}
            <div style={{
              height: "160px", borderRadius: "12px", overflow: "hidden",
              background: selected.visual.background,
              position: "relative", marginBottom: "16px",
              border: `1px solid ${selected.visual.accent}22`,
            }}>
              <div style={{ position: "absolute", inset: 0, background: selected.visual.veins }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "16px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
              }}>
                <div style={{ fontSize: "18px", fontFamily: "Georgia, serif", color: "#fff", fontWeight: 700 }}>
                  {selected.name}
                </div>
                <div style={{ fontSize: "10px", color: selected.visual.accent, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  {selected.category}
                </div>
              </div>
            </div>

            {/* Properties */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {Object.entries(selected.properties).map(([k, v]) => (
                <PropertyBadge key={k} label={k} value={v} />
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "20px" }}>
              {selected.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: "9px", padding: "3px 8px",
                  background: `${selected.visual.accent}22`,
                  color: selected.visual.accent,
                  borderRadius: "4px", textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>{tag}</span>
              ))}
            </div>

            {/* Prompts */}
            <div style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px" }}>
              Prompt Blocks
            </div>

            {[
              { key: "core", label: "Core Material" },
              { key: "lighting", label: "Lighting" },
              { key: "quality", label: "Render Quality" },
              { key: "fge", label: "FGE Layer" },
            ].map(({ key, label }) => (
              <div key={key} style={{
                marginBottom: "8px", borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "8px 12px",
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <span style={{ fontSize: "10px", color: "#666", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {label}
                  </span>
                  <button onClick={() => copyPrompt(selected, key)} style={{
                    fontSize: "9px", padding: "3px 8px", borderRadius: "4px",
                    cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)",
                    background: copied === `${selected.id}-${key}` ? `${selected.visual.accent}33` : "transparent",
                    color: copied === `${selected.id}-${key}` ? selected.visual.accent : "#555",
                    transition: "all 0.15s ease",
                  }}>
                    {copied === `${selected.id}-${key}` ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <div style={{ padding: "10px 12px", fontSize: "11px", color: "#888", lineHeight: "1.6" }}>
                  {selected.prompt[key]}
                </div>
              </div>
            ))}

            {/* Copy Full Prompt */}
            <button onClick={() => copyPrompt(selected, "full")} style={{
              width: "100%", padding: "12px",
              borderRadius: "8px", marginTop: "4px",
              cursor: "pointer",
              border: `1px solid ${selected.visual.accent}44`,
              background: `${selected.visual.accent}11`,
              color: selected.visual.accent,
              fontSize: "11px", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.15em",
              transition: "all 0.2s ease",
            }}>
              {copied === `${selected.id}-full` ? "✓ Full Prompt Copied" : "Copy Full Prompt"}
            </button>

            <div style={{
              marginTop: "16px", padding: "12px",
              borderRadius: "8px", background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
              <div style={{ fontSize: "9px", color: "#333", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                Draw Things Settings
              </div>
              <div style={{ fontSize: "10px", color: "#555", lineHeight: "1.8" }}>
                Model: Realistic Vision V6 or Juggernaut XL<br />
                Sampler: DPM++ 2M Karras · Steps: 30 · CFG: 7<br />
                Size: 768x768 or 768x1152
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

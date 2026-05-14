import { useState, useRef, useEffect, useCallback } from "react";

const TOOLS = ["select", "crop", "brush", "eraser", "text"];
const BLEND_MODES = ["normal", "multiply", "screen", "overlay", "hard-light", "soft-light", "difference", "luminosity"];

const FILTERS = [
  { name: "None", style: "" },
  { name: "Obsidian", style: "brightness(0.85) contrast(1.3) saturate(0.6)" },
  { name: "Kintsugi", style: "sepia(0.4) contrast(1.2) brightness(1.05)" },
  { name: "Void", style: "brightness(0.6) contrast(1.8) saturate(0.2)" },
  { name: "Ember", style: "sepia(0.6) saturate(1.8) brightness(1.1)" },
  { name: "Chrome", style: "grayscale(0.8) contrast(1.5) brightness(1.15)" },
  { name: "Ritual", style: "hue-rotate(200deg) saturate(1.4) contrast(1.2)" },
  { name: "Raw", style: "contrast(1.4) saturate(1.3) brightness(0.95)" },
];

export default function RenderEliteEditor() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [activeTool, setActiveTool] = useState("select");
  const [activeFilter, setActiveFilter] = useState(0);
  const [layers, setLayers] = useState([]);
  const [activeLayer, setActiveLayer] = useState(null);
  const [concept, setConcept] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [renderEndpoint, setRenderEndpoint] = useState("https://your-replit-app.replit.app/render-elite");
  const [removeBgKey, setRemoveBgKey] = useState("");
  const [brushSize, setBrushSize] = useState(20);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(100);
  const [blendMode, setBlendMode] = useState("normal");
  const [adjustments, setAdjustments] = useState({ brightness: 100, contrast: 100, saturation: 100, hue: 0 });
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [videoFrames, setVideoFrames] = useState([]);
  const [activeFrame, setActiveFrame] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [statusMsg, setStatusMsg] = useState("Drop an image or video to begin");
  const [selectedLayerIds, setSelectedLayerIds] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const status = (msg) => setStatusMsg(msg);

  // ── CANVAS COMPOSITE ──────────────────────────────────────────────────────
  const composite = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    layers.forEach((layer) => {
      if (!layer.visible) return;
      ctx.globalAlpha = layer.opacity / 100;
      ctx.globalCompositeOperation = layer.blendMode || "source-over";
      if (layer.imageData) {
        const img = new Image();
        img.onload = () => {
          ctx.filter = layer.filter || "none";
          ctx.drawImage(img, layer.x || 0, layer.y || 0, layer.w || canvas.width, layer.h || canvas.height);
          ctx.filter = "none";
        };
        img.src = layer.imageData;
      }
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }, [layers]);

  useEffect(() => { composite(); }, [layers, composite]);

  // ── FILE IMPORT ───────────────────────────────────────────────────────────
  const importImage = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        canvas.width = Math.min(img.width, 1200);
        canvas.height = Math.min(img.height, 900);
        const id = Date.now();
        const newLayer = {
          id, name: file.name.split(".")[0] || "Image",
          imageData: e.target.result,
          visible: true, opacity: 100,
          blendMode: "source-over", filter: "",
          x: 0, y: 0, w: canvas.width, h: canvas.height,
        };
        setLayers((prev) => [...prev, newLayer]);
        setActiveLayer(id);
        setSelectedLayerIds([id]);
        status(`Imported: ${file.name}`);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const importVideo = useCallback((file) => {
    status("Extracting video frames…");
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      const frames = [];
      const duration = video.duration;
      const step = Math.max(duration / 20, 0.1);
      let t = 0;
      const extractFrame = () => {
        if (t > duration) {
          setVideoFrames(frames);
          setActiveFrame(0);
          if (frames[0]) importFrameToCanvas(frames[0]);
          status(`Extracted ${frames.length} frames`);
          return;
        }
        video.currentTime = t;
        video.onseeked = () => {
          const fc = document.createElement("canvas");
          fc.width = video.videoWidth;
          fc.height = video.videoHeight;
          fc.getContext("2d").drawImage(video, 0, 0);
          frames.push({ time: t.toFixed(2), dataUrl: fc.toDataURL("image/jpeg", 0.85) });
          t += step;
          extractFrame();
        };
      };
      extractFrame();
    };
  }, []);

  const importFrameToCanvas = (frame) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const id = Date.now();
      setLayers((prev) => [...prev, {
        id, name: `Frame ${frame.time}s`,
        imageData: frame.dataUrl,
        visible: true, opacity: 100,
        blendMode: "source-over", filter: "",
        x: 0, y: 0, w: canvas.width, h: canvas.height,
      }]);
      setActiveLayer(id);
    };
    img.src = frame.dataUrl;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type.startsWith("image/")) importImage(file);
    else if (file.type.startsWith("video/")) importVideo(file);
  };

  // ── BACKGROUND REMOVAL ────────────────────────────────────────────────────
  const removeBackground = async () => {
    const layer = layers.find((l) => l.id === activeLayer);
    if (!layer) return status("Select a layer first");
    setIsRemoving(true);
    status("Removing background…");
    try {
      const blob = await (await fetch(layer.imageData)).blob();
      const form = new FormData();
      form.append("image_file", blob, "image.png");
      form.append("size", "auto");
      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": removeBgKey || "DEMO" },
        body: form,
      });
      if (!res.ok) throw new Error(`remove.bg error: ${res.status}`);
      const result = await res.blob();
      const url = URL.createObjectURL(result);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLayers((prev) => prev.map((l) =>
          l.id === activeLayer ? { ...l, imageData: e.target.result, name: l.name + " (no bg)" } : l
        ));
        status("Background removed ✓");
      };
      reader.readAsDataURL(result);
    } catch (err) {
      status(`BG removal failed: ${err.message}. Add remove.bg API key in settings.`);
    }
    setIsRemoving(false);
  };

  // ── AI SUGGESTION (RENDER ELITE ENGINE) ──────────────────────────────────
  const runAISuggestion = async () => {
    const layer = layers.find((l) => l.id === activeLayer);
    if (!layer) return status("Select a layer first");
    setIsProcessing(true);
    status("Sending to Render Elite Engine…");
    try {
      const blob = await (await fetch(layer.imageData)).blob();
      const form = new FormData();
      form.append("image", blob, "image.png");
      if (concept) form.append("concept", concept);
      const res = await fetch(renderEndpoint, { method: "POST", body: form });
      if (!res.ok) throw new Error(`Engine error: ${res.status}`);
      const data = await res.json();
      setAiResult(data.output);
      status("AI suggestion received ✓");
    } catch (err) {
      // Demo mode — show mock result
      setAiResult({
        image_url: layer.imageData,
        prompt_used: `[DEMO] Obsidian luxury transformation. ${concept || "Editorial cinematic. Gold kintsugi fracture motifs. High contrast glossy surface. Organic curvature."} Connect your /render-elite endpoint in Settings to get real results.`,
      });
      status("Demo mode — connect your Render Elite Engine in Settings");
    }
    setIsProcessing(false);
  };

  const applyAIResult = () => {
    if (!aiResult?.image_url) return;
    const id = Date.now();
    setLayers((prev) => [...prev, {
      id, name: "AI Result",
      imageData: aiResult.image_url,
      visible: true, opacity: 100,
      blendMode: "source-over", filter: "",
      x: 0, y: 0,
      w: canvasRef.current?.width || 800,
      h: canvasRef.current?.height || 600,
    }]);
    setActiveLayer(id);
    setAiResult(null);
    status("AI result added as new layer");
  };

  // ── DRAWING ───────────────────────────────────────────────────────────────
  const startDraw = (e) => {
    if (activeTool !== "brush" && activeTool !== "eraser") return;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = overlayRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.globalAlpha = opacity / 100;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const ctx = overlayRef.current?.getContext("2d");
    ctx?.beginPath();
  };

  // ── FILTER APPLICATION ────────────────────────────────────────────────────
  const applyFilter = (idx) => {
    setActiveFilter(idx);
    setLayers((prev) => prev.map((l) =>
      l.id === activeLayer ? { ...l, filter: FILTERS[idx].style } : l
    ));
  };

  // ── ADJUSTMENTS ───────────────────────────────────────────────────────────
  const applyAdjustment = (key, val) => {
    const next = { ...adjustments, [key]: val };
    setAdjustments(next);
    const filterStr = `brightness(${next.brightness}%) contrast(${next.contrast}%) saturate(${next.saturation}%) hue-rotate(${next.hue}deg)`;
    setLayers((prev) => prev.map((l) =>
      l.id === activeLayer ? { ...l, filter: filterStr } : l
    ));
  };

  // ── EXPORT ────────────────────────────────────────────────────────────────
  const exportImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `render-elite-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    status("Exported ✓");
  };

  // ── LAYER OPS ─────────────────────────────────────────────────────────────
  const toggleLayerVisibility = (id) => {
    setLayers((prev) => prev.map((l) => l.id === id ? { ...l, visible: !l.visible } : l));
  };
  const deleteLayer = (id) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (activeLayer === id) setActiveLayer(null);
  };
  const duplicateLayer = (id) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    const newId = Date.now();
    setLayers((prev) => [...prev, { ...layer, id: newId, name: layer.name + " copy" }]);
  };

  // ── STYLES ────────────────────────────────────────────────────────────────
  const S = {
    app: {
      display: "grid",
      gridTemplateColumns: "56px 280px 1fr 280px",
      gridTemplateRows: "48px 1fr 40px",
      height: "100vh",
      background: "#080808",
      color: "#e0ddd8",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      overflow: "hidden",
      position: "relative",
    },
    topbar: {
      gridColumn: "1 / -1",
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 16px",
      background: "#0f0f0f",
      borderBottom: "1px solid #1e1e1e",
      zIndex: 10,
    },
    logo: {
      fontSize: 11,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#c8a96e",
      fontWeight: 700,
    },
    toolbar: {
      gridRow: "2 / 3",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      padding: "12px 0",
      background: "#0c0c0c",
      borderRight: "1px solid #1a1a1a",
    },
    toolBtn: (active) => ({
      width: 36,
      height: 36,
      border: active ? "1px solid #c8a96e" : "1px solid transparent",
      background: active ? "#1a1a14" : "transparent",
      color: active ? "#c8a96e" : "#666",
      borderRadius: 6,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 14,
      transition: "all 0.15s",
    }),
    leftPanel: {
      gridRow: "2 / 3",
      background: "#0c0c0c",
      borderRight: "1px solid #1a1a1a",
      overflowY: "auto",
      padding: "12px 0",
    },
    section: {
      padding: "0 12px 12px",
      borderBottom: "1px solid #141414",
      marginBottom: 0,
    },
    sectionTitle: {
      fontSize: 9,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#444",
      padding: "10px 12px 6px",
      display: "block",
    },
    canvasArea: {
      gridRow: "2 / 3",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#060606",
      overflow: "hidden",
    },
    canvasWrap: (dragOver) => ({
      position: "relative",
      border: dragOver ? "2px dashed #c8a96e" : "2px dashed #1a1a1a",
      borderRadius: 4,
      transition: "border-color 0.2s",
    }),
    dropOverlay: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 8,
      color: "#333",
      pointerEvents: "none",
    },
    rightPanel: {
      gridRow: "2 / 3",
      background: "#0c0c0c",
      borderLeft: "1px solid #1a1a1a",
      overflowY: "auto",
      padding: "12px 0",
    },
    statusbar: {
      gridColumn: "1 / -1",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      background: "#0a0a0a",
      borderTop: "1px solid #1a1a1a",
      fontSize: 10,
      color: "#444",
      gap: 16,
    },
    btn: (variant = "default") => ({
      padding: "6px 12px",
      fontSize: 10,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      border: variant === "gold" ? "1px solid #c8a96e" : "1px solid #2a2a2a",
      background: variant === "gold" ? "#1a1a10" : "transparent",
      color: variant === "gold" ? "#c8a96e" : "#888",
      borderRadius: 4,
      cursor: "pointer",
      transition: "all 0.15s",
      width: "100%",
      marginBottom: 4,
    }),
    input: {
      width: "100%",
      background: "#111",
      border: "1px solid #222",
      color: "#e0ddd8",
      padding: "6px 8px",
      fontSize: 11,
      borderRadius: 4,
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "inherit",
    },
    slider: {
      width: "100%",
      accentColor: "#c8a96e",
      cursor: "pointer",
    },
    layerItem: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px",
      background: active ? "#161610" : "transparent",
      borderLeft: active ? "2px solid #c8a96e" : "2px solid transparent",
      cursor: "pointer",
      fontSize: 10,
      color: active ? "#e0ddd8" : "#666",
      transition: "all 0.1s",
    }),
    filterThumb: (active) => ({
      padding: "4px 8px",
      fontSize: 9,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      border: active ? "1px solid #c8a96e" : "1px solid #222",
      background: active ? "#1a1a10" : "#111",
      color: active ? "#c8a96e" : "#555",
      borderRadius: 3,
      cursor: "pointer",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }),
    aiCard: {
      margin: "0 12px",
      padding: 10,
      background: "#0e0e08",
      border: "1px solid #2a2816",
      borderRadius: 4,
    },
    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    },
    modal: {
      background: "#0f0f0f",
      border: "1px solid #2a2a2a",
      borderRadius: 6,
      padding: 24,
      width: 400,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
  };

  const toolIcons = { select: "⊹", crop: "⌗", brush: "✏", eraser: "◻", text: "T" };

  return (
    <div style={S.app}>
      {/* TOPBAR */}
      <div style={S.topbar}>
        <span style={S.logo}>⬡ Render Elite</span>
        <div style={{ flex: 1 }} />
        <button style={{ ...S.btn(), width: "auto", padding: "4px 10px" }}
          onClick={() => fileInputRef.current?.click()}>Import Image</button>
        <button style={{ ...S.btn(), width: "auto", padding: "4px 10px" }}
          onClick={() => videoInputRef.current?.click()}>Import Video</button>
        <button style={{ ...S.btn("gold"), width: "auto", padding: "4px 10px" }}
          onClick={exportImage}>Export PNG</button>
        <button style={{ ...S.btn(), width: "auto", padding: "4px 10px" }}
          onClick={() => setShowSettings(true)}>⚙ Settings</button>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => e.target.files[0] && importImage(e.target.files[0])} />
        <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }}
          onChange={(e) => e.target.files[0] && importVideo(e.target.files[0])} />
      </div>

      {/* TOOLBAR */}
      <div style={S.toolbar}>
        {TOOLS.map((t) => (
          <button key={t} style={S.toolBtn(activeTool === t)}
            title={t} onClick={() => setActiveTool(t)}>
            {toolIcons[t]}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)}
          style={{ width: 28, height: 28, border: "1px solid #333", borderRadius: 4, cursor: "pointer", background: "none", padding: 2 }} />
      </div>

      {/* LEFT PANEL */}
      <div style={S.leftPanel}>
        <span style={S.sectionTitle}>Filters</span>
        <div style={{ ...S.section, display: "flex", flexWrap: "wrap", gap: 4, padding: "0 12px 12px" }}>
          {FILTERS.map((f, i) => (
            <button key={f.name} style={S.filterThumb(activeFilter === i)}
              onClick={() => applyFilter(i)}>{f.name}</button>
          ))}
        </div>

        <span style={S.sectionTitle}>Adjustments</span>
        <div style={S.section}>
          {[
            { key: "brightness", label: "Bright", min: 0, max: 200 },
            { key: "contrast", label: "Contrast", min: 0, max: 300 },
            { key: "saturation", label: "Sat", min: 0, max: 300 },
            { key: "hue", label: "Hue", min: 0, max: 360 },
          ].map(({ key, label, min, max }) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#555", marginBottom: 2 }}>
                <span style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                <span style={{ color: "#888" }}>{adjustments[key]}</span>
              </div>
              <input type="range" min={min} max={max} value={adjustments[key]}
                style={S.slider}
                onChange={(e) => applyAdjustment(key, Number(e.target.value))} />
            </div>
          ))}
        </div>

        <span style={S.sectionTitle}>Brush</span>
        <div style={S.section}>
          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Size: {brushSize}px</div>
          <input type="range" min={1} max={100} value={brushSize} style={S.slider}
            onChange={(e) => setBrushSize(Number(e.target.value))} />
          <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", margin: "8px 0 4px" }}>Opacity: {opacity}%</div>
          <input type="range" min={1} max={100} value={opacity} style={S.slider}
            onChange={(e) => setOpacity(Number(e.target.value))} />
        </div>

        <span style={S.sectionTitle}>Blend Mode</span>
        <div style={S.section}>
          <select value={blendMode} style={{ ...S.input, padding: "5px 8px" }}
            onChange={(e) => {
              setBlendMode(e.target.value);
              setLayers((prev) => prev.map((l) =>
                l.id === activeLayer ? { ...l, blendMode: e.target.value === "normal" ? "source-over" : e.target.value } : l
              ));
            }}>
            {BLEND_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* CANVAS */}
      <div style={S.canvasArea}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}>
        <div style={S.canvasWrap(dragOver)}>
          <canvas ref={canvasRef} width={800} height={600}
            style={{ display: "block", maxWidth: "100%", maxHeight: "calc(100vh - 140px)" }} />
          <canvas ref={overlayRef} width={800} height={600}
            style={{
              position: "absolute", inset: 0, maxWidth: "100%", maxHeight: "calc(100vh - 140px)",
              cursor: activeTool === "brush" ? "crosshair" : activeTool === "eraser" ? "cell" : "default",
            }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
          />
          {layers.length === 0 && (
            <div style={S.dropOverlay}>
              <div style={{ fontSize: 32 }}>⬡</div>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>Drop image or video</div>
              <div style={{ fontSize: 10, color: "#2a2a2a" }}>or use Import buttons above</div>
            </div>
          )}
        </div>

        {/* VIDEO FRAMES STRIP */}
        {videoFrames.length > 0 && (
          <div style={{
            position: "absolute", bottom: 8, left: 0, right: 0,
            display: "flex", gap: 4, padding: "0 12px", overflowX: "auto",
            background: "rgba(0,0,0,0.8)",
          }}>
            {videoFrames.map((f, i) => (
              <div key={i}
                style={{
                  flexShrink: 0, width: 60, height: 40, cursor: "pointer",
                  border: activeFrame === i ? "1px solid #c8a96e" : "1px solid #222",
                  borderRadius: 2, overflow: "hidden",
                }}
                onClick={() => { setActiveFrame(i); importFrameToCanvas(f); }}>
                <img src={f.dataUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div style={S.rightPanel}>
        <span style={S.sectionTitle}>Layers</span>
        <div style={{ marginBottom: 8, padding: "0 12px" }}>
          <button style={S.btn("gold")} onClick={() => {
            const id = Date.now();
            setLayers((prev) => [...prev, {
              id, name: "New Layer", imageData: null,
              visible: true, opacity: 100, blendMode: "source-over", filter: "",
            }]);
            setActiveLayer(id);
          }}>+ Add Layer</button>
        </div>
        <div>
          {[...layers].reverse().map((layer) => (
            <div key={layer.id} style={S.layerItem(activeLayer === layer.id)}
              onClick={() => setActiveLayer(layer.id)}>
              <span style={{ fontSize: 12, cursor: "pointer", opacity: layer.visible ? 1 : 0.3 }}
                onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}>◉</span>
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{layer.name}</span>
              <span style={{ opacity: 0.4, cursor: "pointer", fontSize: 10 }}
                onClick={(e) => { e.stopPropagation(); duplicateLayer(layer.id); }}>⊕</span>
              <span style={{ opacity: 0.4, cursor: "pointer", fontSize: 10, color: "#a04040" }}
                onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}>✕</span>
            </div>
          ))}
        </div>

        {activeLayer && (
          <>
            <span style={S.sectionTitle}>Layer Opacity</span>
            <div style={S.section}>
              <input type="range" min={0} max={100}
                value={layers.find((l) => l.id === activeLayer)?.opacity || 100}
                style={S.slider}
                onChange={(e) => setLayers((prev) => prev.map((l) =>
                  l.id === activeLayer ? { ...l, opacity: Number(e.target.value) } : l
                ))} />
            </div>
          </>
        )}

        <span style={S.sectionTitle}>Background Removal</span>
        <div style={{ ...S.section, padding: "0 12px 12px" }}>
          <button style={S.btn()} onClick={removeBackground} disabled={isRemoving}>
            {isRemoving ? "Removing…" : "Remove BG"}
          </button>
          <div style={{ fontSize: 9, color: "#333", marginTop: 4 }}>
            Requires remove.bg API key in Settings
          </div>
        </div>

        <span style={S.sectionTitle}>AI Suggestion</span>
        <div style={{ padding: "0 12px 12px" }}>
          <textarea
            placeholder="Concept (optional)…&#10;e.g. obsidian warrior, kintsugi fractures"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            style={{ ...S.input, height: 64, resize: "none", marginBottom: 6 }}
          />
          <button style={S.btn("gold")} onClick={runAISuggestion} disabled={isProcessing}>
            {isProcessing ? "Processing…" : "▶ Run Render Elite"}
          </button>
        </div>

        {aiResult && (
          <div style={S.aiCard}>
            <div style={{ fontSize: 9, color: "#c8a96e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>AI Result</div>
            {aiResult.image_url && (
              <img src={aiResult.image_url} alt="AI result"
                style={{ width: "100%", borderRadius: 3, marginBottom: 6, border: "1px solid #222" }} />
            )}
            {aiResult.prompt_used && (
              <div style={{ fontSize: 9, color: "#555", lineHeight: 1.5, marginBottom: 8 }}>{aiResult.prompt_used}</div>
            )}
            <button style={S.btn("gold")} onClick={applyAIResult}>+ Add as Layer</button>
            <button style={S.btn()} onClick={() => setAiResult(null)}>Dismiss</button>
          </div>
        )}
      </div>

      {/* STATUSBAR */}
      <div style={S.statusbar}>
        <span style={{ color: "#c8a96e", letterSpacing: "0.1em" }}>⬡ RENDER ELITE</span>
        <span>{statusMsg}</span>
        <div style={{ flex: 1 }} />
        <span>{layers.length} layer{layers.length !== 1 ? "s" : ""}</span>
        {videoFrames.length > 0 && <span>{videoFrames.length} frames</span>}
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div style={S.modalOverlay} onClick={() => setShowSettings(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c8a96e" }}>Settings</div>
            <div>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Render Elite Endpoint</div>
              <input style={S.input} value={renderEndpoint}
                onChange={(e) => setRenderEndpoint(e.target.value)}
                placeholder="https://your-app.replit.app/render-elite" />
              <div style={{ fontSize: 9, color: "#333", marginTop: 4 }}>Your Replit /render-elite endpoint URL</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Remove.bg API Key</div>
              <input style={S.input} value={removeBgKey} type="password"
                onChange={(e) => setRemoveBgKey(e.target.value)}
                placeholder="Your remove.bg API key" />
              <div style={{ fontSize: 9, color: "#333", marginTop: 4 }}>Get a free key at remove.bg — 50 free images/month</div>
            </div>
            <button style={{ ...S.btn("gold"), marginTop: 8 }} onClick={() => setShowSettings(false)}>Save & Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

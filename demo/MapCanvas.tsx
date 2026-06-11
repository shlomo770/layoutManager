import { memo, useEffect, useRef, useState } from "react";

let GLOBAL_INIT_COUNT = 0;

/**
 * A stand-in for a real GIS / WebGL map engine (Cesium, Mapbox, deck.gl, …),
 * mounted in the generic `center` slot. It runs a continuous
 * requestAnimationFrame loop drawing a scanning radar grid + moving contacts
 * on a <canvas>, demonstrating that the `center` region hosts arbitrary
 * heavyweight content.
 */
function MapCanvasImpl() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initCount, setInitCount] = useState(0);

  useEffect(() => {
    GLOBAL_INIT_COUNT += 1;
    setInitCount(GLOBAL_INIT_COUNT);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let t = 0;

    const contacts = Array.from({ length: 14 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      hue: Math.random() > 0.7 ? 0 : Math.random() > 0.5 ? 45 : 160,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      bg.addColorStop(0, "#0a1430");
      bg.addColorStop(1, "#05070f");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0, 242, 254, 0.06)";
      ctx.lineWidth = 1;
      const step = 64;
      for (let x = (t * 0.2) % step; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const cx = w / 2;
      const cy = h / 2;
      const sweep = (t * 0.01) % (Math.PI * 2);
      const sweepGrad = ctx.createConicGradient ? ctx.createConicGradient(sweep, cx, cy) : null;
      if (sweepGrad) {
        sweepGrad.addColorStop(0, "rgba(0,242,254,0.18)");
        sweepGrad.addColorStop(0.08, "rgba(0,242,254,0)");
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(w, h), 0, Math.PI * 2);
        ctx.fill();
      }

      for (const c of contacts) {
        c.x += c.vx;
        c.y += c.vy;
        if (c.x < 0 || c.x > 1) c.vx *= -1;
        if (c.y < 0 || c.y > 1) c.vy *= -1;
        const px = c.x * w;
        const py = c.y * h;
        const pulse = 3 + Math.sin(t * 0.08 + c.x * 10) * 1.5;
        ctx.beginPath();
        ctx.arc(px, py, pulse, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${c.hue}, 100%, 60%)`;
        ctx.shadowColor = `hsl(${c.hue}, 100%, 60%)`;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "4px 12px",
          borderRadius: 999,
          fontFamily: "var(--c2-font-mono)",
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "var(--c2-text-dim)",
          background: "rgba(5,7,15,0.6)",
          border: "1px solid rgba(0,242,254,0.15)",
          pointerEvents: "none",
        }}
      >
        MAP CANVAS · CENTER REGION · INIT #{initCount}
      </div>
    </div>
  );
}

/** Memoized to avoid re-rendering the canvas on unrelated host updates. */
export const MapCanvas = memo(MapCanvasImpl);
MapCanvas.displayName = "MapCanvas";

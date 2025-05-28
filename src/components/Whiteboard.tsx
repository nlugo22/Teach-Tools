import React, { useEffect, useRef, useState } from "react";
import WhiteboardControls from "./WhiteboardControls";

type Point = { x: number; y: number };
type Line = { points: Point[]; color: string; width: number };
type DrawingEvent = React.MouseEvent | React.TouchEvent;

const Whiteboard = () => {
  /* ──────────────────────────── state / refs ─────────────────────────── */
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [lines, setLines] = useState<Line[]>([]);
  const [showGrid, setShowGrid] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const gridCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPosRef = useRef<Point | null>(null);

  /* ───────────────────────────── canvas setup ────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const gridCanvas = gridCanvasRef.current;

    if (canvas && gridCanvas) {
      // Match viewport size (you can replace with parent width/height logic if you prefer)
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gridCanvas.width = window.innerWidth;
      gridCanvas.height = window.innerHeight;

      ctxRef.current = canvas.getContext("2d");
      gridCtxRef.current = gridCanvas.getContext("2d");

      if (ctxRef.current) {
        ctxRef.current.lineCap = "round";
        ctxRef.current.lineJoin = "round";
        ctxRef.current.lineWidth = lineWidth;
        ctxRef.current.strokeStyle = currentColor;
      }
    }
  }, []);

  /* ─────────────────────────── color / width updates ─────────────────── */
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = currentColor;
      ctxRef.current.lineWidth = lineWidth;
    }
  }, [lineWidth, currentColor]);

  /* ─────────────────────────── tab change load ───────────────────────── */
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const saved = localStorage.getItem(`whiteboardDrawing-${activeTab}`);
    if (saved) {
      const parsed: Line[] = JSON.parse(saved);
      setLines(parsed);
      redrawCanvas(parsed, ctx);
    } else {
      setLines([]);
    }
  }, [activeTab]);

  /* ────────────────────────── grid helper ────────────────────────────── */
  const toggleGrid = () => setShowGrid((prev) => !prev);
  useEffect(() => {
    drawGridLines(showGrid);
  }, [showGrid]);

  const drawGridLines = (show: boolean) => {
    const gridCtx = gridCtxRef.current;
    const gridCanvas = gridCanvasRef.current;
    if (!gridCtx || !gridCanvas) return;

    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

    if (show) {
      gridCtx.strokeStyle = "#000000";
      gridCtx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x < gridCanvas.width; x += gridSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, gridCanvas.height);
        gridCtx.stroke();
      }
      for (let y = 0; y < gridCanvas.height; y += gridSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(gridCanvas.width, y);
        gridCtx.stroke();
      }
    }
  };

  /* ─────────────────────────── drawing handlers ──────────────────────── */
  const getEventCoordinates = (e: DrawingEvent): Point => {
    if ("touches" in e) {
      const touch = e.touches[0];
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    const m = e as React.MouseEvent;
    return { x: m.nativeEvent.offsetX, y: m.nativeEvent.offsetY };
  };

  const startDrawing = (e: DrawingEvent) => {
    const pos = getEventCoordinates(e);
    lastPosRef.current = pos;
    setIsDrawing(true);

    if (!isErasing) {
      const ctx = ctxRef.current;
      if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + 1, pos.y + 1);
        ctx.stroke();
      }
      setLines((prev) => [
        ...prev,
        { points: [pos], color: currentColor, width: lineWidth },
      ]);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
    setLines((prev) => {
      localStorage.setItem(
        `whiteboardDrawing-${activeTab}`,
        JSON.stringify(prev),
      );
      return prev;
    });
  };

  const draw = (e: DrawingEvent) => {
    if (!canvasRef.current) return;
    const pos = getEventCoordinates(e);

    if (isErasing) {
      handleErasing(pos);
    } else if (isDrawing) {
      const ctx = ctxRef.current;
      const last = lastPosRef.current;
      if (!ctx || !last) return;

      setLines((prev) => {
        if (prev.length === 0) return prev;
        const lastLine = prev[prev.length - 1];

        ctx.strokeStyle = lastLine.color;
        ctx.lineWidth = lastLine.width;
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        const updatedLine: Line = {
          ...lastLine,
          points: [...lastLine.points, pos],
        };

        return [...prev.slice(0, -1), updatedLine];
      });

      lastPosRef.current = pos;
    }
  };

  const handleErasing = (pos: Point) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const eraserSize = lineWidth * 2;

    const remaining = lines.filter(
      (line) =>
        !line.points.some(
          (p) => Math.hypot(p.x - pos.x, p.y - pos.y) <= eraserSize,
        ),
    );

    setLines(remaining);
    redrawCanvas(remaining, ctx);
  };

  const redrawCanvas = (lns: Line[], ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    lns.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.beginPath();
      line.points.forEach((p, i) =>
        i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y),
      );
      ctx.stroke();
    });
  };

  /* ─────────────────────────── helpers for controls ──────────────────── */
  const handleLineWidthChange = (w: number) => setLineWidth(w);
  const handleLineColor = (c: string) => {
    setCurrentColor(c);
    setIsErasing(false);
  };
  const clearCanvas = () => {
    ctxRef.current?.clearRect(
      0,
      0,
      canvasRef.current!.width,
      canvasRef.current!.height,
    );
    localStorage.removeItem(`whiteboardDrawing-${activeTab}`);
    setLines([]);
  };
  const toggleEraser = () => setIsErasing((prev) => !prev);
  const handleActiveTabChange = (tab: number) => setActiveTab(tab);

  /* ────────────────────────────── render ─────────────────────────────── */
  return (
    <div className="relative min-h-screen w-screen">
      {/* ───   Controls     ────────────────────────────────────────────────────── */}
        <WhiteboardControls
          activeTab={activeTab}
          handleActiveTabChange={handleActiveTabChange}
          setLineWidth={handleLineWidthChange}
          setLineColor={handleLineColor}
          clearCanvas={clearCanvas}
          toggleEraser={toggleEraser}
          toggleGrid={toggleGrid}
          isErasing={isErasing}
        />

      {/* ─── Drawing area ───────────────────────────────────────────────── */}
      {/* Grid canvas (below, no pointer events) */}
      <canvas
        ref={gridCanvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Main drawing canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
        style={{ touchAction: "none" }}
      />
    </div>
  );
};

export default Whiteboard;

import React, { useEffect, useRef, useState } from "react";
import WhiteboardControls from "./WhiteboardControls";

type Point = { x: number; y: number };
type Line = { points: Point[]; color: string; width: number };
type DrawingEvent = React.MouseEvent | React.TouchEvent;

const TAB_IDS = [1, 2, 3];
const STORAGE_KEY = "whiteboardLinesAndTexts";

const Whiteboard = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [showGrid, setShowGrid] = useState(false);

  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const ctxRefs = useRef<Record<number, CanvasRenderingContext2D | null>>({});
  const gridCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const gridCtxRefs = useRef<Record<number, CanvasRenderingContext2D | null>>(
    {},
  );
  const lastPosRef = useRef<Point | null>(null);
  const isErasingRef = useRef<boolean>(false);

  const linesRef = useRef<Record<number, Line[]>>({ 1: [], 2: [], 3: [] });
  const undoStackRef = useRef<Record<number, Line[][]>>({
    1: [],
    2: [],
    3: [],
  });
  const redoStackRef = useRef<Record<number, Line[][]>>({
    1: [],
    2: [],
    3: [],
  });

  /* ─────────── Load from Local Storage ─────────── */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          lines: Record<number, Line[]>;
        };
        TAB_IDS.forEach((tabId) => {
          if (parsed.lines?.[tabId])
            linesRef.current[tabId] = parsed.lines[tabId];
        });
      } catch {
        console.warn("Failed to parse saved lines/texts from localStorage");
      }
    }
  }, []);

  /* ─────────── Canvas Setup ─────────── */
  useEffect(() => {
    TAB_IDS.forEach((tabId) => {
      const canvas = canvasRefs.current[tabId];
      const gridCanvas = gridCanvasRefs.current[tabId];
      if (canvas && gridCanvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gridCanvas.width = window.innerWidth;
        gridCanvas.height = window.innerHeight;

        const ctx = canvas.getContext("2d");
        const gridCtx = gridCanvas.getContext("2d");

        if (ctx) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
        }

        ctxRefs.current[tabId] = ctx;
        gridCtxRefs.current[tabId] = gridCtx;

        drawGridLines(gridCtx, gridCanvas, showGrid);
        redrawCanvas(tabId);
      }
    });
  }, []);

  /* ─────────── Local Storage ─────────── */
  const saveToStorage = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lines: linesRef.current}),
    );
  };

  /* ─────────── Drawing Helpers ─────────── */
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
    if (!isErasingRef.current) {
      const newLine: Line = {
        points: [pos],
        color: currentColor,
        width: lineWidth,
      };
      linesRef.current[activeTab].push(newLine);
      undoStackRef.current[activeTab].push([...linesRef.current[activeTab]]);
      redoStackRef.current[activeTab] = [];
      drawLineSegment(newLine, ctxRefs.current[activeTab]);
      saveToStorage();
    }
  };

  const draw = (e: DrawingEvent) => {
    if (!lastPosRef.current) return;
    const pos = getEventCoordinates(e);
    const last = lastPosRef.current;
    const ctx = ctxRefs.current[activeTab];
    if (!ctx) return;

    if (isErasingRef.current) {
      handleErasing(pos);
    } else {
      const currentLine = linesRef.current[activeTab].slice(-1)[0];
      if (!currentLine) return;

      ctx.strokeStyle = currentLine.color;
      ctx.lineWidth = currentLine.width;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      currentLine.points.push(pos);
      saveToStorage();
    }

    lastPosRef.current = pos;
  };

  const stopDrawing = () => {
    lastPosRef.current = null;
  };

  /* ─────────── Drawing / Erasing ─────────── */
  const handleErasing = (pos: Point) => {
    const ctx = ctxRefs.current[activeTab];
    if (!ctx) return;
    const eraserSize = lineWidth * 2;
    const remaining = linesRef.current[activeTab].filter(
      (line) =>
        !line.points.some(
          (p) => Math.hypot(p.x - pos.x, p.y - pos.y) <= eraserSize,
        ),
    );
    linesRef.current[activeTab] = remaining;
    redrawCanvas(activeTab);
    saveToStorage();
  };

  const drawLineSegment = (
    line: Line,
    ctx: CanvasRenderingContext2D | null,
  ) => {
    if (!ctx) return;
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.width;
    ctx.beginPath();
    line.points.forEach((p, i) =>
      i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y),
    );
    ctx.stroke();
  };

  const redrawCanvas = (tabId: number) => {
    const ctx = ctxRefs.current[tabId];
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw lines
    linesRef.current[tabId].forEach((line) => drawLineSegment(line, ctx));

  };

  /* ─────────── Grid ─────────── */
  const toggleGrid = () => {
    setShowGrid((prev) => {
      const newVal = !prev;
      TAB_IDS.forEach((tabId) => {
        const ctx = gridCtxRefs.current[tabId];
        const canvas = gridCanvasRefs.current[tabId];
        drawGridLines(ctx, canvas, newVal);
      });
      return newVal;
    });
  };

  const drawGridLines = (
    ctx: CanvasRenderingContext2D | null,
    canvas: HTMLCanvasElement | null,
    show: boolean,
  ) => {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!show) return;
    const size = 50;
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += size) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  /* ─────────── Clear / Undo / Redo ─────────── */
  const clearCanvas = () => {
    const ctx = ctxRefs.current[activeTab];
    if (!ctx) return;
    undoStackRef.current[activeTab].push([...linesRef.current[activeTab]]);
    redoStackRef.current[activeTab] = [];
    linesRef.current[activeTab] = [];
    redrawCanvas(activeTab);
    saveToStorage();
  };

  const undo = () => {
    const stack = undoStackRef.current[activeTab];
    if (!stack || stack.length === 0) return;
    const prevState = stack.pop()!;
    redoStackRef.current[activeTab].push([...linesRef.current[activeTab]]);
    linesRef.current[activeTab] = prevState;
    redrawCanvas(activeTab);
    saveToStorage();
  };

  const redo = () => {
    const stack = redoStackRef.current[activeTab];
    if (!stack || stack.length === 0) return;
    const nextState = stack.pop()!;
    undoStackRef.current[activeTab].push([...linesRef.current[activeTab]]);
    linesRef.current[activeTab] = nextState;
    redrawCanvas(activeTab);
    saveToStorage();
  };

  const toggleEraser = () => {
    isErasingRef.current = !isErasingRef.current;
  };

  /* ─────────── Render ─────────── */
  return (
    <div className="relative w-screen h-screen">
      {/* Whiteboard Controls */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto">
        <WhiteboardControls
          activeTab={activeTab}
          clearCanvas={clearCanvas}
          undo={undo}
          redo={redo}
          toggleEraser={toggleEraser}
          toggleGrid={toggleGrid}
          setLineColor={setCurrentColor}
          setLineWidth={setLineWidth}
          isErasing={isErasingRef.current}
          handleActiveTabChange={(tab) => {
            setActiveTab(tab);
            redrawCanvas(tab);
          }}
        />
      </div>

      {/* Grid Canvases */}
      {TAB_IDS.map((tabId) => (
        <canvas
          key={`grid-${tabId}`}
          ref={(el) => (gridCanvasRefs.current[tabId] = el)}
          className={`absolute inset-0 z-0 pointer-events-none ${
            tabId === activeTab ? "" : "hidden"
          }`}
        />
      ))}

      {/* Drawing Canvases */}
      {TAB_IDS.map((tabId) => (
        <canvas
          key={`draw-${tabId}`}
          ref={(el) => (canvasRefs.current[tabId] = el)}
          className={`absolute inset-0 z-10 ${
            tabId === activeTab ? "" : "hidden"
          }`}
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
      ))}
    </div>
  );
};

export default Whiteboard;

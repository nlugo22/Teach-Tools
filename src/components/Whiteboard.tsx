import React, { useEffect } from "react";
import { useState, useRef } from "react";
import WhiteboardControls from "./WhiteboardControls";
import "../styles/Whiteboard.css";

type Line =  {
  points: { x: number, y: number }[],
  color: string,
  width: number,
}

type DrawingEvent = React.MouseEvent | React.TouchEvent;

const Whiteboard = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [lines, setLines] = useState<Line[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const gridCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // init canvas sized
  useEffect(() => {
    const canvas = canvasRef.current;
    const gridCanvas = gridCanvasRef.current;

    if (canvas && gridCanvas) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;
      gridCanvas.width = width;
      gridCanvas.height = height;

      ctxRef.current = canvas.getContext("2d");
      gridCtxRef.current = gridCanvas.getContext("2d");

      // init drawing canvas setup
      if (ctxRef.current) {
        ctxRef.current.lineCap = "round";
        ctxRef.current.lineWidth = lineWidth;
        ctxRef.current.strokeStyle = currentColor;
      }

      // load saved drawing if exists
      const savedDrawing = localStorage.getItem("whiteboardDrawing");
      if (savedDrawing && ctxRef.current) {
        const savedLines: Line[] = JSON.parse(savedDrawing);
        setLines(savedLines);
        redrawCanvas(savedLines, ctxRef.current);
      }
    }
  }, []);

  // Update for color or line changes
  useEffect(() => {
    if (!ctxRef.current) return;

    ctxRef.current.strokeStyle = currentColor;
    ctxRef.current.lineWidth = lineWidth;
  }, [lineWidth, currentColor]);

  const drawGridLines = (show: boolean) => {
    const gridCtx = gridCtxRef.current;
    const gridCanvas = gridCanvasRef.current;

    if (!gridCtx || !gridCanvas) return;

    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

    if (show) {
      // draw the grid lines
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

  const startDrawing = (e: DrawingEvent) => {
    const { x, y } = getEventCoordinates(e);
    setIsDrawing(true);
    lastPosRef.current = { x, y };

    // Immediately draw the dot on canvas
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);  // Use arc to draw a dot
      ctx.fillStyle = currentColor;
      ctx.fill();
    }

    setLines((prev) => [...prev, { points: [{ x, y }], color: currentColor, width: lineWidth }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;

    // Save lines to storage
    localStorage.setItem("whiteboardDrawing", JSON.stringify(lines));
  };

  const draw = (e: DrawingEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const { x, y } = getEventCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx || !lastPosRef.current) return;

    // begin drawing
    ctx.beginPath(); // start a new path on the canvas
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y); // move the pen to the starting point
    ctx.lineTo(x, y); // draws a straight line to mouse coordinates
    ctx.stroke(); // draws the actual line seen

    lastPosRef.current = { x, y };

    // Update current lines
    setLines((prev) => {
      const updatedLines = [...prev];
      const currentLine = updatedLines[updatedLines.length - 1];
      if (currentLine) {
        currentLine.points.push({ x, y });
      }
      return updatedLines;
    });
  };

  const redrawCanvas = (lines: Line[], ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    lines.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;

      ctx.beginPath();
      line.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });
  };

  const getEventCoordinates = (e: DrawingEvent): { x: number; y: number } => {
    if ("touches" in e) {
      const touch = e.touches[0];
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      const mouseEvent = e as React.MouseEvent;
      return {
        x: mouseEvent.nativeEvent.offsetX,
        y: mouseEvent.nativeEvent.offsetY,
      };
    }
  };

  /****************************************
   *   Whiteboard control functionality   *
   ****************************************/
  const handleLineWidthChange = (width: number) => {
    setLineWidth(width);
  };

  const handleLineColor = (color: string) => {
    setCurrentColor(color);
  };

  const clearCanvas = () => {
    if (ctxRef.current && canvasRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
    }

    // Clear saved drawing
    localStorage.removeItem("whiteboardDrawing");
    setLines([]);
  };

  return (
    <div className="whiteboard-container">
      <WhiteboardControls
        setLineWidth={handleLineWidthChange}
        setLineColor={handleLineColor}
        clearCanvas={clearCanvas}
        drawGridLines={drawGridLines}
      />

      {/* Canvas for gridlines */}
      <div className="canvas-container">
        <canvas
          ref={gridCanvasRef}
          style={{
            position: "absolute",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Main drawing canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          style={{
            position: "absolute",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

export default Whiteboard;

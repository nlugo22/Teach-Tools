import { useState, useRef, useEffect } from "react";
import WhiteboardControls from "./WhiteboardControls";

type Point = {
  x: number;
  y: number;
};

type Line = {
  points: Point[];
  color: string;
  width: number;
};

type DrawingEvent = React.MouseEvent | React.TouchEvent;

const Whiteboard = () => {
  /* DATA FOR TABS */
  const [activeTab, setActiveTab] = useState<number>(1);

  /* DRAWING VARIABLES */
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [linesByTab, setLinesByTab] = useState<Line[]>([]);

  /* REFS AND CONTEXT */
  const canvasRef = useRef<(HTMLCanvasElement | null)>();
  const gridCanvasRef = useRef<(HTMLCanvasElement | null)>();
  const ctxRef = useRef<(CanvasRenderingContext2D | null)>();
  const gridCtxRef = useRef<(CanvasRenderingContext2D | null)>();

  const lastPosRef = useRef<Point | null>(null);

  // init canvas sizes
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

      const ctx = canvas.getContext("2d");
      const gridCtx = canvas.getContext("2d");

      if (ctx) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = currentColor;
      }

      ctxRef.current = ctx;
      gridCtxRef.current = gridCtx;
    }
  }, []);

  // Update for color or line changes
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
  }, [lineWidth, currentColor]);

  // load drawing on tab change
  useEffect(() => {
    const savedDrawing = localStorage.getItem(`whiteboardDrawing-${activeTab}`);
    if (savedDrawing) {
      const savedLines = JSON.parse(savedDrawing);
      setLinesByTab(() => {
        const updatedLines: Line[] = savedLines || [];
        return updatedLines;
      });

      const ctx = ctxRef.current;
      if (ctx) {
        redrawCanvas(savedLines || [], ctx);
      }
    }
  }, [activeTab]);

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
    e.preventDefault();
    const pos = getEventCoordinates(e);
    lastPosRef.current = pos;
    setIsDrawing(true);

    if (!isErasing) {
      const ctx = ctxRef.current;
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + 1, pos.y + 1);
        ctx.stroke();
      }

      setLinesByTab((prev) => [
        ...prev,
        { points: [pos], color: currentColor, width: lineWidth },
      ]); 
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
    localStorage.setItem( `whiteboardDrawing-${activeTab}`, JSON.stringify(Array.from(linesByTab.entries())));
  };

  const draw = (e: DrawingEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getEventCoordinates(e);
    const ctx = ctxRef.current;

    if (isErasing) {
      handleErasing(pos);
    } else {
      if (ctx && lastPosRef.current) {
        // begin drawing
        ctx.beginPath(); // start a new path on the canvas
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y); // move the pen to the starting point
        ctx.lineTo(pos.x, pos.y); // draws a straight line to mouse coordinates
        ctx.stroke(); // draws the actual line seen
      }

      // Update current lines
      setLinesByTab((prev) => {
        const newLines = [...prev];
        const lastLine = newLines[newLines.length - 1];
        if (lastLine) {
            lastLine.points.push(pos);
        }
        return newLines;
      });

      lastPosRef.current = pos;
    }
  };

  const handleErasing = (currentPos: Point) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const eraserSize = lineWidth * 2;

    const newLines = (linesByTab.get(activeTab) || []).filter((line) => {
      return !line.points.some((point) => {
        const distanceSquared =
          Math.pow(point.x - currentPos.x, 2) + Math.pow(point.y - currentPos.y, 2);
        return distanceSquared <= Math.pow(eraserSize, 2);
      });
    });

    setLinesByTab((prev) => {
      const updatedLines = new Map(prev);
      updatedLines.set(activeTab, newLines);
      return updatedLines;
    });

    redrawCanvas(newLines, ctx);
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

  const handleLineWidthChange = (width: number) => {
    setLineWidth(width);
  };

  const handleLineColor = (color: string) => {
    setCurrentColor(color);
    setIsErasing(false);
  };

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Clear saved drawing
    localStorage.removeItem(`whiteboardDrawing-${activeTab}`);
    setLinesByTab(new Map());
  };

  const toggleEraser = () => {
    setIsErasing((prev) => !prev);
  };

  const handleActiveTabChange = (tab: number) => { setActiveTab(tab) }

  return (
    <div className="container-fluid p-0 m-0">
      <WhiteboardControls
        handleActiveTabChange={handleActiveTabChange}
        setLineWidth={handleLineWidthChange}
        setLineColor={handleLineColor}
        clearCanvas={clearCanvas}
        drawGridLines={drawGridLines}
        toggleEraser={toggleEraser}
        isErasing={isErasing}
      />

      <div className="position-relative" style={{ touchAction: "none" }}>
        {/* Canvas for gridlines */}
        <canvas
          className="position-absolute"
          ref={(el) => (gridCanvasRef.current = el)}
          style={{
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Main drawing canvas */}
        <canvas
          className="position-absolute"
          ref={(el) => (canvasRef.current = el)}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          style={{
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

export default Whiteboard;

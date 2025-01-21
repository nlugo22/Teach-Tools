import { useState, useRef, useEffect } from "react";
import WhiteboardControls from "./WhiteboardControls";
import Tabs from "./Tabs";

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
  const [activeTab, setActiveTab] = useState<number>(0);

  /* DRAWING VARIABLES */
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [linesByTab, setLinesByTab] = useState<{ [tab: number]: Line[] }>({});

  /* REFS AND CONTEXT */
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const gridCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const ctxRefs = useRef<(CanvasRenderingContext2D | null)[]>([]);
  const gridCtxRefs = useRef<(CanvasRenderingContext2D | null)[]>([]);

  const lastPosRef = useRef<Point | null>(null);

  // init canvas sizes
  useEffect(() => {
    const canvas = canvasRefs.current[activeTab];
    const gridCanvas = gridCanvasRefs.current[activeTab];

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

      ctxRefs.current[activeTab] = ctx;
      gridCtxRefs.current[activeTab] = gridCtx;
    }
  }, []);

  // Update for color or line changes
  useEffect(() => {
    const ctx = ctxRefs.current[activeTab];
    if (!ctx) return;
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
  }, [lineWidth, currentColor]);

  useEffect(() => {
    const canvas = canvasRefs.current[activeTab];
    const ctx = ctxRefs.current[activeTab];

    if (canvas && ctx) {
      const savedDrawing = localStorage.getItem(`whiteboardDrawing-${activeTab}`);

      if (savedDrawing) {
        const savedLines = JSON.parse(savedDrawing);

        setLinesByTab((prev) => ({
          ...prev,
          [activeTab]: savedLines[activeTab] || [],
        }));

        redrawCanvas(savedLines[activeTab] || [], ctx);
      }
    }
  }, [activeTab])

  const drawGridLines = (show: boolean) => {
    const gridCtx = gridCtxRefs.current[activeTab];
    const gridCanvas = gridCanvasRefs.current[activeTab];

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
      // immediately draw a dot on canvas
      const ctx = ctxRefs.current[activeTab];
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }

      setLinesByTab((prev) => ({
        ...prev,
        activeTab: {
          points: [{ x: pos.x, y: pos.y }],
          color: currentColor,
          width: lineWidth,
        },
      }));
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
    localStorage.setItem(
      `whiteboardDrawing-${activeTab}`,
      JSON.stringify(linesByTab),
    );
  };

  const draw = (e: DrawingEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getEventCoordinates(e);
    const ctx = ctxRefs.current[activeTab];

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

      lastPosRef.current = pos;

      // Update current lines
      setLinesByTab((prev) => {
        const lines = prev[activeTab] || [];
        const lastLine = lines[lines.length - 1];
        if (lastLine) {
          lastLine.points.push({ x: pos.x, y: pos.y });
        }
        return { [activeTab]: lines };
      });
    }
  };

  const handleErasing = (currentPos: Point) => {
    if (!isDrawing) return;
    const ctx = ctxRefs.current[activeTab];
    if (!ctx) return;
    const eraserSize = lineWidth * 2;

    const newLines = linesByTab[activeTab].filter((line) => {
      return !line.points.some((point) => {
        const distanceSquared =
          Math.pow(point.x - currentPos.x, 2) +
          Math.pow(point.y - currentPos.y, 2);
        return distanceSquared <= Math.pow(eraserSize, 2);
      });
    });

    setLinesByTab({ [activeTab]: newLines });
    redrawCanvas(newLines, ctx);
  };

  const redrawCanvas = (lines: Line[], ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (!lines) return;

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
    const ctx = ctxRefs.current[activeTab];
    const canvas = canvasRefs.current[activeTab];
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Clear saved drawing
    localStorage.removeItem(`whiteboardDrawing-${activeTab}`);
    setLinesByTab({});
  };

  const toggleEraser = () => {
    setIsErasing((prev) => !prev);
  };

  return (
    <div className="container-fluid p-0 m-0">
      <WhiteboardControls
        setLineWidth={handleLineWidthChange}
        setLineColor={handleLineColor}
        clearCanvas={clearCanvas}
        drawGridLines={drawGridLines}
        toggleEraser={toggleEraser}
        isErasing={isErasing}
      />

      <Tabs
        tabs={["Tab 1", "Tab 2", "Tab 3"]}
        activeTab={activeTab}
        onTabChange={(index: number) => {
          setActiveTab(index);
        }}
      />
      <div className="position-relative" style={{ touchAction: "none" }}>
        {/* Canvas for gridlines */}
        <canvas
          className="position-absolute"
          ref={(el) => (gridCanvasRefs.current[activeTab] = el)}
          style={{
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Main drawing canvas */}
        <canvas
          className="position-absolute"
          ref={(el) => (canvasRefs.current[activeTab] = el)}
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

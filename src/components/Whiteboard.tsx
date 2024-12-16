import React, { useEffect } from 'react'
import { useState, useRef } from 'react';
import WhiteboardControls from './WhiteboardControls';
import '../styles/Whiteboard.css'

const Whiteboard = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [currentColor, setCurrentColor] = useState<string>('black');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const gridCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPosRef = useRef<{ x: number, y: number } | null>(null);

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

      ctxRef.current = canvas.getContext('2d');
      gridCtxRef.current = gridCanvas.getContext('2d');

      // init drawing canvas setup
      if (ctxRef.current) {
        ctxRef.current.lineCap = "round";
        ctxRef.current.lineWidth = lineWidth;
        ctxRef.current.strokeStyle = currentColor;
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

  const startDrawing = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    lastPosRef.current = { x: offsetX, y: offsetY };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext("2d");

    if (!ctx || !lastPosRef.current) return;

    // begin drawing
    ctx.beginPath(); // start a new path on the canvas
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y); // move the pen to the starting point
    ctx.lineTo(offsetX, offsetY); // draws a straight line to mouse coordinates
    ctx.stroke(); // draws the actual line seen

    lastPosRef.current = ({ x: offsetX, y: offsetY });
  };


  /**************************************** 
   *   Whiteboard control functionality   *
   ****************************************/
  const handleLineWidthChange = (width: number) => { setLineWidth(width); };

  const handleLineColor = (color: string) => { setCurrentColor(color); };

  const clearCanvas = () => {
    if (ctxRef.current && canvasRef.current) {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
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
      <canvas
        ref={gridCanvasRef}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
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
        style={{
          position: 'absolute',
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default Whiteboard

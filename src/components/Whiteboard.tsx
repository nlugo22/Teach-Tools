import React from 'react'
import Canvas from './Canvas'
import { useEffect, useState, useRef } from 'react';
import WhiteboardControls from './WhiteboardControls';

interface Props {
}

const Whiteboard = ({ }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [scaledLineWidth, setScaledLineWidth] = useState<number>(0);
  const [currentColor, setCurrentColor] = useState<string>('black');


  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;  // Internal width matches container width
      canvas.height = rect.height;  // Internal height matches container height
    }
  };

  const getMousePosition = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect(); // get canvas position in the viewport
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width), // Mouse X relative to the canvas, need because of css dynamic scaling
      y: (e.clientY - rect.top) * (canvas.height / rect.height), // Mouse Y relative to the canvas, need because css dynamic scaling
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    const pos = getMousePosition(e);
    setStartPoint(pos); // set the start position to the mouse position
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d'); // resets the context to 2d in case it was changed

    if (ctx) {
      const pos = getMousePosition(e);

      updateLineWidth(canvas, ctx);
      ctx.strokeStyle = currentColor;

      // begin drawing
      ctx.beginPath(); // start a new path on the canvas
      ctx.moveTo(startPoint.x, startPoint.y); // move the pen to the starting point
      ctx.lineTo(pos.x, pos.y); // draws a straight line to mouse coordinates
      ctx.stroke(); // draws the actual line seen
      setStartPoint(pos); // update the starting point for the next line segment
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const updateLineWidth = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Scale the line width to adjust to the width being dynamically positioned 
    const scaleX = canvas.width / canvas?.getBoundingClientRect().width;
    setScaledLineWidth(lineWidth * scaleX); // Adjust line width based on scaling factor
    ctx.lineWidth = scaledLineWidth; // set the current line width
  };

  useEffect(() => { // useEffect runs after each render
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      ctx.lineCap = 'round';
    }

    resizeCanvas();

    // Resize canvas when the window resizes
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

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
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <>
      <h1>Whiteboard</h1>
      <WhiteboardControls
        setLineWidth={handleLineWidthChange}
        setLineColor={handleLineColor}
        clearCanvas={clearCanvas}
      />
      <div className="whiteboard-container">
        <Canvas
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </>
  );
};

export default Whiteboard

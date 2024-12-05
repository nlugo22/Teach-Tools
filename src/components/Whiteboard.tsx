import React, { useEffect } from 'react'
import Canvas from './Canvas'
import { useState, useRef } from 'react';
import WhiteboardControls from './WhiteboardControls';

interface Props {
}

const Whiteboard = ({ }: Props) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number, y: number } | null>(null);
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [currentColor, setCurrentColor] = useState<string>('black');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setLastPos({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext("2d");

    if (!ctx || !lastPos) return;

    // begin drawing
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath(); // start a new path on the canvas
    ctx.moveTo(lastPos.x, lastPos.y); // move the pen to the starting point
    ctx.lineTo(offsetX, offsetY); // draws a straight line to mouse coordinates
    ctx.stroke(); // draws the actual line seen

    setLastPos({ x: offsetX, y: offsetY });
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
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
          ref={canvasRef}
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

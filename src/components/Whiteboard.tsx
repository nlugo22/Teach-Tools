import React, { useEffect } from 'react'
import { useState, useRef } from 'react';
import Canvas from './Canvas'
import WhiteboardControls from './WhiteboardControls';
import '../styles/Whiteboard.css'

interface Props {
}

const Whiteboard = ({ }: Props) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number, y: number } | null>(null);
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [currentColor, setCurrentColor] = useState<string>('black');
  const [gridLines, setGridLines] = useState(false);

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

  const getWidth = () => { if (canvasRef.current) canvasRef.current.width; }
  const getHeight = () => { if (canvasRef.current) canvasRef.current.height; }

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

  // const handleGridLines = (spacing: number) => {
  //   const width = getWidth();
  //   const height = getHeight();
  //
  //   if (canvasRef.current) {
  //     const ctx = canvasRef.current.getContext('2d');
  //     ctx?.clearRect(0, 0, width, height);
  //   }
  //
  //
  // };

  return (
    <div className="whiteboard-container">
      <WhiteboardControls
        setLineWidth={handleLineWidthChange}
        setLineColor={handleLineColor}
        clearCanvas={clearCanvas}
      />
      <div className="whiteboard-canvas-container">
        <Canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default Whiteboard

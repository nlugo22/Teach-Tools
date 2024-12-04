import React from "react";
import { forwardRef, MutableRefObject } from "react";
import { useEffect, useRef } from "react";

interface Props {
  onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

const canvas = forwardRef<HTMLCanvasElement, Props>(
  ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }: Props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }, []);

    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(canvasRef.current);
        } else {
          (ref as MutableRefObject<HTMLCanvasElement | null>).current = canvasRef.current;
        }
      }
    }, [ref]);

    return (
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      ></canvas>
    )
  });

export default canvas

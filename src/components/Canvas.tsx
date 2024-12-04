import { forwardRef, MutableRefObject } from "react";
import { useEffect, useRef } from "react";

interface Props {
  onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
}

const canvas = forwardRef<HTMLCanvasElement>(
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

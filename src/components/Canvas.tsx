import React, { forwardRef } from "react";

interface Props {
  onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

const Canvas = forwardRef<HTMLCanvasElement, Props>(
  ({ onMouseDown, onMouseMove, onMouseUp, onMouseLeave }, ref) => {

    return (
      <canvas
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      ></canvas>
    );
  }
);

export default Canvas;

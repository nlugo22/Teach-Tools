import React, { useEffect, useState } from "react";
import '../styles/Whiteboard.css'

interface Props {
  setLineWidth: (width: number) => void;
  setLineColor: (color: string) => void;
  clearCanvas: () => void;
  drawGridLines: (show: boolean) => void;
  toggleEraser: () => void;
  isErasing: boolean;
}

const WhiteboardControls = ({ setLineWidth, setLineColor, clearCanvas, drawGridLines, toggleEraser, isErasing }: Props) => {
  const [selectedWidth, setSelectedWidth] = useState<number>(5);
  const [gridLinesEnabled, setGridLinesEnabled] = useState(false);

  const handleLineWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const width = parseInt(e.target.value, 10); // select element stores data as string, need to convert it to base 10 number
    setSelectedWidth(width);
    setLineWidth(width);
  };

  const handleGridLineToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGridLinesEnabled(e.target.checked);
    drawGridLines(e.target.checked);
  }

  const eraserButtonClass = isErasing 
    ? 'btn btn-sm bg-secondary text-light'
    : 'btn btn-sm bg-light text-dark';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'e' || event.key === 'E') {
        toggleEraser();
      }
      if (event.key === 'q' || event.key === 'Q') {
        setLineColor('black');
      }
      if (event.key === 'r' || event.key === 'R') {
        setLineColor('red');
      }
      if (event.key === 'b' || event.key === 'B') {
        setLineColor('blue');
      }
      if (event.key === 'g' || event.key === 'G') {
        setLineColor('green');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleEraser, setLineColor]);

  return (
    <div className="p-0 m-0 bg-dark text-light">
      <h1 className="text-center py-2 mb-0">Whiteboard</h1>
      <div className="d-flex align-items-center gap-1 border-bottom border-dark">
        {/* Line width dropdown */}
        <select
          id="line-width"
          value={selectedWidth}
          onChange={handleLineWidthChange}
          className="form-select-sm"
        >
          <option value={2}>Small Line</option>
          <option value={5}>Medium Line</option>
          <option value={10}>Large Line</option>
          <option value={25}>Mega Line</option>
        </select>

        {/* Buttons for the pen color */}
        <button type="button" className='btn btn-sm bg-dark text-white' onClick={() => setLineColor('black')}>Black</button>
        <button type="button" className='btn btn-sm bg-danger text-white' onClick={() => setLineColor('red')}>Red</button>
        <button type="button" className='btn btn-sm bg-success text-white' onClick={() => setLineColor('green')}>Green</button>
        <button type="button" className='btn btn-sm bg-primary text-white' onClick={() => setLineColor('blue')}>Blue</button>

        {/* ERASER BUTTON */}
        <button type="button" className={eraserButtonClass} onClick={toggleEraser}>Eraser</button>

        {/* SHOW GRID LINES */}
        <label style={{ color: "white", }}>
          <input
            type="checkbox"
            checked={gridLinesEnabled}
            onChange={handleGridLineToggle}
          />
          {gridLinesEnabled ? "Hide Grid" : "Show Grid"}
        </label>

        {/* Clear everything off */}
        <button type="button" className='btn btn-sm bg-light' onClick={() => clearCanvas()}>Clear</button>

      </div>
    </div>
  )
};

export default WhiteboardControls

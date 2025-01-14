import React, { useState } from "react";
import '../styles/Whiteboard.css'

interface Props {
  setLineWidth: (width: number) => void;
  setLineColor: (color: string) => void;
  clearCanvas: () => void;
  drawGridLines: (show: boolean) => void;
  toggleEraser: () => void;
}

const WhiteboardControls = ({ setLineWidth, setLineColor, clearCanvas, drawGridLines, toggleEraser }: Props) => {
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

  return (
    <div className="whiteboard-controls-container">
      <h1 className="whiteboard-header">Whiteboard</h1>
      <div className="whiteboard-controls">
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

        {/* Clear everything off */}
        <button type="button" className='btn btn-sm bg-light' onClick={() => clearCanvas()}>Clear</button>

        {/* SHOW GRID LINES */}
        <label style={{ color: "white", }}>
          <input
            type="checkbox"
            checked={gridLinesEnabled}
            onChange={handleGridLineToggle}
          />
          {gridLinesEnabled ? "Hide Grid" : "Show Grid"}
        </label>

        <button onClick={toggleEraser}>Eraser</button>
      </div>
    </div>
  )
};

export default WhiteboardControls

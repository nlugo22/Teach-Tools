import { useState } from "react";

interface Props {
  setLineWidth: (width: number) => void;
  setLineColor: (color: string) => void;
  clearCanvas: () => void;
}

const WhiteboardControls = ({ setLineWidth, setLineColor, clearCanvas }: Props) => {
  const [selectedWidth, setSelectedWidth] = useState<number>(5);

  const handleLineWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const width = parseInt(e.target.value, 10); // select element stores data as string, need to convert it to base 10 number
    setSelectedWidth(width);
    setLineWidth(width);
  };

  return (
    <div className="whiteboard-controls">
      {/* Line width dropdown */}
      <label htmlFor="line-width" className="ml-2">Line Width: </label>
      <select
        id="line-width"
        value={selectedWidth}
        onChange={handleLineWidthChange}
        className="ml-2"
      >
        <option value={2}>2</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
      </select>

      {/* Buttons for the pen color */}
      <button type="button" className='btn btn-sm' onClick={() => setLineColor('black')}>Black</button>
      <button type="button" className='btn btn-sm' onClick={() => setLineColor('red')}>Red</button>
      <button type="button" className='btn btn-sm' onClick={() => setLineColor('green')}>Green</button>
      <button type="button" className='btn btn-sm' onClick={() => setLineColor('blue')}>Blue</button>

      {/* Clear everything off */}
      <button type="button" className='btn btn-sm' onClick={() => clearCanvas()}>Clear</button>
    </div>
  )
};

export default WhiteboardControls

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
    <div className="whiteboard-controls p-2">
      {/* Line width dropdown */}
      <label htmlFor="line-width" className="">Line Width: </label>
      <select
        id="line-width"
        value={selectedWidth}
        onChange={handleLineWidthChange}
        className="ml-2"
      >
        <option value={2}>Small</option>
        <option value={5}>Medium</option>
        <option value={10}>Large</option>
      </select>

      {/* Buttons for the pen color */}
      <button type="button" className='btn btn-sm bg-dark text-white' onClick={() => setLineColor('black')}>Black</button>
      <button type="button" className='btn btn-sm bg-danger text-white' onClick={() => setLineColor('red')}>Red</button>
      <button type="button" className='btn btn-sm bg-success text-white' onClick={() => setLineColor('green')}>Green</button>
      <button type="button" className='btn btn-sm bg-primary text-white' onClick={() => setLineColor('blue')}>Blue</button>

      {/* Clear everything off */}
      <button type="button" className='btn btn-sm bg-light' onClick={() => clearCanvas()}>Clear</button>
    </div>
  )
};

export default WhiteboardControls

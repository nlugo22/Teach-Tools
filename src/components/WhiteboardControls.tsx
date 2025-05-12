import React, { useEffect, useState } from "react";

interface Props {
  activeTab: number;
  handleActiveTabChange: (activeTab: number) => void;
  setLineWidth: (width: number) => void;
  setLineColor: (color: string) => void;
  clearCanvas: () => void;
  drawGridLines: (show: boolean) => void;
  toggleEraser: () => void;
  isErasing: boolean;
}

const WhiteboardControls = ({
  activeTab,
  handleActiveTabChange,
  setLineWidth,
  setLineColor,
  clearCanvas,
  drawGridLines,
  toggleEraser,
  isErasing,
}: Props) => {
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
  };

  const eraserButtonClass = isErasing
    ? "btn btn-sm bg-secondary text-light"
    : "btn btn-sm bg-light text-dark";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      switch (key) {
        case "e":
          toggleEraser();
          break;
        case "q":
          setLineColor("black");
          break;
        case "r":
          setLineColor("red");
          break;
        case "b":
          setLineColor("blue");
          break;
        case "g":
          setLineColor("green");
          break;
        case "1":
          handleActiveTabChange(1);
          break;
        case "2":
          handleActiveTabChange(2);
          break;
        case "3":
          handleActiveTabChange(3);
          break;
        case "c":
          clearCanvas();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleEraser, setLineColor]);

  return (
    <div className="p-0 m-0 bg-dark text-light">
      <div className="d-flex align-items-center gap-1 border-bottom border-dark">
        {/* TABS */}
        <div className="gap-0">
          <button
            title="Press 1"
            className={`btn btn-sm ${activeTab === 1 ? "btn-light" : "btn-secondary"}`}
            onClick={() => handleActiveTabChange(1)}
          >
            1
          </button>
          <button
            title="Press 2"
            className={`btn btn-sm ${activeTab === 2 ? "btn-light" : "btn-secondary"}`}
            onClick={() => handleActiveTabChange(2)}
          >
            2
          </button>
          <button
            title="Press 3"
            className={`btn btn-sm ${activeTab === 3 ? "btn-light" : "btn-secondary"}`}
            onClick={() => handleActiveTabChange(3)}
          >
            3
          </button>
        </div>

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
        <button
          type="button"
          title="Press Q"
          className="btn btn-sm bg-dark text-white"
          onClick={() => setLineColor("black")}
        >
          Black
        </button>
        <button
          type="button"
          title="Press R"
          className="btn btn-sm bg-danger text-white"
          onClick={() => setLineColor("red")}
        >
          Red
        </button>
        <button
          type="button"
          title="Press G"
          className="btn btn-sm bg-success text-white"
          onClick={() => setLineColor("green")}
        >
          Green
        </button>
        <button
          type="button"
          title="Press B"
          className="btn btn-sm bg-primary text-white"
          onClick={() => setLineColor("blue")}
        >
          Blue
        </button>

        {/* ERASER BUTTON */}
        <button
          type="button"
          title="Press E"
          className={eraserButtonClass}
          onClick={toggleEraser}
        >
          Eraser
        </button>

        {/* SHOW GRID LINES */}
        <label style={{ color: "white" }}>
          <input
            type="checkbox"
            checked={gridLinesEnabled}
            onChange={handleGridLineToggle}
          />
          {gridLinesEnabled ? "Hide Grid" : "Show Grid"}
        </label>

        {/* Clear everything off */}
        <button
          type="button"
          title="Press C"
          className="btn btn-sm bg-light"
          onClick={() => clearCanvas()}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default WhiteboardControls;

import { useState, useEffect } from "react";
import { Eraser, Brush, Circle, Grid, Trash2 } from "lucide-react";

interface Props {
  clearCanvas: () => void;
  toggleGrid: () => void;
  toggleEraser: () => void;
  setLineColor: (color: string) => void;
  isErasing: boolean;
}

const WhiteboardControls = ({
  clearCanvas,
  toggleGrid,
  toggleEraser,
  setLineColor,
  isErasing,
}: Props) => {
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [isColorPickerVisible, setColorPickerVisible] = useState<boolean>(false);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setLineColor(color);
    setColorPickerVisible(false); // Close the color picker after selection
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    switch (key) {
      case "e":
        toggleEraser();
        break;
      case "q":
        handleColorChange("black");
        break;
      case "r":
        handleColorChange("red");
        break;
      case "b":
        handleColorChange("blue");
        break;
      case "g":
        handleColorChange("green");
        break;
      case "c":
        clearCanvas();
        break;
      case "g":
        toggleGrid();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* Eraser Button */}
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Eraser"
        onClick={toggleEraser}
      >
        <Eraser size={36} color={isErasing ? "yellow" : "black"} />
      </button>

      {/* Brush Button */}
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Brush"
        onClick={() => setColorPickerVisible(!isColorPickerVisible)}
      >
        <Brush size={36} color={selectedColor} />
      </button>

      {/* Color Picker Dropdown (pop-out) */}
      {isColorPickerVisible && (
        <div className="absolute bg-white p-2 rounded shadow-lg mt-2 flex flex-col gap-1">
          <button
            className="p-2 bg-black text-white rounded"
            onClick={() => handleColorChange("black")}
          >
            Black
          </button>
          <button
            className="p-2 bg-red-500 text-white rounded"
            onClick={() => handleColorChange("red")}
          >
            Red
          </button>
          <button
            className="p-2 bg-green-500 text-white rounded"
            onClick={() => handleColorChange("green")}
          >
            Green
          </button>
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => handleColorChange("blue")}
          >
            Blue
          </button>
        </div>
      )}

      {/* Color Picker Button */}
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Color Picker"
        onClick={() => handleColorChange("red")}
      >
        <Circle size={36} color="red" />
      </button>

      {/* Grid Toggle Button */}
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Show/Hide Grid"
        onClick={toggleGrid}
      >
        <Grid size={36} />
      </button>

      {/* Clear Canvas Button */}
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Clear Canvas"
        onClick={clearCanvas}
      >
        <Trash2 size={36} />
      </button>
    </div>
  );
};

export default WhiteboardControls;

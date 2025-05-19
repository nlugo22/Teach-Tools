import { useState, useEffect } from "react";
import {
  Eraser,
  Brush,
  Circle,
  Grid,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";

interface Props {
  activeTab: number;
  clearCanvas: () => void;
  toggleEraser: () => void;
  toggleGrid: () => void;
  setLineColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  isErasing: boolean;
  handleActiveTabChange: (tab: number) => void;
}

const WhiteboardControls = ({
  activeTab,
  clearCanvas,
  toggleEraser,
  toggleGrid,
  setLineColor,
  setLineWidth,
  isErasing,
  handleActiveTabChange,
}: Props) => {
  const [showLineWidthPicker, setShowLineWidthPicker] =
    useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [isColorPickerVisible, setColorPickerVisible] =
    useState<boolean>(false);
  const [fading, setFading] = useState<boolean>(false);

  const lineWidth = [2, 5, 10, 25];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setLineColor(color);
    setColorPickerVisible(false); // Close the color picker after selection
  };

  const handleFade = () => {
    setFading(true);
    setTimeout(() => setFading(false), 180);
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
        handleFade();
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
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="flex flex-col justify-center">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            className={`py-2 w-12 font-bold  ${
              activeTab === num ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleActiveTabChange(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Eraser Button */}
      <button
        className="p-2 w-12 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Eraser"
        onClick={toggleEraser}
      >
        <Eraser size={36} color={isErasing ? "gray" : "black"} />
      </button>

      {/* Line width */}
      <div className="relative">
        <button
          onClick={() => setShowLineWidthPicker(!showLineWidthPicker)}
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          title="Line Width"
        >
          <SlidersHorizontal size={36} />
        </button>
        {showLineWidthPicker && (
          <div className="absolute top-12 left-0 z-10 bg-white border rounded shadow-md p-2 space-y-2">
            {lineWidth.map((width) => (
              <button
                key={width}
                onClick={() => {
                  setLineWidth(width);
                  setShowLineWidthPicker(false);
                }}
                className="w-20 py-1 text-center rounded hover:bg-gray-100"
              >
                {width}px
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brush Button */}
      <button
        className="p-2 w-12 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Brush"
        onClick={() => setColorPickerVisible(!isColorPickerVisible)}
      >
        <Brush size={36} color={selectedColor} />
      </button>

      {/* Color Picker Dropdown (pop-out) */}
      {isColorPickerVisible && (
        <div className="bg-white p-2 rounded shadow-lg mt-2 flex flex-col text-xs">
          <button
            className="p-2 w-12 bg-black text-white rounded"
            onClick={() => handleColorChange("black")}
          >
            Black
          </button>
          <button
            className="p-2 w-12 bg-red-500 text-white rounded"
            onClick={() => handleColorChange("red")}
          >
            Red
          </button>
          <button
            className="p-2 w-12 bg-green-500 text-white rounded"
            onClick={() => handleColorChange("green")}
          >
            Green
          </button>
          <button
            className="p-2 w-12 bg-blue-500 text-white rounded"
            onClick={() => handleColorChange("blue")}
          >
            Blue
          </button>
        </div>
      )}

      {/* Color Picker Button */}
      <button
        className="p-2 w-12 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Color Picker"
        onClick={() => handleColorChange("red")}
      >
        <Circle size={36} color="red" />
      </button>

      {/* Grid Toggle Button */}
      <button
        className="p-2 w-12 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Show/Hide Grid"
        onClick={toggleGrid}
      >
        <Grid size={36} />
      </button>

      {/* Clear Canvas Button */}
      <button
        className="p-2 w-12 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Clear Canvas"
        onClick={() => {
          clearCanvas();
          handleFade();
        }}
      >
        <Trash2
          size={36}
          className={`transition-opacity duration-300 ${fading ? "opacity-30" : "opacity-100"}`}
        />
      </button>
    </div>
  );
};

export default WhiteboardControls;

import { useState, useEffect, useRef } from "react";
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
  const lineWidthRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const lineWidth = [2, 5, 10, 25];

  // Hide the color picker and line width when not focused
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setColorPickerVisible(false);
      }
      if (
        lineWidthRef.current &&
        !lineWidthRef.current.contains(event.target as Node)
      ) {
        setShowLineWidthPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setLineColor(color);
    setColorPickerVisible(false);
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
      case "o":
        handleColorChange("orange");
        break;
      case "y":
        handleColorChange("yellow");
        break;
      case "g":
        handleColorChange("green");
        break;
      case "b":
        handleColorChange("blue");
        break;
      case "p":
        handleColorChange("purple");
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
    <div className="absolute top-4 left-4 z-10 bg-white shadow-md border border-gray-200 rounded-md p-2 pointer-events-auto">
      <div className="flex flex-col gap-2 relative">
        {/* Scrollable container for buttons only */}
        <div className="overflow-y-auto max-h-[80vh] flex flex-col gap-2">
          <div className="flex flex-col justify-center">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`cursor-pointer py-2 w-8 sm:w-12 font-bold  ${activeTab === num ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => handleActiveTabChange(num)}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Eraser Button */}
          <button
            className="p-2 w-8 sm:w-12 bg-gray-100 cursor-pointer rounded hover:bg-gray-200 flex justify-center items-center"
            title="Eraser"
            onClick={toggleEraser}
          >
            <span className="block sm:hidden">
              <Eraser size={25} color={isErasing ? "gray" : "black"} />
            </span>
            <span className="hidden sm:block">
              <Eraser size={36} color={isErasing ? "gray" : "black"} />
            </span>
          </button>

          {/* Line width */}
          <div className="relative">
            <button
              onClick={() => setShowLineWidthPicker(!showLineWidthPicker)}
              className="p-2 w-8 sm:w-12 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
              title="Line Width"
            >
              <span className="block sm:hidden">
                <SlidersHorizontal size={25} />
              </span>
              <span className="hidden sm:block">
                <SlidersHorizontal size={36} />
              </span>
            </button>
          </div>

          {/* Brush Button */}
          <div className="relative">
            <button
              className="p-2 w-8 sm:w-12 cursor-pointer bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
              title="Brush"
              onClick={() => setColorPickerVisible(!isColorPickerVisible)}
            >
              <span className="block sm:hidden">
                <Brush size={25} color={selectedColor} />
              </span>
              <span className="hidden sm:block">
                <Brush size={36} color={selectedColor} />
              </span>
            </button>
          </div>

          {/* Color Picker Button */}
          <button
            className="p-2 w-8 sm:w-12 bg-gray-100 rounded hover:bg-gray-200 flex justify-center cursor-pointer items-center"
            title="Color Picker"
            onClick={() => handleColorChange("red")}
          >
            <span className="block sm:hidden">
              <Circle size={25} color="red" />
            </span>
            <span className="hidden sm:block">
              <Circle size={36} color="red" />
            </span>
          </button>

          {/* Grid Toggle Button */}
          <button
            className="p-2 w-8 sm:w-12 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center cursor-pointer"
            title="Show/Hide Grid"
            onClick={toggleGrid}
          >
            <span className="block sm:hidden">
              <Grid size={25} />
            </span>
            <span className="hidden sm:block">
              <Grid size={36} />
            </span>
          </button>
          {/* Clear Canvas Button */}
          <button
            className="p-2 w-8 sm:w-12 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center cursor-pointer"
            title="Clear Canvas"
            onClick={() => {
              clearCanvas();
              handleFade();
            }}
          >
            <span className="block sm:hidden">
              <Trash2
                size={25}
                className={`transition-opacity duration-300 ${fading ? "opacity-30" : "opacity-100"}`}
              />
            </span>
            <span className="hidden sm:block">
              <Trash2
                size={36}
                className={`transition-opacity duration-300 ${fading ? "opacity-30" : "opacity-100"}`}
              />
            </span>
          </button>
        </div>

        {/* Line Width Picker Dropdown */}
        {showLineWidthPicker && (
          <div
            ref={lineWidthRef}
            className="absolute top-12 left-0 z-10 bg-white border rounded shadow-md p-2 space-y-2"
          >
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

        {/* Color Picker Dropdown (pop-out) */}
        {isColorPickerVisible && (
          <div
            ref={colorPickerRef}
            className="absolute top-0 left-full ml-2 z-50 bg-white border rounded shadow-lg p-2"
          >
            <div className="flex flex-col gap-1">
              <button
                className="p-1 bg-black text-white rounded"
                onClick={() => handleColorChange("black")}
              >
                Black
              </button>
              <button
                className="p-1 bg-red-500 text-white rounded"
                onClick={() => handleColorChange("red")}
              >
                Red
              </button>
              <button
                className="p-1 bg-orange-500 text-white rounded"
                onClick={() => handleColorChange("orange")}
              >
                Orange
              </button>
              <button
                className="p-1 bg-yellow-500 text-white rounded"
                onClick={() => handleColorChange("yellow")}
              >
                Yellow
              </button>
              <button
                className="p-1 bg-green-500 text-white rounded"
                onClick={() => handleColorChange("green")}
              >
                Green
              </button>
              <button
                className="p-1 bg-blue-500 text-white rounded"
                onClick={() => handleColorChange("blue")}
              >
                Blue
              </button>
              <button
                className="p-1 bg-purple-500 text-white rounded"
                onClick={() => handleColorChange("purple")}
              >
                Purple
              </button>
              <button
                className="p-1 bg-white rounded"
                onClick={() => handleColorChange("white")}
              >
                White
              </button>
            </div>
            <div className="font-semibold text-center mt-1 border bg-black text-white rounded text-sm">
              Pick
            </div>
            <input
              type="color"
              className="w-full h-6 cursor-pointer"
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WhiteboardControls;

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Eraser,
  Brush,
  Trash2,
  SlidersHorizontal,
  Slash,
} from "lucide-react";

interface Props {
  activeTab: number;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  toggleEraser: () => void;
  toggleGrid: () => void;
  setLineColor: (color: string) => void;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
  setIsStraightLine: React.Dispatch<React.SetStateAction<boolean>>;
  isStraightLine: boolean;
  isErasing: boolean;
  setIsErasing: React.Dispatch<React.SetStateAction<boolean>>;
  handleActiveTabChange: (tab: number) => void;
}

const WhiteboardControls = ({
  activeTab,
  clearCanvas,
  undo,
  redo,
  toggleEraser,
  setLineColor,
  setLineWidth,
  setIsStraightLine,
  isStraightLine,
  isErasing,
  setIsErasing,
  handleActiveTabChange,
}: Props) => {
  const [showLineWidthPicker, setShowLineWidthPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black");
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [fading, setFading] = useState(false);

  const lineWidthRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const lineWidthOptions = [2, 5, 10, 25];

  // Hide popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target as Node)
      )
        setColorPickerVisible(false);
      if (
        lineWidthRef.current &&
        !lineWidthRef.current.contains(e.target as Node)
      )
        setShowLineWidthPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setLineColor(color);
    setIsErasing(false);
    setColorPickerVisible(false);
  };

  const handleFade = () => {
    setFading(true);
    setTimeout(() => setFading(false), 180);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Increase and decrease line width
      if (key === "w") {
        setLineWidth((prev: number) => {
          const next = lineWidthOptions.find((w) => w > prev);
          return next !== undefined ? next : prev;
        });
      }

      if (key === "s") {
        setLineWidth((prev: number) => {
          const prevOption = [...lineWidthOptions]
            .reverse()
            .find((w) => w < prev);
          return prevOption !== undefined ? prevOption : prev;
        });
      }

      switch (key) {
        case "e":
          toggleEraser();
          setIsStraightLine(false);
          break;
        case "c":
          clearCanvas();
          handleFade();
          break;
        case "z":
          undo();
          break;
        case "x":
          redo();
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
        case "l":
          setIsStraightLine((prev) => !prev);
          setIsErasing(false);
          break;
        case "1":
        case "2":
        case "3":
          handleActiveTabChange(Number(key));
          break;
        default:
          break;
      }
    },
    [
      clearCanvas,
      undo,
      redo,
      toggleEraser,
      setLineColor,
      setLineWidth,
      handleActiveTabChange,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="absolute top-4 left-4 z-10 bg-white shadow-md border border-gray-200 rounded-md p-2 pointer-events-auto">
      <div className="flex flex-col gap-2 relative">
        <div className="flex flex-col justify-center">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className={`cursor-pointer py-2 w-8 sm:w-12 font-bold ${
                activeTab === num ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleActiveTabChange(num)}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          className={`p-2 w-8 sm:w-12 rounded flex justify-center items-center transition-colors
    ${isErasing ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          title="Eraser"
          onClick={toggleEraser}
        >
          <Eraser size={36} color={isErasing ? "white" : "black"} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowLineWidthPicker(!showLineWidthPicker)}
            className="p-2 w-8 sm:w-12 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
            title="Line Width"
          >
            <SlidersHorizontal size={36} />
          </button>
          {showLineWidthPicker && (
            <div
              ref={lineWidthRef}
              className="absolute top-12 left-0 z-10 bg-white border rounded shadow-md p-2 space-y-2"
            >
              {lineWidthOptions.map((width) => (
                <button
                  key={width}
                  onClick={() => setLineWidth(width)}
                  className="w-20 py-1 text-center rounded hover:bg-gray-100"
                >
                  {width}px
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className="p-2 w-8 sm:w-12 cursor-pointer bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
          title="Brush / Color"
          onClick={() => setColorPickerVisible(!isColorPickerVisible)}
        >
          <Brush size={36} color={selectedColor} />
        </button>
        {isColorPickerVisible && (
          <div
            ref={colorPickerRef}
            className="absolute top-0 left-full ml-2 z-50 bg-white border rounded shadow-lg p-2"
          >
            <div className="flex flex-col gap-1">
              {[
                "black",
                "red",
                "orange",
                "yellow",
                "green",
                "blue",
                "purple",
                "white",
              ].map((color) => (
                <button
                  key={color}
                  className={`p-1 rounded text-white`}
                  style={{
                    backgroundColor: color === "white" ? "#eee" : color,
                    color: color === "white" ? "#000" : "#fff",
                  }}
                  onClick={() => handleColorChange(color)}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </button>
              ))}
            </div>
            <input
              type="color"
              className="w-full h-6 cursor-pointer mt-1"
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
        )}

        <button
          onClick={() => setIsStraightLine((prev) => !prev)}
          className={`p-2 w-8 sm:w-12 cursor-pointer rounded flex justify-center items-center transition-colors
    ${isStraightLine ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          <Slash size={20} />
        </button>

        {/*        <button
          className="p-2 w-8 sm:w-12 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
          title="Grid"
          onClick={toggleGrid}
        >
          <Grid size={36} />
        </button>
        */}

        <button
          className="p-2 w-8 sm:w-12 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
          title="Clear"
          onClick={() => {
            clearCanvas();
            handleFade();
          }}
        >
          <Trash2
            size={36}
            className={`transition-opacity duration-300 ${
              fading ? "opacity-30" : "opacity-100"
            }`}
          />
        </button>
        <div className="flex flex-col gap-2 mt-2">
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={undo}
          >
            Undo
          </button>
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={redo}
          >
            Redo
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardControls;

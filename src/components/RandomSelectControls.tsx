import { useState, useEffect } from "react";
import {
  Shuffle,
  Eye,
  EyeOff,
  Hash,
  SortAsc,
  Trash2,
  Undo2,
  XCircle,
  Plus,
} from "lucide-react";

interface Props {
  numAvailableNames: number;
  spinnerCount: number;
  setSpinnerCount: (count: number) => void;
  handleSpinning: () => void;
  isSpinning: boolean;
  handleRosterDisplayed: () => void;
  isRosterDisplayed: boolean;
  isNumbered: boolean;
  handleIsNumbered: () => void;
  isSorted: boolean;
  handleSort: () => void;
  handleReset: () => void;
  handleClearAbsent: () => void;
  handleSpinnerCountChange: (count: number) => void;
  handleGoBack: () => void;
  selectedNames: string[];
  absentList: string[];
  rosterList: string[];
}

const RandomSelectControls = ({
  spinnerCount,
  numAvailableNames,
  handleSpinning,
  isSpinning,
  handleRosterDisplayed,
  isRosterDisplayed,
  isNumbered,
  handleIsNumbered,
  isSorted,
  handleSort,
  handleReset,
  handleClearAbsent,
  handleGoBack,
  handleSpinnerCountChange,
  selectedNames,
  absentList,
  rosterList,
}: Props) => {
  const spinButtonRef = useRef<HTMLButtonElement>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;

      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      // If key is a digit between 1 and 9
      if (/^[1-9]$/.test(key)) {
        const number = parseInt(key, 10);
        if (number <= numAvailableNames) {
          handleSpinnerCountChange(number);
        }
        return;
      }

      switch (key) {
        case "r":
          handleReset();
          break;
        case " ":
          event.preventDefault();
          spinButtonRef.current?.click();
          break;
        case "c":
          handleClearAbsent();
          break;
        case "s":
          handleSort();
          break;
        case "e":
          handleIsNumbered();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [numAvailableNames]);

  const handleSelectCount = (count: number) => {
    handleSpinnerCountChange(count);
    setIsDropdownVisible(false); // Close dropdown after selection
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      // Prevent keybinding from affecting form inputs
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      switch (key) {
        case " ":
          event.preventDefault();
          handleSpinning();
          break;
        case "r":
          handleReset();
          break;
        case "c":
          handleClearAbsent();
          break;
        case "s":
          handleSort();
          break;
        case "e":
          handleIsNumbered();
          break;
        case "b":
          handleGoBack();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full sm:max-w-xs">
      {/* Spinner Start Button */}
      <button
        onClick={handleSpinning}
        className="p-2 bg-blue-100 hover:bg-blue-200 rounded flex items-center justify-start gap-x-1"
      >
        <Shuffle />
        {isSpinning ? "Spinning..." : "Spin"}
      </button>

      {/* Show/Hide Roster */}
      <button
        onClick={handleRosterDisplayed}
        className="p-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-start gap-x-1"
      >
        {isRosterDisplayed ? <EyeOff /> : <Eye />}
        {isRosterDisplayed ? "Hide Roster" : "Show Roster"}
      </button>

      {/* Number Toggle */}
      <button
        onClick={handleIsNumbered}
        className="p-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-start gap-x-1"
      >
        <Hash />
        {isNumbered ? "Remove Numbers" : "Number Roster"}
      </button>

      {/* Sort Toggle */}
      <button
        onClick={handleSort}
        className="p-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-start gap-x-1"
      >
        <SortAsc />
        {isSorted ? "Unsort" : "Sort A-Z"}
      </button>

      {/* Reset Selection */}
      <button
        onClick={handleReset}
        className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded flex items-center justify-start gap-x-1"
      >
        <Undo2 />
        Reset Selection
      </button>

      {/* Clear Absent List */}
      <button
        onClick={handleClearAbsent}
        className="p-2 bg-red-100 hover:bg-red-200 rounded flex items-center justify-start gap-x-1"
      >
        <Trash2 />
        Clear Absent
      </button>

      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="p-2 bg-gray-300 hover:bg-gray-400 rounded flex items-center justify-start gap-x-1"
      >
        <XCircle />
        Back
      </button>

      {/* Spinner Count Selection (Button with Dropdown) */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownVisible((prev) => !prev)}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-start gap-x-1 w-full"
        >
          <Plus className="mr-2" />
          Spinner Count: {spinnerCount}
        </button>
        {isDropdownVisible && (
          <div className="absolute bg-white border rounded shadow-md mt-1 w-full z-10">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
              <button
                key={count}
                onClick={() => handleSelectCount(count)}
                className="w-full p-2 text-left hover:bg-gray-200"
              >
                {count}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomSelectControls;

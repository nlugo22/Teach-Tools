import { useRef, useState, useEffect } from "react";
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
  selectedNames: string[];
  isRosterDisplayed: boolean;
  isNumbered: boolean;
  isSorted: boolean;
  isSpinning: boolean;
  handleSpinnerCountChange: (count: number) => void;
  handleRosterDisplayed: () => void;
  handleIsNumbered: () => void;
  handleSort: () => void;
  handleSpinning: () => void;
  handleReset: () => void;
  handleClearAbsent: () => void;
  handleGoBack: () => void;
}

const RandomSelectControls = ({
  spinnerCount,
  numAvailableNames,
  isRosterDisplayed,
  isNumbered,
  isSorted,
  isSpinning,
  handleSpinnerCountChange,
  handleRosterDisplayed,
  handleIsNumbered,
  handleSort,
  handleSpinning,
  handleReset,
  handleClearAbsent,
  handleGoBack,
}: Props) => {
  const spinButtonRef = useRef<HTMLButtonElement>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Keyboard shortcuts
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
      if (/^[1-9]$/.test(key)) {
        const number = parseInt(key, 10);
        if (number <= numAvailableNames) {
          handleSpinnerCountChange(number);
        }
        return;
      }

      switch (key) {
        case " ":
          event.preventDefault();
          spinButtonRef.current?.click();
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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [numAvailableNames]);

  const handleSelectCount = (count: number) => {
    handleSpinnerCountChange(count);
    setIsDropdownVisible(false);
  };

  return (
    <div className="flex flex-col gap-3 w-[15vw] sm:max-w-xs">

      { /* Select names */ }
      <button
        ref={spinButtonRef}
        onClick={handleSpinning}
        className="cursor-pointer p-2 bg-blue-100 hover:bg-blue-200 rounded flex items-center gap-x-1"
      >
        <Shuffle />
        {isSpinning ? "Spinning..." : "Spin"}
      </button>

      { /* Show hide roster */ }
      <button
        onClick={handleRosterDisplayed}
        className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-x-1"
      >
        {isRosterDisplayed ? <EyeOff /> : <Eye />}
        {isRosterDisplayed ? "Hide Roster" : "Show Roster"}
      </button>

      { /* Enumerate */ }
      <button
        onClick={handleIsNumbered}
        className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-x-1"
      >
        <Hash />
        {isNumbered ? "Remove Numbers" : "Number Roster"}
      </button>

      { /* Sort button */ }
      <button
        onClick={handleSort}
        className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-x-1"
      >
        <SortAsc />
        {isSorted ? "Unsort" : "Sort A-Z"}
      </button>

      { /* Reset selected button */ }
      <button
        onClick={handleReset}
        className="cursor-pointer p-2 bg-yellow-100 hover:bg-yellow-200 rounded flex items-center gap-x-1"
      >
        <Undo2 />
        Reset Selection
      </button>

      { /* Clear absent button */ }
      <button
        onClick={handleClearAbsent}
        className="cursor-pointer p-2 bg-red-100 hover:bg-red-200 rounded flex items-center gap-x-1"
      >
        <Trash2 />
        Clear Absent
      </button>

      { /* Shape button */}
      <button
        onClick={handleGoBack}
        className="cursor-pointer p-2 bg-gray-300 hover:bg-gray-400 rounded flex items-center gap-x-1"
      >
        <XCircle />
        Back
      </button>

      { /* Spinner count change */ }
      <div className="relative">
        <button
          onClick={() => setIsDropdownVisible((prev) => !prev)}
          className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-x-1 w-full"
        >
          <Plus className="mr-2" />
          Spinner Count: {spinnerCount}
        </button>
        {isDropdownVisible && (
          <div className="absolute overflow-y-auto max-h-64 bg-white border rounded shadow-md mt-1 w-full z-10">
            {Array.from({ length: numAvailableNames}).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handleSelectCount(i + 1)}
                className="w-full p-2 text-left hover:bg-gray-200"
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomSelectControls;

import { useState } from "react";
import {
  Users,
  Shuffle,
  Eye,
  EyeOff,
  Hash,
  SortAsc,
  Trash2,
  Undo2,
  XCircle,
  Plus, // Importing Plus icon for spinner count selection
} from "lucide-react";

interface Props {
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
  handleGoBack: () => void;
  selectedNames: string[];
  absentList: string[];
  rosterList: string[];
}

const RandomSelectControls = ({
  spinnerCount,
  setSpinnerCount,
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
  selectedNames,
  absentList,
  rosterList,
}: Props) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSelectCount = (count: number) => {
    setSpinnerCount(count);
    setIsDropdownVisible(false); // Close dropdown after selection
  };

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

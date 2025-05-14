import { useState } from "react";
import { Shuffle, Trash2 } from "lucide-react";

interface Props {
  roster: string[];
  onSelect: (name: string) => void;
  onClear: () => void;
}

const RandomSelection = ({ roster, onSelect, onClear }: Props) => {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinnerCount, setSpinnerCount] = useState(0);

  const handleRandomSelect = () => {
    if (roster.length === 0) return;

    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * roster.length);
      const name = roster[randomIndex];
      setSelectedName(name);
      count += 1;
      setSpinnerCount(count);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      const finalIndex = Math.floor(Math.random() * roster.length);
      const finalName = roster[finalIndex];
      setSelectedName(finalName);
      onSelect(finalName); // Call external onSelect function, if any
      setSpinnerCount(0); // Reset spinner count
    }, 3000); // Stop after 3 seconds
  };

  return (
    <div className="flex w-full h-full">
      {/* Controls on the Left */}
      <div className="absolute left-0 top-0 flex flex-col gap-2 p-2 bg-white z-10">
        {/* Shuffle Button */}
        <button
          className="p-1 bg-white rounded hover:bg-gray-100 flex justify-center items-center"
          title="Shuffle"
          onClick={handleRandomSelect}
          disabled={isSpinning}
        >
          <Shuffle size={24} />
        </button>

        {/* Clear Button */}
        <button
          className="p-1 bg-white rounded hover:bg-gray-100 flex justify-center items-center"
          title="Clear"
          onClick={onClear}
        >
          <Trash2 size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Selected: {selectedName}</h1>
          <p className="mt-2 text-lg">
            {isSpinning ? `Spinning... (${spinnerCount})` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RandomSelection;

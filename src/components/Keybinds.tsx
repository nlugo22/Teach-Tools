import { X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  onClose: () => void;
  activeModule: string;
}

const Keybinds = ({ onClose, activeModule }: Props) => {
  const keys: Record<string, Record<string, string>> = {
    Whiteboard: {
      "1-3": "Tab 1, 2, 3.",
      e: "Toggle eraser",
      q: "Set brush color black.",
      r: "Set brush color red.",
      g: "Set brush color green.",
      b: "Set brush color blue.",
      c: "Clear the whiteboard.",
    },
    "Random Select": {
      Space: "Start selection.",
      h: "Hide the roster.",
      e: "Number the roster.",
      s: "Sort the roster.",
      r: "Reset the selected names.",
      c: "Clear absent students.",
      "1-9": "Set 1 to 9 spinners.",
    },
  };

  // Handle tab key to cycle through modules
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-50 rounded flex items-center justify-center z-50">
      <div className="relative bg-gray-200 rounded p-4">
        <button onClick={onClose} className="absolute top-2 right-2">
          <X className="w-6 h-6 text-black" />
        </button>

        <h1 className="px-4 text-2xl text-center">{activeModule} Keybinds</h1>
        <hr />
        <ul className="text-xl">
          <li>?: Open keybinds menu.</li>
          <li>Esc: Escape keybinds menu.</li>
          <li>Tab: Switch modules.</li>
          {Object.entries(keys[activeModule]).map(([key, desc]) => (
            <li key={key}>
              <span>{key}</span>: {desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Keybinds;

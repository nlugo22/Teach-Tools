import { X } from "lucide-react";

interface Props {
    onClose: () => void;
}

const Keybinds = ({onClose}: Props) => {
  return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-65 h-65 bg-white rounded p-4">
              <button
                  onClick={onClose}
                  className="absolute top-2 right-2"
              >
                  <X className="w-6 h-6 text-black" />
              </button>

              {/* Your keybind list or other content goes here */}
          </div>
      </div>

  )
}

export default Keybinds

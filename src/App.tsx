import "./App.css";
import { act, useEffect, useState } from "react";
import Whiteboard from "./components/Whiteboard";
import RandomSelection from "./components/RandomSelection";
import Keybinds from "./components/Keybinds";
import { HelpCircle } from "lucide-react";
import Navbar from "./components/Navbar";

enum Modules {
  WHITEBOARD = "Whiteboard",
  RANDOM_SELECT = "Random Select",
}

const modules = Object.values(Modules);

function App() {
  const [isKeyBindsDisplayed, setIsKeybindsDisplayed] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<string>(() => {
    const saved = localStorage.getItem("activeModule");
    return saved ?? Modules.WHITEBOARD;
  });

  const displayKeybinds = () => setIsKeybindsDisplayed(true);;
  const hideKeybinds = () => setIsKeybindsDisplayed(false);

  // Handle tab key to cycle through modules
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        setActiveModule((prev) => {
          const index = modules.indexOf(prev as Modules);
          const next = (index + 1) % modules.length;
          return modules[next];
        });
      }

      if (e.key === "?") {
        displayKeybinds();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  // Persist active module in localStorage
  useEffect(() => {
    localStorage.setItem("activeModule", activeModule);
  }, [activeModule]);

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Module Selector */}
      <div className="relative w-full flex justify-center gap-6 text-lg py-2 bg-gray-100 border-b border-gray-300">
        {modules.map((label) => (
          <button
            key={label}
            onClick={() => setActiveModule(label)}
            className={`pb-1 border-b-2 transition-all duration-200 ${
              activeModule === label
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-blue-500"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          className="cursor-pointer absolute right-4 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => displayKeybinds()}  // Replace with your function
        >
          <HelpCircle className="w-8 h-8" />
        </button>
      </div>

      {isKeyBindsDisplayed && <Keybinds activeModule={activeModule} onClose={hideKeybinds} />}

      {/* Main Module Content */}
      <main className="">
        {activeModule === "Whiteboard" && <Whiteboard />}
        {activeModule === "Random Select" && <RandomSelection />}
      </main>
    </div>
  );
}

export default App;

import "./App.css";
import { useEffect, useState } from "react";
import Whiteboard from "./components/Whiteboard";
import RandomSelection from "./components/RandomSelection";

enum Modules {
  WHITEBOARD = "Whiteboard",
  RANDOM_SELECT = "Random Select",
}

const modules = Object.values(Modules);

function App() {
  const [activeModule, setActiveModule] = useState<string>(() => {
    const saved = localStorage.getItem("activeModule");
    return saved ?? Modules.WHITEBOARD;
  });

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
      <header className="bg-gray-800 text-white text-sm">
        <nav className="px-4 py-2 flex gap-6">
          <button onClick={() => {}} className="hover:text-blue-300">
            Home
          </button>
          <button onClick={() => {}} className="hover:text-blue-300">
            About
          </button>
        </nav>
      </header>

      {/* Module Selector */}
      <div className="flex justify-center gap-6 text-lg py-2 bg-gray-100 border-b border-gray-300">
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
      </div>

      {/* Main Layout */}

      {/* Main Module Content */}
      <main className="flex flex-1 h-full">
        {activeModule === "Whiteboard" && <Whiteboard />}
        {activeModule === "Random Select" && <RandomSelection />}
      </main>
    </div>
  );
}

export default App;

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Whiteboard from "./components/Whiteboard";
import RandomSelection from "./components/RandomSelection";
import WhiteboardControls from "./components/WhiteboardControls";

function App() {
  const [activeModule, setActiveModule] = useState<string>("Whiteboard");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="bg-dark text-white text-sm">
        <nav className="px-4 py-2 flex gap-6">
          <button onClick={() => {}} className="hover:text-blue-300">Home</button>
          <button onClick={() => {}} className="hover:text-blue-300">About</button>
        </nav>
      </header>

      {/* Module Selector */}
      <div className="w-full flex justify-center gap-6 text-lg py-2 bg-gray-100 border-b border-gray-300">
        {["Whiteboard", "Random Select"].map((label) => (
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
      <div className="w-full h-[calc(100vh-5.5rem)] flex px-2 py-1 gap-2">

        {/* Main Module Content */}
        <main className="flex-1 bg-white rounded-md shadow-md border border-gray-200 p-4 overflow-y-auto">
          {activeModule === "Whiteboard" && <Whiteboard />}
          {activeModule === "Random Select" && <RandomSelection />}
        </main>
      </div>
    </div>
  );
}

export default App;

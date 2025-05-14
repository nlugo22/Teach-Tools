import { useState } from 'react';
import { Eraser, Brush, Circle, Grid, Trash2 } from 'lucide-react';

const WhiteboardTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: number;
  onTabChange: (tab: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          title={`Tab ${tab}`}
          className={`w-12 h-12 rounded text-xl font-semibold flex items-center justify-center transition-colors
            ${activeTab === tab
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const WhiteboardControls = () => {
  return (
    <div className="flex flex-col gap-2">
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Eraser"
      >
        <Eraser size={36} />
      </button>

      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Brush"
      >
        <Brush size={36} />
      </button>

      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Color Picker"
      >
        <Circle size={36} />
      </button>

      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Show/Hide Grid"
      >
        <Grid size={36} />
      </button>

      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 flex justify-center items-center"
        title="Clear Canvas"
      >
        <Trash2 size={36} />
      </button>
    </div>
  );
};

const WhiteboardPanel = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="flex gap-4 p-4">
      {/* Left sidebar: tabs and tools */}
      <div className="flex flex-col gap-4">
        <WhiteboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <WhiteboardControls />
      </div>

      {/* Canvas area */}
      <div className="flex-1 border rounded bg-white shadow-inner">
        <div className="p-4 text-gray-500 italic">
          Canvas for tab {activeTab}
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPanel;

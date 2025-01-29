import { useState } from "react";
import "../styles/Sidebar.css";

interface Props {
  setActiveModule: (selection: string) => void;
}

const Sidebar = ({ setActiveModule }: Props) => {
  const [isCollapsed, setCollapsed] = useState<boolean>(false);
  const toggleSidebar = () => {
    setCollapsed(!isCollapsed);
  };
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button
        onClick={toggleSidebar}
        className="collapse-btn"
        style={{
          transform: isCollapsed ? "rotate(90deg)" : "rotate(0deg)", // Rotate when collapsed
          transition: "transform 0.3s ease", // Smooth transition for rotation
        }}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <div className={`menu ${isCollapsed ? "collapsed-menu" : "show"}`}>
        <h2>Modules</h2>
        <button onClick={() => setActiveModule("whiteboard")}>
          Whiteboard
        </button>
        <button onClick={() => setActiveModule("random-selection")}>
          Random Selection
        </button>
        <button onClick={() => setActiveModule("something")}>Something</button>
      </div>
    </aside>
  );
};

export default Sidebar;

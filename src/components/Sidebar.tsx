import "../styles/Sidebar.css";

interface Props {
  setActiveModule: (selection: string) => void;
  isSidebarCollapsed: boolean;
}

const Sidebar = ({ setActiveModule, isSidebarCollapsed }: Props) => {

  return (
    <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`menu ${isSidebarCollapsed ? "collapsed-menu" : "show"}`}>
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

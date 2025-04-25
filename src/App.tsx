import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar';
import { useEffect, useState } from 'react';
import RandomSelection from './components/RandomSelection';
import Whiteboard from './components/Whiteboard';

enum Modules {
  WHITEBOARD = "whiteboard",
  RANDOM_SELECT = "random_select",
}

const modules = Object.values(Modules);

function App() {
  const [activeModule, setActiveModule] = useState<string>(() => {
    const savedModule = localStorage.getItem("activeModule");
    return savedModule ? savedModule : Modules.WHITEBOARD;
  });

  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        setActiveModule((prev) => {
          const currentIndex = modules.indexOf(prev as Modules);
          const nextIndex = (currentIndex + 1) % modules.length;
          return modules[nextIndex]
        });
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  // Update localstorage on module change
  useEffect(() => {
    localStorage.setItem("activeModule", activeModule);
  }, [activeModule])

  const handleCollapseClick = () => {
    setSidebarCollapsed((prev) => !prev );
  }

  const loadModule = () => {
    switch (activeModule) {
      case Modules.WHITEBOARD:
        return <Whiteboard />;
      case Modules.RANDOM_SELECT:
        return <RandomSelection />;
      default:
        return <></>;
    }
  }

  return (
    <>
      <Navbar handleCollapseClick={handleCollapseClick} isSidebarCollapsed={isSidebarCollapsed}/>
      <div className="content">
        <aside>
          <Sidebar setActiveModule={setActiveModule} isSidebarCollapsed={isSidebarCollapsed} />
        </aside>
        <main className="main-content">
          {loadModule()}
        </main>
      </div>
    </>

  )
}

export default App

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar';
import { useState } from 'react';
import RandomSelection from './components/RandomSelection';
import Whiteboard from './components/Whiteboard';
import MultiplicationGame from './components/MultiplicationGame';

function App() {
  const [activeModule, setActiveModule] = useState<string>("whiteboard");

  const loadModule = () => {
    switch (activeModule) {
      case "whiteboard":
        return <Whiteboard />;
      case "random-selection":
        return <RandomSelection />;
      case "math-games":
        return <MultiplicationGame />;
      default:
        return <></>;
    }
  }

  return (
    <>
      <Navbar />
      <div className="content">
        <aside className="sidebar">
          <Sidebar setActiveModule={setActiveModule} />
        </aside>
        <main className="main-content">
          {loadModule()}
        </main>
      </div>
    </>

  )
}

export default App

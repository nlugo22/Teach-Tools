import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar';
import { useState } from 'react';
import RandomSelection from './components/RandomSelection';
import Whiteboard from './components/Whiteboard';

function App() {
  const [activeModule, setActiveModule] = useState<string>("whiteboard");

  const loadModule = () => {
    switch (activeModule) {
      case "whiteboard":
        return <Whiteboard />;
      case "random-selection":
        return <RandomSelection />;
      default:
        return <></>;
    }
  }

  return (
    <>
      <Navbar />
      <div className="content">
        <aside>
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

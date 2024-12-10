import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'
// import Whiteboard from './components/Whiteboard';
import './App.css'
import RandomSelection from './components/RandomSelection';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="module-container">
        <RandomSelection />
      </div>
    </div>

  )
}

export default App

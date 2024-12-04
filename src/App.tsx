import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'
import Whiteboard from './components/Whiteboard';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="module-container">
        <Whiteboard />
      </div>
    </div>

  )
}

export default App

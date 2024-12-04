import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'
import Whiteboard from './components/Whiteboard';
import './styles/AppStyle.css'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="module-container">
        <Whiteboard width={1000} height={500} />
      </div>
    </div>

  )
}

export default App

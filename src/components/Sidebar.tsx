import '../styles/Sidebar.css'

interface Props {
  setActiveModule: (selection: string) => void;
}

const Sidebar = ({ setActiveModule }: Props) => {
  return (
    <aside>
      <h2>Modules</h2>
      <button onClick={() => setActiveModule("whiteboard")}>Whiteboard</button>
      <button onClick={() => setActiveModule("random-selection")}>Random Selection</button>
      <button onClick={() => setActiveModule("math-games")}>Math Games</button>
    </aside>
  )
}

export default Sidebar

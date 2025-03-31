import "../styles/Navbar.css";

interface Props {
  handleCollapseClick: () => void;
  isSidebarCollapsed: boolean;
}

const Navbar = ({ handleCollapseClick, isSidebarCollapsed }: Props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      {/* Hamburger button inside the Navbar */}
      <button
        className="collapse-btn"
        onClick={handleCollapseClick}
        style={{
          transform: isSidebarCollapsed ? "rotate(90deg)" : "rotate(0deg)", // Rotate when collapsed
          transition: "transform 0.3s ease", // Smooth transition for rotation
        }}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>
      <a className="navbar-brand" style={{ marginLeft: "50px" }} href="#">
        TeachTools
      </a>
      <ul className="navbar-nav">
        <li className="nav-item active">
          <a className="nav-link" href="#">
            Home
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Other
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            About
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

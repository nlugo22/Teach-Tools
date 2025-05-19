import favicon from "/src/assets/favicon.ico";

const Navbar = () => {
  return (
    <header className="bg-gray-800 text-white text-sm">
      <nav className="px-4 py-2 flex gap-6">
        <img
          src={favicon}
          alt="Home"
          title="Home"
          onClick={() => {}}
          className="hover:brightness-75 w-9 h-9"
        />
        <button onClick={() => {}} className="hover:text-blue-300">
          About
        </button>
      </nav>
    </header>
  );
};

export default Navbar;

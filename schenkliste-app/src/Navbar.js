const Navbar = () => {
    return (
      <nav className="bg-blue-500 text-white py-4 px-6 flex justify-between">
        <h1 className="text-lg font-bold">Schenkliste</h1>
        <div>
          <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
            Abmelden
          </button>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  
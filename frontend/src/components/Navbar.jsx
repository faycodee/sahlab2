import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from 'lucide-react';

const Navbar = ({ user, setUser }) => {


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage
  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        setUser(null);
        localStorage.removeItem("user");
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromStorage();

    // 1. Listen for changes in other tabs
    const handleStorageChange = (event) => {
      if (event.key === "user") {
        loadUserFromStorage();
      }
    };

    // 2. Watch for changes in the same tab (poll every 500ms)
    const interval = setInterval(() => {
      const currentUser = localStorage.getItem("user");
      const parsedUser = currentUser ? JSON.parse(currentUser) : null;
      const stateUser = user ? JSON.stringify(user) : null;

      if (JSON.stringify(parsedUser) !== stateUser) {
        setUser(parsedUser);
      }
    }, 500);

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-2">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 ml-4" />
          <NavLink
            to="/"
            className="text-gray-700 font-semibold hover:text-green-700 transition px-4 py-2"
          >
            <span className="text-black font-mono font-bold text-xl">
              SAHLA/B2
            </span>
          </NavLink>
        </div>
        <button
          className="md:hidden text-gray-800 bg-transparent focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <div
          className={`flex-col md:flex-row md:flex items-center gap-8 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300 z-20 ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
          <NavLink
            to="/lesen"
            className="text-gray-700 font-semibold hover:text-green-700 transition px-4 py-2"
          >
            Lesen
          </NavLink>
          <NavLink
            to="/hören"
            className="text-gray-700 font-semibold hover:text-green-700 transition px-4 py-2"
          >
            Hören
          </NavLink>
          <NavLink
            to="/schreiben"
            className="text-gray-700 font-semibold hover:text-green-700 transition px-4 py-2"
          >
            Schreiben
          </NavLink>
          <div className="relative">
            {user ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex max-sm:mb-7 items-center gap-2 bg-green-100 px-3 py-1 rounded-full hover:bg-green-200 transition"
              >
                   <User/>  <span className="font-medium text-green-700">
            {user.firstName || "User"}
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            ) : (
              <div className="max-sm:mb-10 flex gap-2 mt-2 md:mt-0">
                <NavLink
                  to="/login"
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="border mr-3 border-green-600 text-green-600 px-4 py-1 rounded hover:bg-green-50 transition"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
            {dropdownOpen && (
              <div className="absolute mr-3 right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
         
                <NavLink
                  to="/profile"
                  className="block text-black px-4 py-2 hover:bg-green-50 hover:text-black/30"
                  onClick={() => setDropdownOpen(false)}
                >
                  Edit Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-white text-left bg-red-500 px-4 py-2 hover:bg-green-50 hover:text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800
      shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* ── Left: Brand ─────────────────────── */}
        <Link
          to="/dashboard"
          className="text-xl font-extrabold text-white tracking-tight hover:opacity-90 transition"
        >
          Dev<span className="text-indigo-400">Board</span>
        </Link>

        {/* ── Right: User actions ──────────────── */}
        {user && (
          <div className="flex items-center gap-4">
            {/* Greeting */}
            <span className="hidden sm:block text-sm text-gray-400">
              Hi,{" "}
              <span className="text-indigo-300 font-semibold">@{user.username}</span>
            </span>

            {/* View Profile */}
            <button
              onClick={() => navigate(`/u/${user.username}`)}
              className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-300
                hover:border-indigo-500 hover:text-white transition-all duration-200"
            >
              View Profile
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-lg bg-red-600/20 border border-red-700/50
                text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600
                transition-all duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

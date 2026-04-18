import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  // ── Validation ─────────────────────────────────
  const validate = () => {
    if (!formData.email.trim())    return "Email is required";
    if (!formData.password.trim()) return "Password is required";
    return null;
  };

  // ── Submit ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", {
        email:    formData.email,
        password: formData.password,
      });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950
      flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* ── Brand ───────────────────────────── */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Dev<span className="text-indigo-400">Board</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Welcome back! Log in to your account.</p>
        </div>

        {/* ── Card ────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Sign in</h2>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 bg-red-900/40 border border-red-600 text-red-300
              text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500
                  border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500
                  border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800
                disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all
                duration-200 shadow-lg shadow-indigo-900/40"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Logging in...
                </span>
              ) : "Login"}
            </button>
          </form>

          {/* Bottom link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-gray-600 mt-4">
          🔐 Your session is secured with JWT authentication
        </p>
      </div>
    </div>
  );
};

export default Login;

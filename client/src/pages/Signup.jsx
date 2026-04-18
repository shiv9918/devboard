import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// ── InputField defined OUTSIDE Signup so React never remounts it ──
// (Defining components inside another component causes focus loss on every keystroke)
const InputField = ({ label, name, type = "text", placeholder, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete="off"
      className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border
        focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
        ${error ? "border-red-500" : "border-gray-700"}`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "", email: "", username: "", password: "", confirmPassword: "",
  });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "username" ? value.toLowerCase() : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim())
      newErrors.name = "Full name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.username.trim())
      newErrors.username = "Username is required";
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username))
      newErrors.username = "Only letters, numbers, and underscores allowed";

    if (!formData.password)
      newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/signup", {
        name:     formData.name,
        email:    formData.email,
        username: formData.username,
        password: formData.password,
      });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950
      flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Dev<span className="text-indigo-400">Board</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Build your dev profile. Showcase your work.</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Create your account</h2>

          {/* API Error Banner */}
          {apiError && (
            <div className="mb-4 bg-red-900/40 border border-red-600 text-red-300
              text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <span>⚠️</span> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField
              label="Full Name" name="name" placeholder="John Doe"
              value={formData.name} onChange={handleChange} error={errors.name}
            />
            <InputField
              label="Email" name="email" type="email" placeholder="john@example.com"
              value={formData.email} onChange={handleChange} error={errors.email}
            />
            <InputField
              label="Username" name="username" placeholder="johndoe"
              value={formData.username} onChange={handleChange} error={errors.username}
            />
            <InputField
              label="Password" name="password" type="password" placeholder="Min 6 characters"
              value={formData.password} onChange={handleChange} error={errors.password}
            />
            <InputField
              label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password"
              value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800
                disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all
                duration-200 shadow-lg shadow-indigo-900/40"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Creating...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

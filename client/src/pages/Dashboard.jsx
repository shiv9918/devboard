import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// ── Spinner ────────────────────────────────────
const Spinner = ({ size = "8" }) => (
  <div className={`w-${size} h-${size} border-4 border-gray-700 border-t-indigo-500
    rounded-full animate-spin`} />
);

// ── Reusable Modal Input ───────────────────────
const ModalInput = ({ label, name, value, onChange, type = "text",
  placeholder, error, as: Tag = "input", rows, helper }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <Tag
      name={name}
      value={value}
      onChange={onChange}
      type={Tag === "input" ? type : undefined}
      placeholder={placeholder}
      rows={rows}
      className={`w-full bg-gray-700 border rounded-lg px-4 py-2.5 text-white
        focus:outline-none focus:border-indigo-500 placeholder:text-gray-500 transition
        resize-none ${error ? "border-red-500" : "border-gray-600"}`}
    />
    {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
    {error  && <p className="text-xs text-red-400  mt-1">{error}</p>}
  </div>
);

const EMPTY_FORM = { title: "", description: "", techStack: "", githubLink: "", liveLink: "" };

// ─────────────────────────────────────────────
//  Dashboard
// ─────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();

  const [projects,       setProjects]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [formLoading,    setFormLoading]    = useState(false);
  const [showForm,       setShowForm]       = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm,  setDeleteConfirm]  = useState(null);
  const [error,          setError]          = useState("");
  const [formData,       setFormData]       = useState(EMPTY_FORM);
  const [formErrors,     setFormErrors]     = useState({});

  // ── Fetch Projects ─────────────────────────
  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await api.get("/api/projects");
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // ── Form Handlers ──────────────────────────
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOpenAdd = () => {
    setFormData(EMPTY_FORM);
    setEditingProject(null);
    setFormErrors({});
    setShowForm(true);
  };

  const handleOpenEdit = (project) => {
    setFormData({
      title:       project.title       || "",
      description: project.description || "",
      techStack:   Array.isArray(project.techStack)
                     ? project.techStack.join(", ")
                     : project.techStack || "",
      githubLink:  project.githubLink  || "",
      liveLink:    project.liveLink    || "",
    });
    setEditingProject(project);
    setFormErrors({});
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormErrors({});
  };

  // ── Validate & Submit ──────────────────────
  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Project title is required";
    if (Object.keys(newErrors).length > 0) { setFormErrors(newErrors); return; }

    setFormLoading(true);
    try {
      if (editingProject) {
        await api.put(`/api/projects/${editingProject._id}`, formData);
      } else {
        await api.post("/api/projects", formData);
      }
      await fetchProjects();
      handleCloseForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project.");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────
  const handleDelete = (id)        => setDeleteConfirm(id);

  const handleConfirmDelete = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project.");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ─────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">

        {/* ── Error Banner ──────────────────── */}
        {error && (
          <div className="mb-6 flex items-center justify-between bg-red-900/40 border
            border-red-600/50 text-red-300 text-sm rounded-lg px-4 py-3">
            <span>⚠️ {error}</span>
            <button onClick={() => setError("")}
              className="ml-4 text-red-400 hover:text-white transition">✕</button>
          </div>
        )}

        {/* ── Header ────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Projects</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Welcome back,{" "}
              <span className="text-indigo-400 font-medium">@{user?.username}</span>
              {" · "}{projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500
              text-white font-semibold px-5 py-2.5 rounded-lg transition-all
              duration-200 shadow-lg shadow-indigo-900/40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
            Add Project
          </button>
        </div>

        {/* ── Loading State ─────────────────── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Spinner size="12" />
            <p className="text-gray-500 text-sm">Loading your projects...</p>
          </div>

        /* ── Empty State ──────────────────── */
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-xl font-semibold text-white mb-2">No projects yet</h2>
            <p className="text-gray-400 text-sm mb-6">
              Click &ldquo;Add Project&rdquo; to showcase your work
            </p>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500
                text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
              </svg>
              Add your first project
            </button>
          </div>

        /* ── Projects Grid ────────────────── */
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════
          ADD / EDIT MODAL
      ═══════════════════════════════════════ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50
          flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6
            w-full max-w-lg shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-white transition text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <ModalInput
                label="Project Title *"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="My Awesome Project"
                error={formErrors.title}
              />
              <ModalInput
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="A brief description of your project..."
                as="textarea"
                rows={3}
              />
              <ModalInput
                label="Tech Stack"
                name="techStack"
                value={formData.techStack}
                onChange={handleFormChange}
                placeholder="React, Node.js, MongoDB"
                helper="Separate technologies with commas"
              />
              <ModalInput
                label="GitHub Link"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleFormChange}
                type="url"
                placeholder="https://github.com/username/repo"
              />
              <ModalInput
                label="Live Link"
                name="liveLink"
                value={formData.liveLink}
                onChange={handleFormChange}
                type="url"
                placeholder="https://yourproject.live"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseForm}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200
                  font-medium py-2.5 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={formLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800
                  disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg
                  transition-all duration-200 flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <>
                    <Spinner size="4" />
                    {editingProject ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingProject ? "Update Project" : "Add Project"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          DELETE CONFIRM DIALOG
      ═══════════════════════════════════════ */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50
          flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-red-500/30 rounded-xl p-6
            w-full max-w-sm shadow-2xl text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Project?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone. The project will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200
                  font-medium py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold
                  py-2.5 rounded-lg transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

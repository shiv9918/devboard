import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

/** "2024-01-15T..." → "Jan 2024" */
const formatMemberSince = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", year: "numeric",
  });
};

/** "2024-01-15T..." → "3 days ago" / "Jan 15, 2024" */
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days  = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30)  return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

/** "Shiva Kumar" → "SK" */
const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────

/** Animated skeleton block */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
);

/** Stat box in profile header */
const StatBox = ({ value, label }) => (
  <div className="bg-gray-700/50 rounded-xl px-6 py-4 text-center min-w-[90px]">
    <p className="text-3xl font-bold text-white">{value}</p>
    <p className="text-gray-400 text-xs mt-1">{label}</p>
  </div>
);

/** Public project card (no edit/delete) */
const PublicProjectCard = ({ project }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col
    justify-between hover:border-indigo-500/50 transition-all duration-200 group">

    {/* Top */}
    <div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300
        transition-colors">
        {project.title}
      </h3>

      {project.description ? (
        <p className="text-gray-400 text-sm mb-4"
          style={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}>
          {project.description}
        </p>
      ) : (
        <p className="text-gray-600 text-sm italic mb-4">No description</p>
      )}

      {/* Tech badges */}
      {project.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, i) => (
            <span key={i}
              className="bg-indigo-900/50 text-indigo-300 text-xs px-2.5 py-1
                rounded-full border border-indigo-800/60">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Bottom */}
    <div>
      {/* Link buttons */}
      {(project.githubLink || project.liveLink) && (
        <div className="flex flex-wrap gap-2 mt-2 mb-3">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600
                text-white text-sm rounded-lg px-3 py-1.5 transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57
                  0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695
                  -.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305
                  3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385
                  1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135
                  3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225
                  0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3
                  0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500
                text-white text-sm rounded-lg px-3 py-1.5 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Live Demo
            </a>
          )}
        </div>
      )}

      {/* Footer date */}
      <p className="text-gray-600 text-xs mt-2 pt-3 border-t border-gray-700/60">
        Added {timeAgo(project.createdAt)}
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────
//  Loading Skeleton
// ─────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-950">
    {/* Top bar skeleton */}
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-4" />

    <div className="max-w-4xl mx-auto px-4 mt-8">
      {/* Header card skeleton */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-20 w-24 rounded-xl" />
            <Skeleton className="h-20 w-24 rounded-xl" />
            <Skeleton className="h-20 w-24 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-52 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
//  Profile Page
// ─────────────────────────────────────────────
const Profile = () => {
  const { username }  = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [notFound,    setNotFound]    = useState(false);

  const isOwner = user?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      setNotFound(false);
      try {
        const { data } = await api.get(`/api/projects/user/${username}`);
        setProfileData(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || "Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  // ── States ──────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  if (notFound) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-6xl mb-4">😕</div>
      <h1 className="text-2xl font-bold text-white mb-2">Profile not found</h1>
      <p className="text-gray-400 text-sm mb-6">
        No user found with username{" "}
        <span className="text-indigo-400 font-medium">@{username}</span>
      </p>
      <button onClick={() => navigate("/")}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium
          px-6 py-2.5 rounded-lg transition-colors">
        Go Home
      </button>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-5xl mb-4">⚠️</div>
      <p className="text-red-400 text-center mb-6">{error}</p>
      <button onClick={() => window.location.reload()}
        className="bg-gray-700 hover:bg-gray-600 text-white font-medium
          px-6 py-2.5 rounded-lg transition-colors">
        Try Again
      </button>
    </div>
  );

  const { user: profileUser, projects } = profileData;

  // Computed stats
  const totalProjects  = projects.length;
  const githubCount    = projects.filter((p) => p.githubLink).length;
  const liveCount      = projects.filter((p) => p.liveLink).length;

  // ── Full Profile Render ──────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Top Bar ─────────────────────────── */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/"
            className="text-xl font-extrabold text-white hover:opacity-90 transition">
            Dev<span className="text-indigo-400">Board</span>
          </Link>
          {user ? (
            <button onClick={() => navigate("/dashboard")}
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium
                px-4 py-2 rounded-lg transition-colors">
              My Dashboard
            </button>
          ) : (
            <button onClick={() => navigate("/login")}
              className="text-sm border border-gray-600 hover:border-indigo-500 text-gray-300
                hover:text-white font-medium px-4 py-2 rounded-lg transition-all">
              Login
            </button>
          )}
        </div>
      </div>

      {/* ── Main Content ─────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Profile Header Card ───────────── */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700
          rounded-2xl px-8 py-10 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            {/* Left: Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              {profileUser.avatar ? (
                <img src={profileUser.avatar} alt={profileUser.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-500/30 flex-shrink-0" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
                  flex items-center justify-center ring-4 ring-indigo-500/30 flex-shrink-0">
                  <span className="text-white text-3xl font-bold">
                    {getInitials(profileUser.name)}
                  </span>
                </div>
              )}

              {/* Info */}
              <div>
                <h1 className="text-2xl font-bold text-white">{profileUser.name}</h1>
                <p className="text-gray-400 text-sm mt-0.5">@{profileUser.username}</p>
                {profileUser.bio && (
                  <p className="text-gray-300 text-sm mt-2 max-w-md leading-relaxed">
                    {profileUser.bio}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  🗓 Member since {formatMemberSince(profileUser.createdAt)}
                </p>
                {isOwner && (
                  <button onClick={() => navigate("/dashboard")}
                    className="mt-3 text-sm border border-indigo-500 text-indigo-400
                      hover:bg-indigo-500/10 px-4 py-2 rounded-lg transition-all inline-block">
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Right: Stats */}
            <div className="flex gap-3 flex-wrap">
              <StatBox value={totalProjects} label="Projects"     />
              <StatBox value={githubCount}   label="GitHub Repos" />
              <StatBox value={liveCount}     label="Live Projects" />
            </div>
          </div>
        </div>

        {/* ── Projects Section ──────────────── */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Projects</h2>
            <p className="text-gray-500 text-sm mt-1">
              {isOwner ? "Your public portfolio" : `${profileUser.name}'s projects`}
            </p>
          </div>
          {isOwner && (
            <button onClick={() => navigate("/dashboard")}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              + Add Project
            </button>
          )}
        </div>

        {/* Empty state */}
        {projects.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <div className="text-5xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
            {isOwner ? (
              <>
                <p className="text-gray-400 text-sm mb-4">
                  Add your first project to start building your portfolio
                </p>
                <button onClick={() => navigate("/dashboard")}
                  className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white
                    font-medium px-5 py-2.5 rounded-lg transition-colors">
                  Add your first project →
                </button>
              </>
            ) : (
              <p className="text-gray-400 text-sm">
                {profileUser.name} hasn&apos;t added any projects yet.
              </p>
            )}
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <PublicProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ────────────────────────────── */}
      <footer className="text-center text-gray-600 text-sm py-10 border-t border-gray-800 mt-8">
        <p>
          Built with{" "}
          <span className="text-indigo-500 font-semibold">DevBoard</span>
          {" · "}
          {new Date().getFullYear()}
        </p>
        <Link to="/signup"
          className="text-indigo-500 hover:text-indigo-400 transition-colors mt-1 inline-block text-xs">
          Create your profile →
        </Link>
      </footer>
    </div>
  );
};

export default Profile;

# DevBoard — Developer Portfolio Tracker

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://devboard-client.vercel.app)
[![API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://devboard-server.onrender.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://cloud.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## What is DevBoard?

**DevBoard** is a full-stack MERN application that lets developers build and share a public portfolio of their projects. Users can sign up, add projects with tech stacks and links, and share a public profile URL with anyone — no login required to view a profile.

---

## Screenshots

> Dashboard — manage your projects

![Dashboard](./screenshots/dashboard.png)

> Public Profile — shareable with anyone

![Profile](./screenshots/profile.png)

> Login / Signup

![Auth](./screenshots/auth.png)

---

## Features

- 🔐 **JWT Authentication** — secure signup, login, and logout
- 🗂️ **Project Dashboard** — add, edit, and delete projects
- 🏷️ **Tech Stack Badges** — visual tags per project
- 🔗 **GitHub & Live Demo links** per project card
- 🌐 **Public Profile** — shareable at `/u/:username` (no login needed)
- 📊 **Profile Stats** — total projects, GitHub repos, live projects
- 📱 **Responsive** — mobile + desktop layouts
- ☁️ **Fully Deployed** — Vercel (frontend) + Render (backend) + MongoDB Atlas

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| HTTP Client | Axios |
| Routing | React Router DOM v6 |
| Deployment | Vercel (frontend), Render (backend) |

---

## Live Links

| Service | URL |
|---------|-----|
| 🖥️ Frontend | https://devboard-client.vercel.app |
| ⚙️ Backend API | https://devboard-server.onrender.com |
| 🩺 Health Check | https://devboard-server.onrender.com/ |

> **Note:** The Render free tier sleeps after 15 min of inactivity. First request may take 30–50 seconds (cold start).

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Git

### Clone & Run

```bash
# Clone the repository
git clone https://github.com/shiv9918/devboard.git
cd devboard
```

#### Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env — fill in MONGO_URI and JWT_SECRET
npm run dev
# Server runs on http://localhost:5000
```

#### Frontend (new terminal)

```bash
cd client
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000
npm run dev
# App runs on http://localhost:5173
```

---

## Environment Variables

### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/devboard
JWT_SECRET=your_long_random_secret_here
CLIENT_URL=https://your-app.vercel.app
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ | Health check |
| `POST` | `/api/auth/signup` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login and get JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `GET` | `/api/projects` | ✅ | Get logged-in user's projects |
| `POST` | `/api/projects` | ✅ | Create new project |
| `PUT` | `/api/projects/:id` | ✅ | Update project (owner only) |
| `DELETE` | `/api/projects/:id` | ✅ | Delete project (owner only) |
| `GET` | `/api/projects/user/:username` | ❌ | Public profile data |

> ✅ = requires `Authorization: Bearer <token>` header

---

## Project Structure

```
devboard/
├── server/                     # Express backend
│   ├── models/
│   │   ├── User.js             # Mongoose User schema
│   │   └── Project.js          # Mongoose Project schema
│   ├── routes/
│   │   ├── auth.js             # signup / login / me
│   │   └── projects.js         # CRUD + public profile
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── tests/
│   │   └── api.test.ps1        # 61 PowerShell API tests
│   ├── .env.example
│   ├── .gitignore
│   └── index.js                # App entry point
│
└── client/                     # React frontend
    ├── src/
    │   ├── api/
    │   │   └── axios.js        # Configured Axios instance
    │   ├── context/
    │   │   └── AuthContext.jsx # Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProjectCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Profile.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── vercel.json             # SPA routing fallback
    ├── .env.example
    └── .gitignore
```

---

## Author

**Shivam Mishra**

[![GitHub](https://img.shields.io/badge/GitHub-shiv9918-181717?style=flat&logo=github)](https://github.com/shiv9918)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-shiv9918-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/shiv9918)
[![LeetCode](https://img.shields.io/badge/LeetCode-Shiv__9918-FFA116?style=flat&logo=leetcode)](https://leetcode.com/u/Shiv_9918/)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ using the MERN stack*

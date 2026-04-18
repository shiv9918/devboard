# DevBoard

<div align="center">

### Developer Portfolio Tracker for Modern Builders

A polished full-stack MERN application that helps developers create, manage, and share a public portfolio of projects through a clean dashboard and a public profile page.

[![Live Demo](https://img.shields.io/badge/Live-Demo-01696F?style=for-the-badge&logo=vercel&logoColor=white)](https://devboard-client.vercel.app/)
[![Backend API](https://img.shields.io/badge/API-Node.js-1F2937?style=for-the-badge&logo=node.js&logoColor=white)](https://devboard-server.onrender.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-0F172A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Express-111827?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-166534?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-7C3AED?style=for-the-badge)](./LICENSE)

</div>

---

## Overview

**DevBoard** is a full-stack portfolio management platform built for developers who want a simple way to showcase their work online. Users can create an account, manage projects from a private dashboard, attach tech stacks and external links, and publish a shareable public profile that anyone can view.

This project demonstrates practical full-stack engineering with authentication, protected CRUD operations, REST APIs, responsive UI design, and cloud deployment using modern MERN tooling.

---

## Why This Project Stands Out

- Clean full-stack architecture with separate **client** and **server** applications.
- Secure **JWT-based authentication** with protected routes.
- Public profile system for showcasing developer projects without requiring visitor login.
- Responsive and modern UI built for both desktop and mobile users.
- Production deployment using **Vercel**, **Render**, and **MongoDB Atlas**.
- Strong project structure suitable for portfolio submission and recruiter review.

---

## Core Features

- **Authentication:** Sign up, log in, stay authenticated, and access protected dashboard routes.
- **Project Management:** Create, update, and delete portfolio projects from a personalized dashboard.
- **Tech Stack Tags:** Add project technologies as visual badges for better readability.
- **External Links:** Attach GitHub repositories and live demo links to each project.
- **Public Portfolio Page:** Share a public developer profile using a username-based route.
- **Project Insights:** View profile-level stats such as total projects, GitHub-linked projects, and live demo counts.
- **Responsive Design:** Optimized layouts for mobile, tablet, and desktop screens.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router DOM |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| API Communication | Axios |
| Deployment | Vercel, Render |

---

## Architecture

```text
devboard/
├── client/                # React frontend
│   ├── src/
│   │   ├── api/           # Axios configuration
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Global auth state
│   │   ├── pages/         # App pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/                # Express backend
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── tests/             # API test scripts
│   ├── .env.example
│   └── index.js
│
└── README.md
```

---

## Live Deployment

- **Frontend:** https://devboard-client.vercel.app/
- **Backend API:** https://devboard-server.onrender.com/
- **Health Check:** https://devboard-server.onrender.com/

> **Note:** If the backend is hosted on Render free tier, the first request may take a few seconds because the service can cold start after inactivity.

---

## Local Setup

### Prerequisites

Make sure you have the following installed:

- Node.js 18 or above
- Git
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/shiv9918/devboard.git
cd devboard
```

### 2. Setup the backend

```bash
cd server
npm install
cp .env.example .env
```

Update `server/.env` with your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup the frontend

Open a new terminal:

```bash
cd client
npm install
cp .env.example .env
```

Update `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the app

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## Environment Variables

### Server

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
CLIENT_URL=http://localhost:5173
```

### Client

```env
VITE_API_URL=http://localhost:5000
```

---

## API Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Health check |
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive JWT |
| GET | `/api/auth/me` | Private | Get authenticated user details |
| GET | `/api/projects` | Private | Fetch logged-in user projects |
| POST | `/api/projects` | Private | Create a new project |
| PUT | `/api/projects/:id` | Private | Update a project |
| DELETE | `/api/projects/:id` | Private | Delete a project |
| GET | `/api/projects/user/:username` | Public | Fetch public profile data |

---

## Deployment Notes

This project is designed for a standard MERN deployment pipeline:

- **Frontend** deployed on Vercel
- **Backend** deployed on Render
- **Database** hosted on MongoDB Atlas
- Environment variables configured separately for client and server

For production deployment, make sure the frontend URL is whitelisted in the backend CORS configuration and the backend URL is set correctly in the frontend environment file.

---

## Highlights for Submission

If you are presenting this project in an academic, internship, or portfolio review setting, this project demonstrates:

- Full-stack MERN development
- Authentication and authorization
- REST API design
- Protected route handling
- Cloud deployment workflow
- Responsive UI implementation
- Real-world portfolio product thinking

---

## Author

**Shivam Mishra**

- GitHub: [shiv9918](https://github.com/shiv9918)
- LinkedIn: [shiv9918](https://linkedin.com/in/shiv9918)
- LeetCode: [Shiv_9918](https://leetcode.com/u/Shiv_9918/)

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for more details.

---

<div align="center">
Made with focus, consistency, and the MERN stack.
</div>

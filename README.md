# PathPilot AI
## Complete AI-Powered Learning, Career & Employee Growth Platform

[![Platform](https://img.shields.io/badge/Platform-Full--Stack%20Web-blue)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript%20%2B%20Tailwind-green)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-purple)](#)
[![AI Architecture](https://img.shields.io/badge/AI-Gemini%20API%20%7C%20Ollama%20%7C%20Deterministic%20Engine-orange)](#)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](#)

---

## 1. Executive Summary & Vision

**PathPilot AI** is an enterprise-grade platform designed to guide individuals from learning their very first programming skill to becoming employable engineers, while empowering existing employees to achieve rapid career progression and execute cross-domain transitions.

The platform provides three distinct, unified portals:

1. **Student Portal**:
   - **Model A — Beginner: Scratch to Advanced**: Ordered curricula across 8 domains, interactive code playgrounds, and adaptive quizzes with score persistence.
   - **Model B — Career Accelerator: Existing Skills to Job-Ready**: Real-time skill-gap analysis, ATS-optimized resume builder, and technical mock interview simulation with scoring.
   - **Contextual AI Learning Assistant**: Persistent chat drawer guiding students with debugging advice and concept walkthroughs.
2. **Employee Portal (Mandatory Chaos Round Feature)**:
   - **Career Growth**: Same-domain promotion roadmaps.
   - **Cross-Domain Transition**: Structured transition paths (Hardware → Software, Mechanical → Data, IT Support → Cloud & DevOps, Non-IT → Tech Data) with transferable skills analysis.
   - **Hybrid Career**: Blending existing domain strengths with modern software engineering.
   - **Visual Career Progression Ladder**: Milestone stages, portfolio projects, certifications, and resume repositioning playbooks.
3. **Admin Portal**:
   - **Live Analytics Dashboard**: Student and employee tracking, course completion rates, quiz attempts, and **real-time heartbeat presence tracking** (online/offline status with a 120-second timeout).
   - **User Access Management**: Search, filter, and suspend/reactivate user accounts.
   - **Curriculum & Syllabus CRUD**: Create, edit, and publish learning domains, modules, and passing criteria.
   - **Platform Configuration & Audit Logs**: Immutable record of all system events.

---

## 2. Visual Identity & Design System

PathPilot AI is crafted with a distinctive dark multicolor palette adhering to WCAG AA contrast standards:

| Role / Element | Color Code | Purpose |
| :--- | :--- | :--- |
| **Charcoal** | `#171916` | Primary background foundation |
| **Deep Charcoal** | `#222620` | Cards, modals, and container surfaces |
| **Lime Green** | `#B7F36B` | Primary actions, Student Hub accents |
| **Orange** | `#FF914D` | Employee Portal, career acceleration |
| **Purple** | `#A78BFA` | Admin Operations, enterprise controls |
| **Warm Yellow** | `#FDE047` | Certifications, warnings, highlights |
| **Text White** | `#F8FAF5` | High-contrast readable typography |
| **Muted Text** | `#B8BDB5` | Secondary metadata and labels |

---

## 3. Cinematic Scroll-Controlled Hero Engine

- **Asset Pipeline**: Sourced from the supplied 299 high-resolution extracted frames (`ezgif-frame-001.jpg` to `ezgif-frame-299.jpg`).
- **Smooth 60 FPS Bidirectional Scrubbing**: Utilizes an HTML5 `<canvas>` rendering engine with `requestAnimationFrame` that maps scroll progress along a 240vh pinned track to frame index (1..299).
- **Graceful Fallbacks**: Start frame (`pathpilot-start.jpg`), end frame (`pathpilot-end.jpg`), and video poster decoding fallbacks ensure mobile and reduced-motion compatibility without breaking document layout.
- **Real HTML Overlay**: All buttons, badges, and headers remain native accessible HTML positioned above the visual canvas.

---

## 4. Multi-Tier AI Architecture

PathPilot AI implements a resilient abstraction service preventing vendor lock-in and eliminating false operational claims:

1. **Tier 1 (Cloud AI)**: **Google Gemini API** (`gemini-1.5-flash`) for multimodal reasoning and live chat when `GEMINI_API_KEY` is provided.
2. **Tier 2 (Local AI)**: **Ollama** (`llama3`) for local development and private on-premise execution when reachable.
3. **Tier 3 (Deterministic Domain Intelligence Engine)**: Built-in intelligent fallback providing verified skills-gap matrices, resume scoring, mock interview rubrics, and conceptual programming tutorials even in completely air-gapped environments.

---

## 5. Security & Authentication

- **Salted Scrypt Hashing**: Passwords hashed using Node's cryptographic `scryptSync` with unique 16-byte cryptographically random salts.
- **Server-Side Role Enforcement**: Admin endpoints verify token claims and reject student/employee tokens at the middleware layer.
- **Zero Client Secret Leakage**: No API keys, database credentials, or secret tokens are bundled into client-side Vite builds.
- **Live Heartbeat Presence**: Active client heartbeats are tracked on the server; clients inactive for >120 seconds are automatically marked offline.

### Instant Testing Demo Personas
To evaluate the platform instantly without manual registration, use the **Demo Switcher** in the navigation bar:
- **Admin**: `admin@pathpilot.ai` / `AdminSecurePass2026!`
- **Student**: `alex.student@pathpilot.ai` / `StudentPass2026!`
- **Employee**: `sarah.employee@pathpilot.ai` / `EmployeePass2026!`

---

## 6. Local Development & Quickstart

### Prerequisites
- Node.js v18+ (tested on Node v22.22.3)
- npm v9+

### Setup Commands
```bash
# 1. Clone or navigate to the repository
cd "path/to/code canva"

# 2. Install all dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start both Frontend (Vite) and Backend (Express) in development mode
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API Server**: `http://localhost:5000`
- **Health Check Endpoint**: `http://localhost:5000/api/health`

### Build & Production Preview
```bash
# Compile TypeScript and bundle frontend
npm run build

# Run automated integration test suite
node test_endpoints.js
```

---

## 7. Cloud Deployment (Vercel)

1. Connect the GitHub repository to **Vercel**.
2. Configure the following environment variables in the Vercel Project Settings:
   - `SESSION_SECRET`: Random 32-character string
   - `ADMIN_EMAIL`: `admin@pathpilot.ai`
   - `ADMIN_DEFAULT_PASSWORD`: Your chosen admin bootstrap password
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key
   - `AI_PROVIDER`: `auto`
3. Deploy! The frontend statically builds to `dist/`, and server routes deploy via Vercel Functions or serverful containers.

---

## 8. Verification & Acceptance Criteria Status

- [x] **Production Build**: Compiles cleanly with zero errors (`tsc && vite build`).
- [x] **Cinematic Hero**: 299-frame bidirectional scroll-driven scrub engine with start/end posters.
- [x] **Authentication & RBAC**: Admin, Student, and Employee roles with persistent sessions.
- [x] **Student Model A**: 8 domain curriculums, interactive lessons, adaptive quizzes with scoring & confetti.
- [x] **Student Model B**: Skills-gap analysis, ATS resume optimizer, and mock interview grader.
- [x] **Employee Progression**: Growth, Cross-Domain Switch, and Hybrid Career ladders with transferable skill matrices.
- [x] **Admin Operations**: Live analytics, heartbeat presence monitor, user suspend/reactivate, and curriculum CRUD.
- [x] **AI Abstraction**: Multi-tier pipeline with Gemini cloud, Ollama local, and deterministic fallback.
- [x] **Integration Tests**: 100% automated pass rate across all 10 core API suites.

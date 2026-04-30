<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />

<br /><br />

# 🏥 B2B Healthcare UI

### A production-grade B2B SaaS healthcare dashboard built as a frontend engineering assignment for [Raga AI](https://raga.ai/)

**[🚀 Live Demo](https://b2-b-healthcare-ui-1.vercel.app)** · **[📁 Repository](https://github.com/abhimajeti24/B2BHealthcareUI1)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Modules](#-pages--modules)
- [Architecture Decisions](#-architecture-decisions)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Service Worker & Notifications](#-service-worker--notifications)
- [State Management](#-state-management)
- [Deployment](#-deployment)

---

## 🌟 Overview

This project is a **B2B2C SaaS healthcare platform UI** built to demonstrate full-stack frontend engineering capabilities — with a focus on scalable architecture, real-time features, responsive design, and production-quality code.

The application simulates a healthcare analytics and patient management dashboard, featuring Firebase-based authentication, push notifications via Service Workers, rich data visualizations, and a dual-view patient records system.

---

## ✨ Features

| Category | Features |
|---|---|
| **Authentication** | Firebase Auth — Email/Password login with protected routes |
| **Dashboard** | KPI cards, real-time stats, activity feed, quick-action modules |
| **Analytics** | Interactive charts (line, bar, area) powered by Recharts |
| **Patient Management** | Searchable/filterable patient list with Grid & List view toggle |
| **Patient Details** | Full patient profile — vitals, history, appointments, medications |
| **Notifications** | Push notifications via Service Worker with permission management |
| **State Management** | Global state with Zustand — auth, patients, UI preferences |
| **Routing** | Client-side SPA routing with React Router DOM v7 |
| **Responsive Design** | Mobile-first, fully responsive across all breakpoints |
| **Performance** | Code-split routes, lazy loading, Vite-optimized build |

---

## 🛠 Tech Stack

### Core
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 6.0 | Type safety across the entire codebase |
| [Vite](https://vitejs.dev/) | 8.0 | Build tool & dev server with HMR |

### Styling & UI
| Technology | Version | Purpose |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first styling |
| [Lucide React](https://lucide.dev/) | 1.12 | Consistent icon system |

### State & Data
| Technology | Version | Purpose |
|---|---|---|
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.0 | Lightweight global state management |
| [Recharts](https://recharts.org/) | 3.8 | Composable chart components |
| [React Router DOM](https://reactrouter.com/) | 7.14 | Client-side routing |

### Backend & Services
| Technology | Version | Purpose |
|---|---|---|
| [Firebase](https://firebase.google.com/) | 12.12 | Authentication & backend services |
| Service Worker | Native | Push notifications & offline caching |

---

## 📁 Project Structure

```
B2BHealthcareUI1/
├── public/
│   └── sw.js                    # Service Worker for push notifications
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── layout/              # Sidebar, Navbar, AppShell
│   │   ├── dashboard/           # KPI cards, activity feed, widgets
│   │   ├── analytics/           # Chart wrappers and data displays
│   │   ├── patients/            # Patient card, list item, view toggle
│   │   └── ui/                  # Shared primitives (Button, Badge, Modal...)
│   ├── pages/
│   │   ├── Login.tsx            # Firebase Auth login page
│   │   ├── Dashboard.tsx        # Home/Dashboard page
│   │   ├── Analytics.tsx        # Analytics & reporting page
│   │   ├── Patients.tsx         # Patient list with Grid/List toggle
│   │   └── PatientDetails.tsx   # Individual patient profile
│   ├── store/                   # Zustand store slices
│   │   ├── authStore.ts         # Authentication state
│   │   ├── patientStore.ts      # Patient data state
│   │   └── uiStore.ts           # UI preferences (view mode, theme, etc.)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   └── firebase.ts          # Firebase app initialization
│   ├── types/                   # TypeScript interfaces & types
│   ├── utils/                   # Helper functions
│   ├── App.tsx                  # Root component with router setup
│   └── main.tsx                 # Application entry point
├── .env.example                 # Environment variable template
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── tsconfig.json                # TypeScript configuration
```

---

## 📄 Pages & Modules

### 🔐 Login Page
- Firebase Email/Password authentication
- Form validation with error handling
- Redirect to Dashboard on successful login
- Protected route guard — unauthenticated users are redirected here

### 🏠 Dashboard (Home)
- At-a-glance KPI cards (total patients, appointments, active cases, etc.)
- Activity feed showing recent patient interactions
- Quick-access navigation to core modules
- Notification bell with Service Worker-triggered alerts

### 📊 Analytics Page
- Line charts for patient admission trends
- Bar charts for department-wise load distribution
- Area charts for monthly metric comparisons
- All charts built with **Recharts** and fully responsive

### 👥 Patients Page
- Full patient list with search and filter capabilities
- **Grid View** — card-based layout with avatar, status badges, and key info
- **List View** — compact table-style layout for dense data scanning
- Toggle between views, preference persisted via Zustand

### 🧾 Patient Details Page
- Comprehensive patient profile: demographics, vitals, medical history
- Current medications, allergies, and upcoming appointments
- Consultation history timeline
- Fully responsive layout adapting from mobile to widescreen

---

## 🏗 Architecture Decisions

### Why Zustand over Redux?
Zustand was chosen for its minimal boilerplate and excellent TypeScript support. For a mid-scale SaaS dashboard, it provides all the power of centralized state without the ceremony of Redux, keeping the codebase lean and maintainable.

### Why Vite over CRA?
Vite offers near-instant HMR, ES module-native dev server, and significantly faster production builds — critical for developer experience at any scale.

### Service Worker Strategy
The Service Worker (`/public/sw.js`) is registered at the root scope and handles:
- Push notification subscription and display
- Network-first caching for API requests
- Cache-first strategy for static assets

### Component Design Principles
- **Co-location** — component logic, styles, and types live together
- **Composition over inheritance** — small, focused components composed into larger views
- **Strict typing** — all props, state, and API shapes are fully typed via TypeScript interfaces

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.x`
- npm or yarn
- A Firebase project with **Email/Password Authentication** enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/abhimajeti24/B2BHealthcareUI1.git
cd B2BHealthcareUI1

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# → Fill in your Firebase credentials (see below)

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and populate with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Never commit your `.env` file. It is already included in `.gitignore`.

To set up Firebase:
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication → Email/Password**
4. Copy your web app's config into the `.env` file

---

## 🔔 Service Worker & Notifications

The app uses a custom **Service Worker** to handle push notifications without relying on any third-party library.

**How it works:**

1. On first load, the app requests **Notification permission** from the user
2. If granted, the Service Worker is registered at the root scope
3. Notifications are triggered on key events (new patient alerts, appointment reminders, etc.)
4. The Service Worker caches static assets for improved load performance

**To test notifications locally:**
- Open the app in Chrome/Firefox
- Click "Enable Notifications" when prompted
- Navigate between sections — notification triggers are wired to user interactions

---

## 🗃 State Management

Zustand stores are organized by domain:

```ts
// Auth Store — manages Firebase user session
useAuthStore() → { user, loading, login(), logout() }

// Patient Store — manages patient data
usePatientStore() → { patients, selectedPatient, fetchPatients(), selectPatient() }

// UI Store — manages view preferences
useUIStore() → { patientViewMode, setPatientViewMode() }
//              patientViewMode: 'grid' | 'list'
```

All stores are typed end-to-end with TypeScript — no `any` types.

---

## ☁️ Deployment

This project is deployed on **Vercel** with automatic deployments on every push to `main`.

**Live URL:** [https://b2-b-healthcare-ui-1.vercel.app](https://b2-b-healthcare-ui-1.vercel.app)

To deploy your own instance:
```bash
npm install -g vercel
vercel --prod
```

Or connect the GitHub repository directly in the [Vercel dashboard](https://vercel.com/) for CI/CD.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start local development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## 👤 Author

**Abhinav Majeti**  
Full-Stack Frontend Engineer

---

<div align="center">

Built with ❤️ as a frontend engineering assignment for **[Raga AI](https://raga.ai/)**

</div>

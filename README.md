# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites
# ProctorVision

ProctorVision is a responsive web dashboard for remote proctoring and interview monitoring. It provides real-time video feeds, detection indicators, event logging, candidate management, and session reporting — all organized into a fast, modular SPA built with Vite, React, and Tailwind CSS.

## Quick description

ProctorVision helps proctors and administrators supervise remote assessments and interviews. The UI exposes panels for live monitoring, interview dashboards, candidate management, and session reports so teams can observe, respond, and audit sessions in real time.

## Key features

- Real-time video feed panels with configurable displays
- Detection status and alert banners to surface suspicious activity
- Event logging and timeline-based session reports
- Candidate management (add, filter, bulk actions, stats)
- Emergency controls and quick actions for live sessions
- Exportable session reports and filters for post-session review
- Small, reusable UI components under `src/components`

## Tech stack

- React + JSX
- Vite for fast dev server and builds
- Tailwind CSS + PostCSS for styling
- Plain JavaScript (no TypeScript)

# ProctorVision

ProctorVision is a responsive web dashboard for remote proctoring and interview monitoring. It provides real-time video feeds, detection indicators, event logging, candidate management, and session reporting — all organized into a fast, modular SPA built with Vite, React, and Tailwind CSS.

## Quick description

ProctorVision helps proctors and administrators supervise remote assessments and interviews. The UI exposes panels for live monitoring, interview dashboards, candidate management, and session reports so teams can observe, respond, and audit sessions in real time.

## Key features

- Real-time video feed panels with configurable displays
- Detection status and alert banners to surface suspicious activity
- Event logging and timeline-based session reports
- Candidate management (add, filter, bulk actions, stats)
- Emergency controls and quick actions for live sessions
- Exportable session reports and filters for post-session review
- Small, reusable UI components under `src/components`

## Tech stack

- React + JSX
- Vite for fast dev server and builds
- Tailwind CSS + PostCSS for styling
- Plain JavaScript (no TypeScript)

## Project structure (high level)

- `index.html` — HTML entry
- `src/index.jsx`, `src/App.jsx` — app bootstrap
- `src/Routes.jsx` — routing
- `src/pages/` — page-level modules (candidate-management, interview-dashboard, live-monitoring-panel, session-reports)
- `src/components/` — UI components and small building blocks
- `public/` — static assets (icons, manifest, default images)

## Getting started (developer)

Prerequisites

- Node.js 14+ and npm

Install dependencies and run the dev server

```powershell
npm install
npm run dev
```

Build and preview production

```powershell
npm run build
npm run preview
```

## How to contribute

- Follow existing code and component patterns in `src/components`.
- Keep logic encapsulated in small components and move shared utilities into `src/utils`.
- Add unit or integration tests for new features when possible.
- Open issues or PRs with clear descriptions and screenshots when relevant.

## Where to look in the code

- Candidate management pages: `src/pages/candidate-management`
- Interview dashboard pages: `src/pages/interview-dashboard`
- Live monitoring: `src/pages/live-monitoring-panel`
- Session reports: `src/pages/session-reports`
- Shared UI primitives: `src/components/ui`


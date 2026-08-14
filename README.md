# 🏛️ PetitionAI — Intelligent Petition Classification & Resolution System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)

> **PetitionAI** is an AI-powered civic grievance platform that automates complaint classification, urgency prioritization, duplicate petition detection, and intelligent department routing. Built to streamline citizen-to-government interaction for faster, transparent resolution.

---

## 🌟 Key Features

### 🤖 Intelligent AI Engine (`src/lib/ai/`)
- **Automated Classification**: Automatically tags petitions with civic categories (*Roads & Infrastructure, Water Works, Sanitation, Electricity, Public Safety, etc.*) and routes them to the correct government department.
- **Duplicate Detection**: Identifies matching or nearby duplicate complaints using similarity scoring to avoid redundant officer workloads.
- **Urgency & Priority Scoring**: Scans text for critical keywords (*emergencies, floods, power outages, hazard level*) to assign priority scores (*Critical, High, Medium, Low*).
- **Sentiment Analysis**: Evaluates citizen sentiment (*Positive, Neutral, Negative, Angry*) to prioritize high-friction grievances.

### 👥 Role-Based Portals (`src/pages/`)
1. **Citizen Portal**
   - Submit petitions with detailed descriptions, location tags, and file attachments.
   - Track petition progress in real time with interactive status timelines.
   - Receive automated notifications upon status updates and submit post-resolution feedback.
2. **Officer Portal**
   - View assigned department complaints with deep AI breakdown cards.
   - Update complaint status, record resolution notes, and attach resolution proof.
   - Escalate critical cases to higher administrative authorities.
3. **Admin Dashboard**
   - System-wide overview of all active petitions, users, and department statistics.
   - Assign officers to cases, manage user permissions, and inspect department performance analytics.

---

## 📂 Project Architecture

```
PetitionAI/
├── public/                  # Static assets & favicons
│   ├── favicon.svg          # SVG vector favicon
│   ├── favicon.png          # PNG favicon logo
│   └── robots.txt           # SEO rules
├── src/
│   ├── assets/              # App images and banners
│   ├── components/
│   │   ├── features/        # AI Analysis Card, Chatbot, Timeline, etc.
│   │   ├── layout/          # Navbar & Header navigation
│   │   └── ui/              # Reusable Radix / Tailwind UI primitives
│   ├── constants/           # Mock data, category definitions, departments
│   ├── hooks/               # State hooks (useAuthProvider, useComplaints, useNotifications)
│   ├── lib/
│   │   ├── ai/              # Modular AI Engine
│   │   │   ├── classification.ts
│   │   │   ├── duplicateDetection.ts
│   │   │   ├── priorityPrediction.ts
│   │   │   ├── sentimentAnalysis.ts
│   │   │   └── index.ts
│   │   ├── auth.ts          # Authentication logic
│   │   └── utils.ts         # Utility helpers & formatters
│   ├── pages/               # Application routes
│   │   ├── admin/           # Admin Dashboard, Complaints, Analytics, Users
│   │   ├── citizen/         # Citizen Dashboard, Submit Petition, My Petitions
│   │   ├── officer/         # Officer Dashboard, Officer Petition Detail
│   │   ├── LandingPage.tsx  # Public landing page
│   │   ├── LoginPage.tsx    # Auth login page
│   │   └── RegisterPage.tsx # Citizen registration
│   ├── types/               # Modularized TypeScript definitions
│   │   ├── ai.ts            # AI analysis types
│   │   ├── petition.ts      # Complaint & Department types
│   │   ├── user.ts          # User & Role types
│   │   └── index.ts         # Central re-exports
│   ├── App.tsx              # Main App & Router configuration
│   └── main.tsx             # Application entry point
├── package.json             # NPM dependencies & scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # Root TypeScript solution config
├── tsconfig.app.json        # Frontend TypeScript config
└── vite.config.ts           # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Balachandransakthivel/PetitionAI.git
   cd PetitionAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Linting & Type Checking**
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **UI Components**: [Radix UI Primitives](https://www.radix-ui.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Routing & State**: [React Router v6](https://reactrouter.com/), Context API
- **Charts & Data**: [Recharts](https://recharts.org/)

---

## 🔐 Demo Credentials

Quick login credentials for testing each portal role:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Citizen** | `citizen@demo.com` | `citizen123` |
| **Officer** | `officer@demo.com` | `officer123` |
| **Admin** | `admin@demo.com` | `admin123` |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

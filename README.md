# SLA AI Platform ⚡
> Intelligent Enterprise SLA Management & Predictive Breach Risk Intelligence Platform

SLA AI Platform is a next-generation enterprise application engineered to transform reactive incident management into proactive SLA governance. Powered by explainable ML heuristics, real-time workload-aware triage, and automated 1-click remediation, it prevents SLA breaches before they impact customer trust or incur financial penalties.

---

## 🌟 Key Architecture & Features

### 1. 🧠 Autonomous AI Risk Engine (`src/utils/riskCalculator.ts`)
- **Multi-Factor Risk Scoring**: Evaluates SLA elapsed ratio (40%), engineer queue saturation (25%), technical architecture complexity (20%), and resource backups (15%).
- **Explainable Root Cause Diagnostics**: Generates human-readable explanations of why an incident is at risk (e.g. *“Marcus Vance is handling 6 active P1 incidents (120% capacity)”*).
- **1-Click AI Auto-Remediation**: Recommends high-impact mitigations with projected risk reductions (e.g. auto-reassign to available SRE, pair co-responder, request maintenance extension).
- **Live Pre-Triage Prediction**: Analyzes incoming request text in real time as the requester types, automatically predicting target resolution hours, suggesting priority, and flagging urgency signals.

### 2. ⏱️ Real-Time SLA Calculation Engine (`src/utils/slaCalculator.ts`)
- Live countdown timers ticking every 15 seconds.
- Dynamic SLA milestone states: `MET`, `ON_TRACK`, `WARNING`, `AT_RISK`, and `BREACHED`.
- Support for both Response SLA (time-to-first-reply) and Resolution SLA deadlines.

### 3. 🛡️ Operations Command Center (`/admin`)
- **Executive Telemetry**: Active tickets, at-risk volume, compliance rate (e.g. 97.4%), and financial penalties prevented.
- **At-Risk Triage Hub (`/admin/at-risk`)**: Dedicated command center prioritizing high-risk incidents with instant 1-click auto-mitigation triggers.
- **SLA Performance Overview**: Department-by-department compliance radar and live risk distribution donut charts.
- **360° Incident Management (`/admin/requests/:id`)**: Comprehensive incident timeline, assignment controls, and status transitions.
- **SLA Policy Studio (`/admin/sla-policies`)**: Multi-tier policy governance (Platinum 99.9%, Gold 99.5%, Silver 98.0%), business hours, and penalty rates.

### 4. 👤 Client Requester Portal (`/client`)
- **Self-Service Tracking**: Real-time progress bars, SLA countdown timers, and lifecycle stepper.
- **Smart Request Creation (`/client/create`)**: Intelligent request submission form with live AI pre-triage predictions.
- **Two-Way Support Thread**: Collaborative audit timeline between client and engineering team.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 📂 Project Directory Structure

```
sla-ai-platform/
│
├── public/
│   └── assets/
│
├── src/
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Select.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── requests/
│   │   │   ├── RequestCard.tsx
│   │   │   ├── RequestTable.tsx
│   │   │   ├── RequestForm.tsx
│   │   │   ├── RequestTimeline.tsx
│   │   │   ├── RiskBadge.tsx
│   │   │   ├── RiskExplanation.tsx
│   │   │   └── RecommendedAction.tsx
│   │   │
│   │   └── admin/
│   │       ├── StatsCards.tsx
│   │       ├── RiskRanking.tsx
│   │       ├── RequestFilters.tsx
│   │       └── SLAOverview.tsx
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   │
│   │   ├── client/
│   │   │   ├── ClientDashboard.tsx
│   │   │   ├── CreateRequest.tsx
│   │   │   └── RequestDetails.tsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── AtRiskRequests.tsx
│   │       ├── RequestDetails.tsx
│   │       └── SLAPolicies.tsx
│   │
│   ├── data/
│   │   ├── mockRequests.ts
│   │   ├── mockSLA.ts
│   │   ├── mockUsers.ts
│   │   └── mockDepartments.ts
│   │
│   ├── types/
│   │   ├── request.ts
│   │   ├── user.ts
│   │   └── sla.ts
│   │
│   ├── utils/
│   │   ├── riskCalculator.ts
│   │   ├── slaCalculator.ts
│   │   └── formatters.ts
│   │
│   ├── hooks/
│   │   └── useRequests.ts
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

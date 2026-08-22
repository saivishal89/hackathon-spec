# SLA AI Platform ⚡
> **Autonomous AI-Powered SLA Management & Breach Prediction Platform for B2B Enterprise SaaS**

[![Docker Compose](https://img.shields.io/badge/Docker-Compose_Ready-2496ED?logo=docker&logoColor=white)](file:///c:/Users/pagil/OneDrive/Desktop/hackathon-spec/docker-compose.yml)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?logo=fastapi&logoColor=white)](file:///c:/Users/pagil/OneDrive/Desktop/hackathon-spec/backend/app/main.py)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_Alpine-4169E1?logo=postgresql&logoColor=white)](file:///c:/Users/pagil/OneDrive/Desktop/hackathon-spec/docker-compose.yml)
[![Redis](https://img.shields.io/badge/Redis-7_Alpine-DC382D?logo=redis&logoColor=white)](file:///c:/Users/pagil/OneDrive/Desktop/hackathon-spec/docker-compose.yml)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](file:///c:/Users/pagil/OneDrive/Desktop/hackathon-spec/src/App.tsx)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](file:///c:/Users/pagil/OneDrive/Desktop/hackathon-spec/tsconfig.json)

---

## 🎯 The Startup Core Direction

Traditional support software reacts *after* failure occurs. **SLA AI is an autonomous, predictive operations platform** that forecasts which customer requests will breach their contracted SLA, explains the root cause, and automatically helps engineering teams prevent the breach before financial penalties or customer churn happen.

### Core Product Loop
$$\text{Predict} \longrightarrow \text{Prevent} \longrightarrow \text{Resolve} \longrightarrow \text{Learn}$$

1. **Predict**: Multi-factor heuristic & ML risk scoring identifies imminent breaches before they happen.
2. **Prevent**: 1-Click AI Auto-Remediations (smart SRE queue rebalancing, pairing senior co-responders, automated grace protocols).
3. **Resolve**: Real-time SLA countdowns, priority timelines, and multi-tier policy governance.
4. **Learn**: Integrated post-resolution Customer Satisfaction (CSAT) loop turns customer ratings directly into product intelligence.

---

## 🏛️ System Architecture

```text
                                 USERS
                                   │
                      ┌────────────┴────────────┐
                      │                         │
                   B2B Client                Admin / Agent
                      │                         │
                      └────────────┬────────────┘
                                   │
                             React Frontend (Vite)
                                   │
                                 Nginx (Reverse Proxy :80)
                                   │
                            Docker Network
                                   │
                          ┌────────▼────────┐
                          │ FastAPI Backend │ (:8000)
                          │ (Python 3.12)   │
                          └────────┬────────┘
                                   │
               ┌───────────────────┼───────────────────┐
               │                   │                   │
               ▼                   ▼                   ▼
        Authentication        SLA Engine          AI Risk Engine
        • OAuth + MFA         • SLA Policy Calc   • Cost-tiered heuristic
        • JWT + RBAC          • Auto Escalation   • Explainable root-cause
               │                   │              • 1-Click mitigation
               └───────────────────┼───────────────────┘
                                   │
                              PostgreSQL (:5432)
                                   │
                  ┌────────────────┼────────────────┐
                  ▼                ▼                ▼
             Redis (:6379)     Background Worker  Audit Logs & Feedback
                  │           (SLA Monitor Loop)
                  ▼
            Task Queue
```

---

## 🐳 Docker Multi-Container Architecture

Launch the entire 6-container production stack with a single command:

```bash
docker compose up --build
```

### Containers Orchestrated:
| Service | Image / Stack | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **`gateway`** | `nginx:alpine` | `:80` | Reverse proxy routing `/api` to backend and root to SPA |
| **`frontend`** | `node:20` / `nginx` | `:5000` | High-performance React 18 SPA |
| **`backend`** | `python:3.12-slim` (FastAPI) | `:8000` | REST API, Auth, SLA Engine, AI Intelligence |
| **`worker`** | `python:3.12-slim` | Background | Continuous SLA deadline monitor & risk score recalculator |
| **`postgres`** | `postgres:16-alpine` | `:5432` | Relational database persistence with auto-seeding |
| **`redis`** | `redis:7-alpine` | `:6379` | In-memory caching and task queuing |

---

## 💡 Selective, Cost-Tiered AI Architecture

SLA AI follows a disciplined B2B SaaS architecture: **"AI where it creates value, automation everywhere else."**

```text
Request Created
       │
       ▼
Rule-based SLA Deadline Calculation (Response & Resolution Windows)
       │
       ▼
Cheap Fast Heuristic Risk Calculation (Time Elapsed + Queue Saturation + Complexity)
       │
       ▼
Is Risk Score > 60%?
      ├── NO  ──► Standard On-Track Governance (0 AI API Cost)
      └── YES ──► Deep AI Diagnostic Analysis & 1-Click Remediation Playbooks
```

This delivers sub-millisecond response times for 90% of requests while reserving deep AI models exclusively for high-risk, high-penalty incidents.

---

## 🚀 Quick Start Guide

### Option 1: Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/saivishal89/hackathon-spec.git
cd hackathon-spec

# Start all containers
docker compose up
```

Open `http://localhost` in your browser.

---

### Option 2: Local Development (Hybrid)

#### 1. Start FastAPI Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Start React Frontend (Terminal 2)
```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5000` and automatically proxies `/api` requests to `http://localhost:8000`.

---

## 🔑 Enterprise Preset Personas

| Role | Email | Password | Permissions & Portal |
| :--- | :--- | :--- | :--- |
| **Admin** | `sarah.connor@enterprise.io` | `password123` | Full Operations Command Center, At-Risk Triage, Policies, Analytics, Billing |
| **Client** | `alex.morgan@fintechcorp.com` | `password123` | Requester Workspace, Submit Tickets, Track SLA Timers, Give Feedback |
| **Agent / SRE** | `david.kim@enterprise.io` | `password123` | Queue Handling, Ticket Resolution, Timeline Updates |
| **Staff DBA** | `elena.rostova@enterprise.io` | `password123` | Database Incident Specialist, Co-Responder |

---

## 📡 API Surface (`/docs`)

FastAPI automatically generates interactive Swagger documentation at `http://localhost:8000/docs`:

- `POST /api/auth/login` - Authenticate & obtain JWT token with RBAC permissions
- `POST /api/auth/register` - Organization onboarding
- `GET /api/requests` - Tenant-isolated request queue
- `POST /api/requests` - Submit incident with dynamic SLA timestamp calculation
- `POST /api/requests/pre-triage` - Real-time diagnostic prediction as user types
- `POST /api/requests/{id}/reassign` - 1-Click engineer rebalance
- `POST /api/requests/{id}/execute-ai-action` - 1-Click AI auto-remediation
- `POST /api/feedback` - Submit post-resolution CSAT rating & SLA satisfaction
- `GET /api/feedback` - Aggregate customer satisfaction intelligence
- `GET /api/policies` - SLA Policy governance (Platinum, Gold, Silver tiers)
- `GET /api/analytics/overview` - MTTR velocity, compliance timeline, risk breakdown
- `GET /api/subscriptions/plans` - B2B SaaS pricing tiers & usage quotas
- `GET /api/health` - System health check

---

## 🏆 Hackathon Presentation Narrative

1. **The Pain**: B2B enterprise agreements carry heavy SLA breach penalties ($50-$150/minute). Teams currently discover breaches *after* failure.
2. **The Solution**: SLA AI computes dynamic breach probability and prescribes actionable 1-click mitigations to preserve customer trust.
3. **The Moat**: Tiered AI cost governance + integrated post-resolution customer feedback loop.
4. **The Stack**: React 18 + Python FastAPI + PostgreSQL 16 + Redis + Docker Compose.

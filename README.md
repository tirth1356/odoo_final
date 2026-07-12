# ESG Intelligence Platform

A full-stack ESG (Environmental, Social, Governance) management platform for tracking corporate sustainability metrics, CSR activities, compliance audits, and employee engagement through gamification.

Built with a **Django REST Framework** backend and a **React + Vite** frontend, styled in a neo-brutalist design system.

## Features

- **Dashboard** — Company-wide ESG score overview, department rankings, and emissions trend.
- **Environmental** — Emission tracking across purchases, manufacturing, expenses, and fleet records; environmental goals.
- **Social** — CSR activities, employee participation with proof-of-evidence approval workflow, diversity metrics, training completion.
- **Governance** — Policy management, scheduled audits, compliance issue tracking with automatic overdue detection.
- **Gamification** — XP/points system, challenges, badge unlocks, company leaderboard, and a rewards redemption shop.
- **Reports** — CSV/Excel export of ESG data by module and department.
- **Auth** — JWT-based login/registration.

## Tech Stack

**Backend**
- Django 5 + Django REST Framework
- SimpleJWT for authentication
- PostgreSQL (via `dj-database-url`)
- ReportLab for report generation

**Frontend**
- React 19 + Vite
- Tailwind CSS 4
- Axios
- React Router

## Project Structure

```
odoo_final/
├── backend/
│   ├── config/            # Django project settings & root URLs
│   ├── esg_api/            # Main app: models, views, serializers, urls
│   │   └── management/commands/seed_esg.py   # Demo data seeder
│   └── manage.py
└── frontend/
    └── src/
        ├── App.jsx          # Shell, navigation, global data fetching
        ├── Dashboard.jsx
        ├── Environmental.jsx
        ├── Social.jsx
        ├── Governance.jsx
        ├── Gamification.jsx
        ├── Settings.jsx
        └── components/      # LandingPage, LoginPage, SignupPage, BrutalistModal
```

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Configure a `DATABASE_URL` environment variable (PostgreSQL) or rely on the default configured in `config/settings.py`.

```bash
python manage.py migrate
python manage.py seed_esg   # populates demo departments, users, policies, badges, rewards, etc.
python manage.py runserver
```

The API is served at `http://localhost:8000/api/`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and expects the API at `http://localhost:8000/api` by default (override with `VITE_API_URL`).

## API Overview

All endpoints are under `/api/`. Auth uses JWT (`/auth/login/`, `/auth/refresh/`, `/auth/register/`); most viewsets currently allow unauthenticated access for demo purposes but accept a Bearer token when available.

| Domain | Endpoints |
|---|---|
| Org | `departments/`, `categories/`, `emission-factors/` |
| Environmental | `purchases/`, `manufacturing/`, `expenses/`, `fleet/`, `carbon-transactions/`, `environmental-scores/`, `environmental-goals/`, `product-esg/` |
| Social | `csr-activities/`, `participations/`, `diversity/`, `trainings/` |
| Governance | `policies/`, `audits/`, `compliance-issues/`, `acknowledgements/`, `notifications/` |
| Gamification | `challenges/`, `challenge-participations/`, `employee-profiles/`, `badges/`, `badge-awards/`, `rewards/`, `reward-redemptions/` |
| Scoring | `department-scores/`, `weight-config/`, `overall-scores/`, `system/dashboard/`, `system/calculate-scores/`, `system/export-report/`, `system/config/` |

## Demo Data

`python manage.py seed_esg` resets and repopulates the database with a consistent demo dataset (departments, users, policies, badges, rewards, challenges, audits, compliance issues) so that all users see the same data. Run it any time the dataset needs to be reset to a known baseline.

⚠️ This command deletes existing non-superuser data before reseeding — do not run it against data you want to keep.

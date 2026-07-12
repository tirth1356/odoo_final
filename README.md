# EcoSphere – ESG Intelligence Platform

An ESG (Environmental, Social, Governance) management platform that integrates sustainability tracking into daily ERP operations. The platform helps organizations monitor carbon emissions, manage CSR activities, track governance compliance, engage employees through gamification, and generate ESG reports.

---

## Tech Stack

### Backend
- Django 5
- Django REST Framework
- PostgreSQL
- SimpleJWT
- ReportLab
- OpenPyXL

### Frontend
- React 19
- Vite
- Tailwind CSS 4
- React Router
- Axios

---

## Features

### Environmental
- Emission Factor Management
- Carbon Transaction Tracking
- Automatic Emission Calculation
- Product ESG Profiles
- Sustainability Goals
- Department Carbon Tracking

### Social
- CSR Activities
- Employee Participation
- Diversity Metrics
- Training Completion
- Evidence Upload & Approval

### Governance
- ESG Policies
- Policy Acknowledgements
- Audits
- Compliance Issues
- Overdue Issue Tracking

### Gamification
- Sustainability Challenges
- XP & Points
- Badge Auto Unlock
- Reward Redemption
- Leaderboards

### Reports
- Environmental Report
- Social Report
- Governance Report
- ESG Summary Report
- Custom Report Builder
- Export as PDF, Excel and CSV

---

## Business Workflow

```
Master Data
│
├── Departments
├── Categories
├── Emission Factors
├── Products
├── ESG Goals
├── Policies
└── Challenges
        │
        ▼
ERP Operations
(Purchase • Manufacturing • Fleet • Expenses)
        │
        ▼
Carbon Transactions
Employee Participation
Challenge Participation
Policy Acknowledgements
Audits
Compliance Issues
        │
        ▼
Environmental + Social + Governance Scores
        │
        ▼
Department ESG Score
        │
        ▼
Overall ESG Dashboard & Reports
```

---

## Project Structure

```text
odoo_final/
├── backend/
│   ├── config/
│   ├── esg_api/
│   └── manage.py
└── frontend/
    └── src/
```

---

## Getting Started

### Backend

```bash
cd backend

pip install -r requirements.txt

python manage.py migrate
python manage.py seed_esg
python manage.py runserver
```

API runs at:

```
http://localhost:8000/api/
```

### Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## API Modules

| Module | Endpoints |
|---------|-----------|
| Organization | Departments, Categories |
| Environmental | Emission Factors, Carbon Transactions, Goals, Product ESG |
| Social | CSR Activities, Employee Participation, Diversity, Training |
| Governance | Policies, Audits, Compliance Issues, Policy Acknowledgements |
| Gamification | Challenges, Badges, Rewards, Leaderboards |
| Reports | ESG Reports, Report Builder |
| System | Dashboard, Score Calculation, Settings, Notifications |

---

## Demo Data

Run:

```bash
python manage.py seed_esg
```

This populates demo departments, employees, policies, challenges, badges, rewards, audits, compliance issues, and sample ESG data.
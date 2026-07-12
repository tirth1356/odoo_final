# 🌱 EcoSphere – ESG Intelligence Platform

A full-stack **Environmental, Social, and Governance (ESG)** management platform that integrates sustainability into everyday business operations. EcoSphere enables organizations to measure environmental impact, improve employee engagement, monitor governance compliance, and generate comprehensive ESG reports from a unified dashboard.

---

## 🚀 Tech Stack

### Backend

* Django 5
* Django REST Framework
* PostgreSQL
* SimpleJWT
* ReportLab
* OpenPyXL

### Frontend

* React 19
* Vite
* Tailwind CSS 4
* React Router
* Axios

---

## ✨ Features

### 🌍 Environmental

* Carbon emission tracking
* Emission factor management
* Automatic emission calculations
* Sustainability goals
* Department-wise environmental analytics
* Product ESG profiles

### 🤝 Social

* CSR activity management
* Employee participation tracking
* Proof-based approval workflow
* Diversity metrics
* Training completion tracking

### 🏛 Governance

* ESG policy management
* Policy acknowledgements
* Audit management
* Compliance issue tracking
* Overdue compliance detection

### 🏆 Gamification

* Sustainability challenges
* XP & points system
* Badge auto-unlock
* Reward redemption
* Department & employee leaderboards

### 📊 Reports

* Environmental Report
* Social Report
* Governance Report
* ESG Summary Report
* Custom Report Builder
* Export to **PDF**, **Excel**, and **CSV**

---
## 🌟 Bonus Features

* Department ESG rankings
* Interactive dashboards
* Mobile-responsive interface
* Custom report builder
* PDF, Excel, and CSV exports

---

## ⚙️ Core Business Workflow

```text
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
(Purchases • Manufacturing • Fleet • Expenses)
        │
        ▼
Carbon Transactions
Employee Participation
Policy Acknowledgements
Audits
Compliance Issues
        │
        ▼
Environmental Score
Social Score
Governance Score
        │
        ▼
Department ESG Score
        │
        ▼
Organization ESG Dashboard & Reports
```

---

## 📁 Project Structure

```text
odoo_final/
├── backend/
│   ├── config/
│   ├── esg_api/
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── seed_esg.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   └── manage.py
│
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        ├── App.jsx
        └── main.jsx
```

---

## 🔗 API Modules

| Module        | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| Organization  | Departments, Categories                                      |
| Environmental | Emission Factors, Carbon Transactions, Goals, Product ESG    |
| Social        | CSR Activities, Employee Participation, Diversity, Training  |
| Governance    | Policies, Audits, Compliance Issues, Policy Acknowledgements |
| Gamification  | Challenges, Badges, Rewards, Leaderboards                    |
| Reports       | ESG Reports & Custom Report Builder                          |
| System        | Dashboard, ESG Score Calculation, Settings, Notifications    |

---

## 🎯 Highlights

* ESG score calculation engine
* Configurable environmental, social, and governance weights
* Automated carbon emission calculations
* Configurable notification system
* Badge auto-awarding
* Reward redemption workflow
* Role-based JWT authentication
* Demo data seeding
* Responsive user interface


---

```

> **Note:** Running the seeder resets the existing demo data.

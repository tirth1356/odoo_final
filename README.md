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

## 🛠 Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd odoo_final
```

### Backend

```bash
cd backend

pip install -r requirements.txt

python manage.py migrate
python manage.py seed_esg
python manage.py runserver
```

Backend runs at:

```text
http://localhost:8000/api/
```

### Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
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

## 🌟 Bonus Features

* Department ESG rankings
* Interactive dashboards
* Mobile-responsive interface
* Custom report builder
* PDF, Excel, and CSV exports

---

## 🌱 Demo Data

Populate the application with sample departments, employees, ESG policies, challenges, badges, rewards, audits, compliance issues, and other demo data using:

```bash
python manage.py seed_esg
```

> **Note:** Running the seeder resets the existing demo data.

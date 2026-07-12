import random
from datetime import date, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from esg_api.models import (
    Department, Category, EmissionFactor, ProductESGProfile,
    EnvironmentalGoal, PurchaseRecord, FleetRecord, ManufacturingRecord, ExpenseRecord,
    OverallESGScore, DepartmentScore, CarbonTransaction,
    ESGPolicy, Audit, CSRActivity, EmployeeParticipation, DiversityMetrics,
    TrainingCompletion, EmployeeProfile, EnvironmentalScore, Challenge
)

class Command(BaseCommand):
    help = 'Seed database with comprehensive rich data for testing (50+ transactions, policies, audits, CSR points)'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting comprehensive database seeding...")
        today = date.today()

        self.stdout.write("Clearing old demo data...")
        EnvironmentalGoal.objects.all().delete()
        ProductESGProfile.objects.all().delete()
        ESGPolicy.objects.all().delete()
        DepartmentScore.objects.all().delete()
        OverallESGScore.objects.all().delete()
        EnvironmentalScore.objects.all().delete()
        Challenge.objects.all().delete()
        PurchaseRecord.objects.all().delete()
        FleetRecord.objects.all().delete()
        ManufacturingRecord.objects.all().delete()
        ExpenseRecord.objects.all().delete()
        CarbonTransaction.objects.all().delete()
        EmployeeParticipation.objects.all().delete()
        DiversityMetrics.objects.all().delete()
        TrainingCompletion.objects.all().delete()

        # 0. Base Categories
        cat_csr, _ = Category.objects.get_or_create(name="Community Service", type="CSR Activity")
        cat_exp, _ = Category.objects.get_or_create(name="General Expenses", type="CSR Activity") # Reused for expenses

        # 1. Master Data: Departments
        dept_data = [
            {"name": "Corporate HQ", "code": "HQ-01", "head": "Aarav Patel"},
            {"name": "Logistics & Fleet", "code": "LOG-01", "head": "Rajesh Sharma"},
            {"name": "Manufacturing Plant A", "code": "MFG-A", "head": "Priya Nair"},
            {"name": "Manufacturing Plant B", "code": "MFG-B", "head": "Vikram Malhotra"},
            {"name": "Research & Development", "code": "RND-01", "head": "Sneha Reddy"},
            {"name": "Sales & Marketing", "code": "SAL-01", "head": "Amit Verma"},
        ]
        departments = []
        for d in dept_data:
            dept, _ = Department.objects.get_or_create(
                code=d['code'],
                defaults={'name': d['name'], 'head': d['head'], 'employee_count': random.randint(20, 200)}
            )
            departments.append(dept)
        
        # 2. Master Data: Emission Factors
        factors_data = [
            {"name": "Grid Electricity", "carbon_value": "0.478", "unit": "kWh"},
            {"name": "Diesel Fuel", "carbon_value": "2.684", "unit": "Liters"},
            {"name": "Natural Gas", "carbon_value": "2.021", "unit": "m3"},
            {"name": "Recycled Paper", "carbon_value": "0.582", "unit": "kg"},
            {"name": "Air Travel", "carbon_value": "0.250", "unit": "km"},
        ]
        factors = []
        for f in factors_data:
            ef, _ = EmissionFactor.objects.get_or_create(
                name=f['name'],
                defaults={'carbon_value': Decimal(f['carbon_value']), 'unit': f['unit']}
            )
            factors.append(ef)

        # 3. Master Data: ESG Policies
        policies = [
            {"title": "Anti-Corruption & Bribery", "desc": "Zero tolerance for corruption."},
            {"title": "Supplier Code of Conduct", "desc": "Guidelines for ethical sourcing."},
            {"title": "Waste Reduction Initiative", "desc": "Mandatory recycling and e-waste procedures."}
        ]
        for p in policies:
            ESGPolicy.objects.get_or_create(title=p["title"], defaults={"description": p["desc"], "effective_date": today.replace(year=today.year-1)})

        prod, _ = ProductESGProfile.objects.get_or_create(name="EcoServer", product_code="ECO-01", defaults={"carbon_footprint": 150.0, "esg_score": 88.5})
        ProductESGProfile.objects.get_or_create(name="Quantum Laptop", product_code="QL-100", defaults={"carbon_footprint": 45.5, "esg_score": 92.0})
        ProductESGProfile.objects.get_or_create(name="Solar Panel V2", product_code="SP-200", defaults={"carbon_footprint": 200.0, "esg_score": 98.5})
        ProductESGProfile.objects.get_or_create(name="Recycled Packaging", product_code="RP-01", defaults={"carbon_footprint": 5.0, "esg_score": 99.0})

        EnvironmentalGoal.objects.get_or_create(name="Reduce Logistics Emissions by 10%", target_value=5000, deadline=today.replace(year=today.year+1))
        EnvironmentalGoal.objects.get_or_create(name="Zero Waste to Landfill", target_value=0, deadline=today.replace(year=today.year+2))
        EnvironmentalGoal.objects.get_or_create(name="100% Renewable Energy", target_value=100, deadline=today.replace(year=today.year+3))
        EnvironmentalGoal.objects.get_or_create(name="Reduce Water Usage by 20%", target_value=15000, deadline=today.replace(year=today.year+1))
        EnvironmentalGoal.objects.get_or_create(name="Carbon Neutral Operations", target_value=0, deadline=today.replace(year=today.year+5))
        self.stdout.write("Generating historical carbon transactions (reduced for speed)...")
        for i in range(15):
            random_date = today - timedelta(days=random.randint(1, 360))
            dept = random.choice(departments)
            record_type = random.choice(['purchase', 'fleet', 'manufacturing', 'expense'])
            
            if record_type == 'purchase':
                PurchaseRecord.objects.create(
                    department=dept, date=random_date, item_name=f"Bulk Supply #{i}",
                    amount=Decimal(random.randint(100, 5000)), emission_factor=factors[3], quantity=Decimal(random.randint(10, 500))
                )
            elif record_type == 'fleet':
                FleetRecord.objects.create(
                    department=dept, vehicle_id=f"VEH-{(i%5)+1}", distance_traveled=Decimal(random.randint(50, 1000)),
                    fuel_type="Diesel", emission_factor=factors[1]
                )
            elif record_type == 'manufacturing':
                ManufacturingRecord.objects.create(
                    department=dept, date=random_date, product=prod,
                    quantity=Decimal(random.randint(5, 50)), emission_factor=factors[0]
                )
            elif record_type == 'expense':
                ExpenseRecord.objects.create(
                    department=dept, date=random_date, category=cat_exp,
                    amount=Decimal(random.randint(500, 10000)), emission_factor=factors[4], quantity=Decimal(random.randint(1000, 5000))
                )

        # 6. Completed Audits
        Audit.objects.get_or_create(title="Q1 Comprehensive ESG Audit", date=today - timedelta(days=90), defaults={"scope": "All departments", "auditor": "Wipro ESG Auditing", "status": "Completed"})
        Audit.objects.get_or_create(title="Q2 Operations Audit", date=today - timedelta(days=15), defaults={"scope": "Logistics & Fleet", "auditor": "Internal Audit Team", "status": "Completed"})

        # 7. Employee CSR Points & Profiles
        users = []
        for i in range(5):
            username = f"employee{i}"
            user, _ = User.objects.get_or_create(username=username, defaults={"email": f"{username}@example.com"})
            user.set_password("password123")
            user.save()
            users.append(user)
            # Profile is auto-created by signal, just update it
            prof = EmployeeProfile.objects.filter(user=user).first()
            if prof:
                prof.points = random.randint(50, 500)
                prof.xp = prof.points * 2
                prof.department = random.choice(departments)
                prof.save()

        csr_act1, _ = CSRActivity.objects.get_or_create(title="Yamuna Cleaning Sewa", category=cat_csr, defaults={"description": "Clean the local river banks.", "points_earned": 50})
        csr_act2, _ = CSRActivity.objects.get_or_create(title="Tree Planting Drive", category=cat_csr, defaults={"description": "Plant 100 trees in the community.", "points_earned": 75, "xp_earned": 150})
        csr_act3, _ = CSRActivity.objects.get_or_create(title="Langar Kitchen Help", category=cat_csr, defaults={"description": "Help organize food drives & distribution.", "points_earned": 30, "xp_earned": 80})
        csr_act4, _ = CSRActivity.objects.get_or_create(title="E-Waste Collection", category=cat_csr, defaults={"description": "Collect old electronics for safe recycling.", "points_earned": 60, "xp_earned": 120})
        csr_act5, _ = CSRActivity.objects.get_or_create(title="Energy Saving Campaign", category=cat_csr, defaults={"description": "Promote energy saving practices in office.", "points_earned": 40, "xp_earned": 90})
        
        Challenge.objects.get_or_create(title="Bike to Work Month", category=cat_csr, deadline=today.replace(year=today.year+1), defaults={"description": "Commute by bike.", "xp": 200, "status": "Active"})
        Challenge.objects.get_or_create(title="Zero Plastic Week", category=cat_csr, deadline=today.replace(year=today.year+1), defaults={"description": "Avoid single-use plastic.", "xp": 150, "status": "Active"})
        Challenge.objects.get_or_create(title="Paperless Office Initiative", category=cat_csr, deadline=today.replace(year=today.year+1), defaults={"description": "Reduce paper printing by 50%.", "xp": 300, "status": "Active"})

        for u in users:
            EmployeeParticipation.objects.get_or_create(
                employee=u, csr_activity=csr_act1,
                defaults={"approval_status": "Approved", "points_earned": 50, "xp_earned": 100}
            )
            EmployeeParticipation.objects.get_or_create(
                employee=u, csr_activity=random.choice([csr_act2, csr_act3, csr_act4, csr_act5]),
                defaults={"approval_status": "Approved", "points_earned": 60, "xp_earned": 120}
            )
            TrainingCompletion.objects.get_or_create(
                employee=u, course_name="Anti-Corruption Basics", date_completed=today - timedelta(days=random.randint(10, 100)), duration_hours=2.0
            )

        # 8. Department Scores & Diversity Metrics (Populating the Dashboard)
        for dept in departments:
            # Monthly scores for the last 3 months
            for m in range(3):
                m_date = today.replace(day=1) - timedelta(days=30*m)
                DepartmentScore.objects.update_or_create(
                    department=dept, date=m_date,
                    defaults={
                        'environmental_score': Decimal(random.uniform(60.0, 95.0)),
                        'social_score': Decimal(random.uniform(60.0, 95.0)),
                        'governance_score': Decimal(random.uniform(60.0, 95.0)),
                        'total_score': Decimal(random.uniform(60.0, 95.0))
                    }
                )
            
            DiversityMetrics.objects.update_or_create(
                department=dept, date=today.replace(day=1),
                defaults={
                    'female_percentage': Decimal(random.uniform(30.0, 60.0)),
                    'minority_percentage': Decimal(random.uniform(15.0, 45.0)),
                    'total_employees': dept.employee_count
                }
            )

        # Overall Dashboard Data Baseline
        OverallESGScore.objects.update_or_create(
            date=today.replace(day=1),
            defaults={
                'environmental_score': Decimal('84.2'),
                'social_score': Decimal('79.5'),
                'governance_score': Decimal('89.1'),
                'total_score': Decimal('84.3')
            }
        )

        self.stdout.write(self.style.SUCCESS("Database seeded with lighter demo data successfully!"))


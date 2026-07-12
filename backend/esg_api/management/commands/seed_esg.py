import datetime
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from esg_api.models import (
    Department, Category, EmissionFactor, ProductESGProfile,
    EnvironmentalGoal, ESGPolicy, Badge, Reward,
    PurchaseRecord, ManufacturingRecord, ExpenseRecord, FleetRecord,
    CarbonTransaction, EnvironmentalScore, CSRActivity, EmployeeParticipation,
    DiversityMetrics, TrainingCompletion, PolicyAcknowledgement, Audit,
    ComplianceIssue, Notification, Challenge, ChallengeParticipation,
    EmployeeProfile, BadgeAward, RewardRedemption, DepartmentScore,
    OrganizationWeightConfig, OverallESGScore
)

class Command(BaseCommand):
    help = 'Seeds the database with initial ESG configuration and transactional data.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting database seeding...")

        # Clear existing data to allow re-seeding
        # Users & profiles (delete profiles dynamically since cascading)
        User.objects.exclude(is_superuser=True).delete()
        Department.objects.all().delete()
        # Delete anything that PROTECTs Category before deleting Category itself
        CSRActivity.objects.all().delete()
        Challenge.objects.all().delete()
        Category.objects.all().delete()
        EmissionFactor.objects.all().delete()
        ProductESGProfile.objects.all().delete()
        EnvironmentalGoal.objects.all().delete()
        ESGPolicy.objects.all().delete()
        Badge.objects.all().delete()
        Reward.objects.all().delete()
        Audit.objects.all().delete()
        Notification.objects.all().delete()
        OrganizationWeightConfig.objects.all().delete()
        DepartmentScore.objects.all().delete()
        OverallESGScore.objects.all().delete()

        # 1. Organization Weights
        OrganizationWeightConfig.objects.create(
            id=1,
            environmental_weight=Decimal('0.40'),
            social_weight=Decimal('0.30'),
            governance_weight=Decimal('0.30')
        )

        # 2. Departments
        ops = Department.objects.create(name="Operations", code="OPS", head="Alice Green", employee_count=120)
        rd = Department.objects.create(name="Research & Development", code="RD", head="Bob Bright", employee_count=45)
        logistics = Department.objects.create(name="Logistics", code="LOG", head="Charlie Drive", employee_count=60)
        sales = Department.objects.create(name="Sales & Marketing", code="SAL", head="Diana Pitch", employee_count=35)
        hr = Department.objects.create(name="Human Resources", code="HR", head="Emma Care", employee_count=15)

        # Sub-department
        mfg = Department.objects.create(
            name="Manufacturing Unit", 
            code="MFG", 
            head="Fred Forge", 
            parent_department=ops, 
            employee_count=80
        )

        # 3. Categories
        cat_travel = Category.objects.create(name="Business Travel", type="Challenge")
        cat_energy = Category.objects.create(name="Facility Energy", type="Challenge")
        cat_waste = Category.objects.create(name="Waste Management", type="Challenge")
        cat_csr_env = Category.objects.create(name="Eco volunteering", type="CSR Activity")
        cat_csr_soc = Category.objects.create(name="Community outreach", type="CSR Activity")

        # 4. Emission Factors
        ef_elec = EmissionFactor.objects.create(name="Grid Electricity", carbon_value=Decimal('0.825000'), unit="kWh")
        ef_petrol = EmissionFactor.objects.create(name="Petrol Fuel", carbon_value=Decimal('2.310000'), unit="Liters")
        ef_diesel = EmissionFactor.objects.create(name="Diesel Fuel", carbon_value=Decimal('2.680000'), unit="Liters")
        ef_flight = EmissionFactor.objects.create(name="Commercial Flight", carbon_value=Decimal('0.240000'), unit="Passenger km")
        ef_paper = EmissionFactor.objects.create(name="Recycled Paper Bundle", carbon_value=Decimal('0.550000'), unit="kg")

        # 5. Product ESG Profiles
        prod1 = ProductESGProfile.objects.create(name="Smart Thermostat X1", product_code="STX1", description="IoT controller for smart HVAC optimization", carbon_footprint=Decimal('12.40'), esg_score=Decimal('88.50'))
        prod2 = ProductESGProfile.objects.create(name="Li-Polymer Solar Pack", product_code="LSP2", description="High capacity energy harvesting unit", carbon_footprint=Decimal('42.10'), esg_score=Decimal('94.00'))
        prod3 = ProductESGProfile.objects.create(name="Standard Adapter v2", product_code="SAV2", description="Basic wall power outlet converter", carbon_footprint=Decimal('8.50'), esg_score=Decimal('62.50'))

        # 6. Environmental Goals
        today = datetime.date.today()
        month_end = (today.replace(day=28) + datetime.timedelta(days=4)).replace(day=1) - datetime.timedelta(days=1)
        EnvironmentalGoal.objects.create(name="Operations Carbon Cap (July 2026)", target_value=Decimal('8000.00'), current_value=Decimal('0.00'), deadline=month_end, status="Pending")
        EnvironmentalGoal.objects.create(name="Logistics Fuel Reduction", target_value=Decimal('5000.00'), current_value=Decimal('0.00'), deadline=month_end, status="Pending")

        # 7. ESG Policies
        policy1 = ESGPolicy.objects.create(title="Global Carbon Reduction Standard", description="All departments must reduce operational travel and use digital tools to limit paper waste.", effective_date=today - datetime.timedelta(days=90), version="1.0", status="Active")
        policy2 = ESGPolicy.objects.create(title="Diversity and Inclusion Charter", description="Promotes balanced hiring targets, female representation in senior leadership, and bias training.", effective_date=today - datetime.timedelta(days=60), version="1.2", status="Active")
        policy3 = ESGPolicy.objects.create(title="Ethical Supplier Governance Framework", description="Mandatory audit standards for raw material supply chains relating to labor rights.", effective_date=today - datetime.timedelta(days=30), version="2.0", status="Active")

        # 8. Badges
        badge_eco = Badge.objects.create(name="Eco Warrior", description="Acquire 150 total XP inside sustainability activities", unlock_rule="XP Threshold", unlock_threshold=150, icon="leaf")
        badge_csr = Badge.objects.create(name="Community Pillar", description="Successfully participate in 2 approved CSR activities", unlock_rule="CSR Count", unlock_threshold=2, icon="users")
        badge_ch = Badge.objects.create(name="Mission Specialist", description="Successfully complete 3 challenges in the workspace", unlock_rule="Challenge Count", unlock_threshold=3, icon="zap")

        # 9. Rewards
        Reward.objects.create(name="Eco Thermos Flask", description="BPA-free vacuum insulated stainless steel water flask.", points_required=60, stock=8, status="Active")
        Reward.objects.create(name="Carbon Offset Certificate", description="Sponsor the planting of 5 trees in regional reserves.", points_required=100, stock=100, status="Active")
        Reward.objects.create(name="Organic Tote Bag", description="Durable natural cotton canvas shopper bag.", points_required=30, stock=25, status="Active")

        # 10. Challenges
        ch1 = Challenge.objects.create(title="Bicycle Commute Week", category=cat_travel, description="Ride your bike or walk to work for 5 days consecutive. Log distance in km.", xp=100, difficulty="Medium", evidence_required=True, deadline=month_end, status="Active")
        ch2 = Challenge.objects.create(title="Meatless Mondays", category=cat_csr_env, description="Refrain from eating meat on Mondays to limit carbon footprint. Upload food diary.", xp=50, difficulty="Easy", evidence_required=False, deadline=month_end, status="Active")
        ch3 = Challenge.objects.create(title="Zero Single-Use Plastics", category=cat_waste, description="Use reusable mugs, bottles, and storage wraps at work. Keep active for 15 days.", xp=200, difficulty="Hard", evidence_required=True, deadline=month_end, status="Active")

        # 11. Users / Employees
        user_green = User.objects.create_user(username="johngreen", email="john.green@ecosphere.com", password="password123", first_name="John", last_name="Green")
        user_bright = User.objects.create_user(username="sarahbright", email="sarah.bright@ecosphere.com", password="password123", first_name="Sarah", last_name="Bright")
        user_drive = User.objects.create_user(username="davidloader", email="david.loader@ecosphere.com", password="password123", first_name="David", last_name="Loader")

        # Map users to departments on profiles
        prof_green = user_green.esg_profile
        prof_green.department = ops
        prof_green.points = 120
        prof_green.xp = 350
        prof_green.completed_challenges_count = 4
        prof_green.completed_csr_activities_count = 3
        prof_green.save()

        prof_bright = user_bright.esg_profile
        prof_bright.department = rd
        prof_bright.points = 40
        prof_bright.xp = 80
        prof_bright.save()

        prof_drive = user_drive.esg_profile
        prof_drive.department = logistics
        prof_drive.points = 150
        prof_drive.xp = 240
        prof_drive.save()

        # Award default badges to John Green
        BadgeAward.objects.create(employee=user_green, badge=badge_eco)
        BadgeAward.objects.create(employee=user_green, badge=badge_csr)

        # 12. CSR Activities
        csr1 = CSRActivity.objects.create(title="Local Beach Clean Up Day", category=cat_csr_env, description="Help clean municipal beach dunes. Proof photo required.", points_earned=40, xp_earned=100, evidence_required=True, status="Active")
        csr2 = CSRActivity.objects.create(title="Tech Mentorship Program", category=cat_csr_soc, description="Volunteer to mentor vocational students in coding.", points_earned=50, xp_earned=150, evidence_required=False, status="Active")

        # CSR Participations
        EmployeeParticipation.objects.create(employee=user_green, csr_activity=csr1, proof_description="Selfie on beach holding two trashbags.", approval_status="Approved", points_earned=40, xp_earned=100, completion_date=today - datetime.timedelta(days=10))
        EmployeeParticipation.objects.create(employee=user_green, csr_activity=csr2, proof_description="Coached 3 students on python syntax on Zoom.", approval_status="Approved", points_earned=50, xp_earned=150, completion_date=today - datetime.timedelta(days=5))
        EmployeeParticipation.objects.create(employee=user_bright, csr_activity=csr1, proof_description="Beach cleaning proof uploaded.", approval_status="Pending", completion_date=today)

        # Challenge Participations
        ChallengeParticipation.objects.create(challenge=ch1, employee=user_green, progress=Decimal('100.0'), proof_description="Strava cycling logs attached", approval_status="Approved", xp_awarded=100)
        ChallengeParticipation.objects.create(challenge=ch2, employee=user_drive, progress=Decimal('50.0'), proof_description="Meal photos log", approval_status="Pending")

        # 13. Policy Acknowledgements
        PolicyAcknowledgement.objects.create(employee=user_green, policy=policy1)
        PolicyAcknowledgement.objects.create(employee=user_green, policy=policy2)
        PolicyAcknowledgement.objects.create(employee=user_bright, policy=policy1)
        PolicyAcknowledgement.objects.create(employee=user_drive, policy=policy2)

        # 14. Diversity Metrics
        DiversityMetrics.objects.create(department=ops, date=today, female_percentage=Decimal('42.50'), minority_percentage=Decimal('18.00'), total_employees=120)
        DiversityMetrics.objects.create(department=rd, date=today, female_percentage=Decimal('48.00'), minority_percentage=Decimal('22.20'), total_employees=45)
        DiversityMetrics.objects.create(department=logistics, date=today, female_percentage=Decimal('25.00'), minority_percentage=Decimal('12.50'), total_employees=60)

        # 15. Training Completion
        TrainingCompletion.objects.create(employee=user_green, course_name="ESG Compliance Standards", date_completed=today - datetime.timedelta(days=20), duration_hours=Decimal('3.5'))
        TrainingCompletion.objects.create(employee=user_bright, course_name="Cybersecurity Safeguards", date_completed=today - datetime.timedelta(days=15), duration_hours=Decimal('2.0'))
        TrainingCompletion.objects.create(employee=user_drive, course_name="Green Logistics & Route Optimization", date_completed=today - datetime.timedelta(days=5), duration_hours=Decimal('5.0'))

        # 16. Audits & Compliance Issues
        audit1 = Audit.objects.create(title="H1 Carbon Footprint Verification", date=today - datetime.timedelta(days=45), scope="Reviewing vehicle logbooks and purchase orders.", auditor="Econergy Consultants", status="Completed")
        audit2 = Audit.objects.create(title="Q3 Supplier Ethical Standards", date=today, scope="Inspecting subcontractor worker age and payslip logs.", auditor="PWC Global", status="In Progress")

        # Open compliance issue
        ComplianceIssue.objects.create(
            audit=audit1,
            title="Logistics Diesel Invoices Missing",
            severity="Medium",
            description="Liters consumed not logged for vehicles LOG-042 and LOG-043 during May.",
            owner=user_drive,
            due_date=today + datetime.timedelta(days=14),
            status="Open"
        )

        # Flagged compliance issue (Overdue)
        ComplianceIssue.objects.create(
            audit=audit1,
            title="Hazardous Batteries Disposal Proof",
            severity="Critical",
            description="Required waste sorting certificates are missing for recycling battery batch MFG-988.",
            owner=user_green,
            due_date=today - datetime.timedelta(days=5), # 5 days overdue!
            status="Open" # Starts open, check_compliance_deadlines will flag it
        )

        # 17. Daily business operations transactional inputs
        # (This triggers post-save signal, automatically logging carbon transactions)
        
        # OPS Purchases
        PurchaseRecord.objects.create(department=ops, date=today - datetime.timedelta(days=12), item_name="Corporate Office Recycled Paper Cartons", amount=Decimal('450.00'), emission_factor=ef_paper, quantity=Decimal('30.00'))
        PurchaseRecord.objects.create(department=ops, date=today - datetime.timedelta(days=8), item_name="Business Laptops Travel Batteries", amount=Decimal('1200.00'), emission_factor=ef_paper, quantity=Decimal('5.00'))
        
        # MFG Manufacturing
        ManufacturingRecord.objects.create(department=mfg, date=today - datetime.timedelta(days=15), product=prod1, quantity=Decimal('250.00'), emission_factor=ef_elec)
        ManufacturingRecord.objects.create(department=mfg, date=today - datetime.timedelta(days=3), product=prod2, quantity=Decimal('100.00'), emission_factor=ef_elec)

        # EXPENSE Expenses
        ExpenseRecord.objects.create(department=rd, date=today - datetime.timedelta(days=22), category=cat_energy, amount=Decimal('1450.00'), emission_factor=ef_elec, quantity=Decimal('1750.00')) # kWh
        ExpenseRecord.objects.create(department=sales, date=today - datetime.timedelta(days=18), category=cat_travel, amount=Decimal('3200.00'), emission_factor=ef_flight, quantity=Decimal('13333.33')) # km flight

        # FLEET Fleet logs
        FleetRecord.objects.create(department=logistics, vehicle_id="LOG-001 (Truck)", distance_traveled=Decimal('1500.00'), fuel_type="Diesel", emission_factor=ef_diesel)
        FleetRecord.objects.create(department=logistics, vehicle_id="LOG-002 (Van)", distance_traveled=Decimal('950.00'), fuel_type="Petrol", emission_factor=ef_petrol)

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

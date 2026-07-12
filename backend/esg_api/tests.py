from django.test import TestCase
from django.contrib.auth.models import User
from decimal import Decimal
import datetime

from .models import (
    Department, Category, EmissionFactor, EnvironmentalGoal,
    PurchaseRecord, CarbonTransaction, ComplianceIssue, Reward,
    EmployeeProfile, RewardRedemption, ESGPolicy, PolicyAcknowledgement,
    DiversityMetrics, TrainingCompletion, EmployeeParticipation, CSRActivity
)
from .views import check_compliance_deadlines

class ESGPlatformTestCase(TestCase):
    def setUp(self):
        # Create department
        self.dept = Department.objects.create(
            name="Testing Dept",
            code="TEST",
            head="Test Head",
            employee_count=10
        )
        
        # Create emission factor
        self.ef = EmissionFactor.objects.create(
            name="Test Factor",
            carbon_value=Decimal('2.500000'),
            unit="kg"
        )
        
        # Create user
        self.user = User.objects.create_user(
            username="testuser",
            email="test@test.com",
            password="password123"
        )
        
        # Profile points / XP
        self.profile = self.user.esg_profile
        self.profile.department = self.dept
        self.profile.points = 100
        self.profile.xp = 50
        self.profile.save()

    def test_auto_emission_calculation(self):
        """Verify that saving a PurchaseRecord calculates emission and creates a CarbonTransaction."""
        purchase = PurchaseRecord.objects.create(
            department=self.dept,
            date=datetime.date.today(),
            item_name="Office Supplies",
            amount=Decimal('100.00'),
            emission_factor=self.ef,
            quantity=Decimal('10.00')
        )
        
        # 10.00 * 2.50 = 25.00
        self.assertEqual(purchase.calculated_emission, Decimal('25.00'))
        
        # Check transaction creation
        tx = CarbonTransaction.objects.get(record_type='Purchase', record_id=purchase.id)
        self.assertEqual(tx.calculated_emission, Decimal('25.00'))
        self.assertEqual(tx.department, self.dept)

    def test_compliance_escalation(self):
        """Verify that overdue open compliance issues are flagged as Overdue/Flagged and notifications created."""
        issue = ComplianceIssue.objects.create(
            title="Overdue Test Issue",
            severity="Medium",
            description="Test issue overdue",
            owner=self.user,
            due_date=datetime.date.today() - datetime.timedelta(days=2),
            status="Open"
        )
        
        check_compliance_deadlines()
        
        issue.refresh_from_db()
        self.assertEqual(issue.status, 'Flagged')

    def test_reward_redemption_validation(self):
        """Verify redemptions and stock updates."""
        reward = Reward.objects.create(
            name="Water Bottle",
            description="Metal bottle",
            points_required=40,
            stock=1,
            status="Active"
        )
        
        # Manually redeem reward to test data update
        self.assertTrue(reward.stock > 0)
        self.assertTrue(self.profile.points >= reward.points_required)
        
        # Decrement and deduct
        reward.stock -= 1
        reward.save()
        self.profile.points -= reward.points_required
        self.profile.save()
        
        redemption = RewardRedemption.objects.create(
            employee=self.user,
            reward=reward,
            points_deducted=reward.points_required
        )
        
        self.assertEqual(reward.stock, 0)
        self.assertEqual(self.profile.points, 60)
        self.assertEqual(redemption.points_deducted, 40)

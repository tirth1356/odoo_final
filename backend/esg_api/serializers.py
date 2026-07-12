from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Department, Category, EmissionFactor, ProductESGProfile,
    EnvironmentalGoal, ESGPolicy, Badge, Reward,
    PurchaseRecord, ManufacturingRecord, ExpenseRecord, FleetRecord,
    CarbonTransaction, EnvironmentalScore, CSRActivity, EmployeeParticipation,
    DiversityMetrics, TrainingCompletion, PolicyAcknowledgement, Audit,
    ComplianceIssue, Notification, Challenge, ChallengeParticipation,
    EmployeeProfile, BadgeAward, RewardRedemption, DepartmentScore,
    OrganizationWeightConfig, OverallESGScore
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class EmployeeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = EmployeeProfile
        fields = ['id', 'user', 'department', 'points', 'xp', 'completed_challenges_count', 'completed_csr_activities_count']

class DepartmentSerializer(serializers.ModelSerializer):
    parent_name = serializers.ReadOnlyField(source='parent_department.name')
    class Meta:
        model = Department
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class EmissionFactorSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmissionFactor
        fields = '__all__'

class ProductESGProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductESGProfile
        fields = '__all__'

class EnvironmentalGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentalGoal
        fields = '__all__'

class ESGPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = ESGPolicy
        fields = '__all__'

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'

class PurchaseRecordSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    emission_factor_name = serializers.ReadOnlyField(source='emission_factor.name')
    calculated_emission = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = PurchaseRecord
        fields = '__all__'

class ManufacturingRecordSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    product_name = serializers.ReadOnlyField(source='product.name')
    emission_factor_name = serializers.ReadOnlyField(source='emission_factor.name')
    calculated_emission = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = ManufacturingRecord
        fields = '__all__'

class ExpenseRecordSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    category_name = serializers.ReadOnlyField(source='category.name')
    emission_factor_name = serializers.ReadOnlyField(source='emission_factor.name')
    calculated_emission = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = ExpenseRecord
        fields = '__all__'

class FleetRecordSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    emission_factor_name = serializers.ReadOnlyField(source='emission_factor.name')
    calculated_emission = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = FleetRecord
        fields = '__all__'

class CarbonTransactionSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    emission_factor_name = serializers.ReadOnlyField(source='emission_factor.name')

    class Meta:
        model = CarbonTransaction
        fields = '__all__'

class EnvironmentalScoreSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = EnvironmentalScore
        fields = '__all__'

class CSRActivitySerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = CSRActivity
        fields = '__all__'

class EmployeeParticipationSerializer(serializers.ModelSerializer):
    employee_username = serializers.ReadOnlyField(source='employee.username')
    csr_activity_title = serializers.ReadOnlyField(source='csr_activity.title')

    class Meta:
        model = EmployeeParticipation
        fields = '__all__'

class DiversityMetricsSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = DiversityMetrics
        fields = '__all__'

class TrainingCompletionSerializer(serializers.ModelSerializer):
    employee_username = serializers.ReadOnlyField(source='employee.username')

    class Meta:
        model = TrainingCompletion
        fields = '__all__'

class PolicyAcknowledgementSerializer(serializers.ModelSerializer):
    employee_username = serializers.ReadOnlyField(source='employee.username')
    policy_title = serializers.ReadOnlyField(source='policy.title')

    class Meta:
        model = PolicyAcknowledgement
        fields = '__all__'

class AuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audit
        fields = '__all__'

class ComplianceIssueSerializer(serializers.ModelSerializer):
    audit_title = serializers.ReadOnlyField(source='audit.title')
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = ComplianceIssue
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class ChallengeSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Challenge
        fields = '__all__'

class ChallengeParticipationSerializer(serializers.ModelSerializer):
    challenge_title = serializers.ReadOnlyField(source='challenge.title')
    employee_username = serializers.ReadOnlyField(source='employee.username')

    class Meta:
        model = ChallengeParticipation
        fields = '__all__'

class BadgeAwardSerializer(serializers.ModelSerializer):
    employee_username = serializers.ReadOnlyField(source='employee.username')
    badge_name = serializers.ReadOnlyField(source='badge.name')
    badge_icon = serializers.ReadOnlyField(source='badge.icon')

    class Meta:
        model = BadgeAward
        fields = '__all__'

class RewardRedemptionSerializer(serializers.ModelSerializer):
    employee_username = serializers.ReadOnlyField(source='employee.username')
    reward_name = serializers.ReadOnlyField(source='reward.name')

    class Meta:
        model = RewardRedemption
        fields = '__all__'

class DepartmentScoreSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = DepartmentScore
        fields = '__all__'

class OrganizationWeightConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationWeightConfig
        fields = '__all__'

class OverallESGScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = OverallESGScore
        fields = '__all__'

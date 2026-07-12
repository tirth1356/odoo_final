from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, CategoryViewSet, EmissionFactorViewSet, ProductESGProfileViewSet,
    EnvironmentalGoalViewSet, ESGPolicyViewSet, BadgeViewSet, RewardViewSet,
    PurchaseRecordViewSet, ManufacturingRecordViewSet, ExpenseRecordViewSet, FleetRecordViewSet,
    CarbonTransactionViewSet, EnvironmentalScoreViewSet, CSRActivityViewSet,
    EmployeeParticipationViewSet, DiversityMetricsViewSet, TrainingCompletionViewSet,
    PolicyAcknowledgementViewSet, AuditViewSet, ComplianceIssueViewSet, NotificationViewSet,
    ChallengeViewSet, ChallengeParticipationViewSet, EmployeeProfileViewSet,
    BadgeAwardViewSet, RewardRedemptionViewSet, DepartmentScoreViewSet,
    OrganizationWeightConfigViewSet, OverallESGScoreViewSet, ESGSystemViewSet,
    UserRegistrationView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'emission-factors', EmissionFactorViewSet, basename='emission-factor')
router.register(r'product-esg', ProductESGProfileViewSet, basename='product-esg')
router.register(r'environmental-goals', EnvironmentalGoalViewSet, basename='environmental-goal')
router.register(r'policies', ESGPolicyViewSet, basename='policy')
router.register(r'badges', BadgeViewSet, basename='badge')
router.register(r'rewards', RewardViewSet, basename='reward')

router.register(r'purchases', PurchaseRecordViewSet, basename='purchase')
router.register(r'manufacturing', ManufacturingRecordViewSet, basename='manufacturing')
router.register(r'expenses', ExpenseRecordViewSet, basename='expense')
router.register(r'fleet', FleetRecordViewSet, basename='fleet')

router.register(r'carbon-transactions', CarbonTransactionViewSet, basename='carbon-transaction')
router.register(r'environmental-scores', EnvironmentalScoreViewSet, basename='environmental-score')

router.register(r'csr-activities', CSRActivityViewSet, basename='csr-activity')
router.register(r'participations', EmployeeParticipationViewSet, basename='participation')
router.register(r'diversity', DiversityMetricsViewSet, basename='diversity')
router.register(r'trainings', TrainingCompletionViewSet, basename='training')

router.register(r'acknowledgements', PolicyAcknowledgementViewSet, basename='acknowledgement')
router.register(r'audits', AuditViewSet, basename='audit')
router.register(r'compliance-issues', ComplianceIssueViewSet, basename='compliance-issue')
router.register(r'notifications', NotificationViewSet, basename='notification')

router.register(r'challenges', ChallengeViewSet, basename='challenge')
router.register(r'challenge-participations', ChallengeParticipationViewSet, basename='challenge-participation')
router.register(r'employee-profiles', EmployeeProfileViewSet, basename='employee-profile')
router.register(r'badge-awards', BadgeAwardViewSet, basename='badge-award')
router.register(r'reward-redemptions', RewardRedemptionViewSet, basename='reward-redemption')

router.register(r'department-scores', DepartmentScoreViewSet, basename='department-score')
router.register(r'weight-config', OrganizationWeightConfigViewSet, basename='weight-config')
router.register(r'overall-scores', OverallESGScoreViewSet, basename='overall-score')
router.register(r'system', ESGSystemViewSet, basename='system')

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', UserRegistrationView.as_view(), name='user_register'),
    path('', include(router.urls)),
]

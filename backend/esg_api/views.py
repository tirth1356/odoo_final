import datetime
import csv
from decimal import Decimal
from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Sum, Avg, Q
from django.utils import timezone
from django.http import HttpResponse, StreamingHttpResponse
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny

from .serializers import UserRegistrationSerializer

from .models import (
    Department, Category, EmissionFactor, ProductESGProfile,
    EnvironmentalGoal, ESGPolicy, Badge, Reward,
    PurchaseRecord, ManufacturingRecord, ExpenseRecord, FleetRecord,
    CarbonTransaction, EnvironmentalScore, CSRActivity, EmployeeParticipation,
    DiversityMetrics, TrainingCompletion, PolicyAcknowledgement, Audit,
    ComplianceIssue, Notification, Challenge, ChallengeParticipation,
    EmployeeProfile, BadgeAward, RewardRedemption, DepartmentScore,
    OrganizationWeightConfig, OverallESGScore, SystemConfig
)

from .serializers import (
    DepartmentSerializer, CategorySerializer, EmissionFactorSerializer,
    ProductESGProfileSerializer, EnvironmentalGoalSerializer, ESGPolicySerializer,
    BadgeSerializer, RewardSerializer, PurchaseRecordSerializer,
    ManufacturingRecordSerializer, ExpenseRecordSerializer, FleetRecordSerializer,
    CarbonTransactionSerializer, EnvironmentalScoreSerializer, CSRActivitySerializer,
    EmployeeParticipationSerializer, DiversityMetricsSerializer,
    TrainingCompletionSerializer, PolicyAcknowledgementSerializer, AuditSerializer,
    ComplianceIssueSerializer, NotificationSerializer, ChallengeSerializer,
    ChallengeParticipationSerializer, EmployeeProfileSerializer, BadgeAwardSerializer,
    RewardRedemptionSerializer, DepartmentScoreSerializer,
    OrganizationWeightConfigSerializer, OverallESGScoreSerializer,
    SystemConfigSerializer
)

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

# Helper function to check and flag compliance issues
def check_compliance_deadlines():
    config = SystemConfig.get_solo()
    today = datetime.date.today()
    overdue_issues = list(ComplianceIssue.objects.filter(
        due_date__lt=today,
        status='Open'
    ).select_related('owner'))
    
    if not overdue_issues:
        return

    # Bulk update status to Flagged
    ComplianceIssue.objects.filter(id__in=[issue.id for issue in overdue_issues]).update(status='Flagged')

    if config.notify_new_compliance:
        notifications_to_create = []
        for issue in overdue_issues:
            msg = f"CRITICAL WARNING: Compliance issue '{issue.title}' is overdue! Status set to Flagged."
            # Avoid duplicate notification if it already exists
            if not Notification.objects.filter(user=issue.owner, message=msg).exists():
                notifications_to_create.append(Notification(user=issue.owner, message=msg, is_read=False))
        if notifications_to_create:
            Notification.objects.bulk_create(notifications_to_create)



def check_policy_reminders():
    config = SystemConfig.get_solo()
    if not config.notify_policy_reminders:
        return
    active_policies = ESGPolicy.objects.filter(status='Active')
    for policy in active_policies:
        acked_user_ids = PolicyAcknowledgement.objects.filter(
            policy=policy
        ).values_list('employee_id', flat=True)
        pending_users = User.objects.filter(is_superuser=False).exclude(id__in=acked_user_ids)
        for user in pending_users:
            Notification.objects.get_or_create(
                user=user,
                message=f"Reminder: Please acknowledge policy '{policy.title}'.",
                defaults={'is_read': False}
            )


def send_notification(user, message, enabled=True):
    if enabled:
        Notification.objects.create(user=user, message=message)


# Helper function to check and auto-unlock badges
def check_badge_unlocks(user):
    config = SystemConfig.get_solo()
    if not config.badge_auto_award:
        return

    profile = user.esg_profile
    badges = Badge.objects.all()
    
    for badge in badges:
        if BadgeAward.objects.filter(employee=user, badge=badge).exists():
            continue
            
        unlocked = False
        if badge.unlock_rule == 'XP Threshold':
            if profile.xp >= badge.unlock_threshold:
                unlocked = True
        elif badge.unlock_rule == 'CSR Count':
            if profile.completed_csr_activities_count >= badge.unlock_threshold:
                unlocked = True
        elif badge.unlock_rule == 'Challenge Count':
            if profile.completed_challenges_count >= badge.unlock_threshold:
                unlocked = True
                
        if unlocked:
            BadgeAward.objects.create(employee=user, badge=badge)
            send_notification(
                user,
                f"CONGRATULATIONS! You have unlocked the '{badge.name}' badge!",
                config.notify_badge_unlocks
            )

# ==========================================
# API Viewsets
# ==========================================

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class EmissionFactorViewSet(viewsets.ModelViewSet):
    queryset = EmissionFactor.objects.all()
    serializer_class = EmissionFactorSerializer

class ProductESGProfileViewSet(viewsets.ModelViewSet):
    queryset = ProductESGProfile.objects.all()
    serializer_class = ProductESGProfileSerializer

class EnvironmentalGoalViewSet(viewsets.ModelViewSet):
    queryset = EnvironmentalGoal.objects.all()
    serializer_class = EnvironmentalGoalSerializer

class ESGPolicyViewSet(viewsets.ModelViewSet):
    queryset = ESGPolicy.objects.all()
    serializer_class = ESGPolicySerializer

class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer

class RewardViewSet(viewsets.ModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer

# Operations
class PurchaseRecordViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRecord.objects.all()
    serializer_class = PurchaseRecordSerializer

class ManufacturingRecordViewSet(viewsets.ModelViewSet):
    queryset = ManufacturingRecord.objects.all()
    serializer_class = ManufacturingRecordSerializer

class ExpenseRecordViewSet(viewsets.ModelViewSet):
    queryset = ExpenseRecord.objects.all()
    serializer_class = ExpenseRecordSerializer

class FleetRecordViewSet(viewsets.ModelViewSet):
    queryset = FleetRecord.objects.all()
    serializer_class = FleetRecordSerializer

# Transactions
class CarbonTransactionViewSet(viewsets.ModelViewSet):
    queryset = CarbonTransaction.objects.all()
    serializer_class = CarbonTransactionSerializer

class EnvironmentalScoreViewSet(viewsets.ModelViewSet):
    queryset = EnvironmentalScore.objects.all()
    serializer_class = EnvironmentalScoreSerializer

# Social
class CSRActivityViewSet(viewsets.ModelViewSet):
    queryset = CSRActivity.objects.all()
    serializer_class = CSRActivitySerializer

class EmployeeParticipationViewSet(viewsets.ModelViewSet):
    queryset = EmployeeParticipation.objects.all()
    serializer_class = EmployeeParticipationSerializer

    def _validate_evidence_for_approval(self, approval_status, proof_description, proof_file_url):
        config = SystemConfig.get_solo()
        if approval_status == 'Approved' and config.evidence_requirement:
            if not proof_description and not proof_file_url:
                raise ValidationError(
                    "Evidence is required to approve CSR participation. "
                    "Please attach a proof file or description."
                )

    def perform_create(self, serializer):
        data = serializer.validated_data
        self._validate_evidence_for_approval(
            data.get('approval_status', 'Pending'),
            data.get('proof_description'),
            data.get('proof_file_url'),
        )
        participation = serializer.save()
        if participation.approval_status == 'Approved':
            self.apply_csr_rewards(participation)

    def perform_update(self, serializer):
        old_status = self.get_object().approval_status
        instance = self.get_object()
        data = serializer.validated_data
        new_status = data.get('approval_status', old_status)
        self._validate_evidence_for_approval(
            new_status,
            data.get('proof_description', instance.proof_description),
            data.get('proof_file_url', instance.proof_file_url),
        )
        participation = serializer.save()
        
        if old_status != 'Approved' and participation.approval_status == 'Approved':
            self.apply_csr_rewards(participation)

    def apply_csr_rewards(self, participation):
        activity = participation.csr_activity
        employee = participation.employee
        profile = employee.esg_profile
        config = SystemConfig.get_solo()
        
        participation.points_earned = activity.points_earned
        participation.xp_earned = activity.xp_earned
        participation.save()
        
        profile.points += activity.points_earned
        profile.xp += activity.xp_earned
        profile.completed_csr_activities_count += 1
        profile.save()
        
        send_notification(
            employee,
            f"Your participation in CSR '{activity.title}' was approved! "
            f"Earned {activity.points_earned} points and {activity.xp_earned} XP.",
            config.notify_csr_approval
        )
        
        check_badge_unlocks(employee)

class DiversityMetricsViewSet(viewsets.ModelViewSet):
    queryset = DiversityMetrics.objects.all()
    serializer_class = DiversityMetricsSerializer

class TrainingCompletionViewSet(viewsets.ModelViewSet):
    queryset = TrainingCompletion.objects.all()
    serializer_class = TrainingCompletionSerializer

# Governance
class PolicyAcknowledgementViewSet(viewsets.ModelViewSet):
    queryset = PolicyAcknowledgement.objects.all()
    serializer_class = PolicyAcknowledgementSerializer

class AuditViewSet(viewsets.ModelViewSet):
    queryset = Audit.objects.all()
    serializer_class = AuditSerializer

class ComplianceIssueViewSet(viewsets.ModelViewSet):
    queryset = ComplianceIssue.objects.all()
    serializer_class = ComplianceIssueSerializer

    def perform_create(self, serializer):
        if not serializer.validated_data.get('owner'):
            raise ValidationError("Every compliance issue must have an assigned owner.")
        if not serializer.validated_data.get('due_date'):
            raise ValidationError("Every compliance issue must have a due date.")
        issue = serializer.save()
        config = SystemConfig.get_solo()
        send_notification(
            issue.owner,
            f"New compliance issue assigned: '{issue.title}'. Due: {issue.due_date}.",
            config.notify_new_compliance
        )

    def list(self, request, *args, **kwargs):
        check_compliance_deadlines()
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        check_compliance_deadlines()
        return super().retrieve(request, *args, **kwargs)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

# Gamification
class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer

class ChallengeParticipationViewSet(viewsets.ModelViewSet):
    queryset = ChallengeParticipation.objects.all()
    serializer_class = ChallengeParticipationSerializer

    def perform_create(self, serializer):
        participation = serializer.save()
        if participation.approval_status == 'Approved':
            self.apply_challenge_rewards(participation)

    def perform_update(self, serializer):
        old_status = self.get_object().approval_status
        participation = serializer.save()
        new_status = participation.approval_status
        
        if old_status != 'Approved' and new_status == 'Approved':
            self.apply_challenge_rewards(participation)

    def apply_challenge_rewards(self, participation):
        challenge = participation.challenge
        employee = participation.employee
        profile = employee.esg_profile
        config = SystemConfig.get_solo()
        
        participation.xp_awarded = challenge.xp
        participation.save()
        
        profile.xp += challenge.xp
        profile.completed_challenges_count += 1
        profile.save()
        
        send_notification(
            employee,
            f"Challenge '{challenge.title}' approved! Earned {challenge.xp} XP.",
            config.notify_csr_approval
        )
        
        check_badge_unlocks(employee)

class EmployeeProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer

    @action(detail=False, methods=['get'])
    def current(self, request):
        # Always return the main company-wide seeded profile so all users see the same data
        user = User.objects.filter(username='employee0').first() or User.objects.filter(is_superuser=False).first() or User.objects.first()
        if not user:
            return Response({"error": "No user available"}, status=status.HTTP_404_NOT_FOUND)
        profile, _ = EmployeeProfile.objects.get_or_create(user=user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

class BadgeAwardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BadgeAward.objects.all()
    serializer_class = BadgeAwardSerializer

class RewardRedemptionViewSet(viewsets.ModelViewSet):
    queryset = RewardRedemption.objects.all()
    serializer_class = RewardRedemptionSerializer

    def create(self, request, *args, **kwargs):
        reward_id = request.data.get('reward')
        # Fallback to first user if request.user is anonymous for dev convenience
        user = request.user if request.user.is_authenticated else User.objects.first()
        
        if not user:
            raise ValidationError("Authentication required to redeem rewards.")
            
        try:
            reward = Reward.objects.get(id=reward_id)
        except Reward.DoesNotExist:
            raise ValidationError("Reward does not exist.")
            
        # 1. Check Stock
        if reward.stock <= 0:
            raise ValidationError(f"Insufficient stock for reward: {reward.name}")
            
        profile = user.esg_profile
        # 2. Check Points
        if profile.points < reward.points_required:
            raise ValidationError(f"Insufficient points. Need {reward.points_required}, but only have {profile.points}.")
            
        # 3. Process Redemption
        reward.stock -= 1
        reward.save()
        
        profile.points -= reward.points_required
        profile.save()
        
        redemption = RewardRedemption.objects.create(
            employee=user,
            reward=reward,
            points_deducted=reward.points_required
        )
        
        Notification.objects.create(
            user=user,
            message=f"Successfully redeemed '{reward.name}'! {reward.points_required} points deducted."
        )
        
        serializer = self.get_serializer(redemption)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DepartmentScoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DepartmentScore.objects.all()
    serializer_class = DepartmentScoreSerializer

class OrganizationWeightConfigViewSet(viewsets.ModelViewSet):
    queryset = OrganizationWeightConfig.objects.all()
    serializer_class = OrganizationWeightConfigSerializer

class OverallESGScoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OverallESGScore.objects.all()
    serializer_class = OverallESGScoreSerializer

# ==========================================
# Custom Endpoints: Calculations, Dashboards, Reports
# ==========================================

class ESGSystemViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['post'], url_path='calculate-scores')
    def calculate_scores(self, request):
        today = datetime.date.today()
        month_start = today.replace(day=1)
        
        # Check and flag overdue compliance
        check_compliance_deadlines()
        check_policy_reminders()
        
        # Fetch organization weights
        weights_config, _ = OrganizationWeightConfig.objects.get_or_create(
            id=1,
            defaults={
                'environmental_weight': Decimal('0.40'),
                'social_weight': Decimal('0.30'),
                'governance_weight': Decimal('0.30')
            }
        )
        
        departments = Department.objects.all()
        if not departments.exists():
            return Response({"error": "No departments configured"}, status=status.HTTP_400_BAD_REQUEST)
            
        overall_env_sum = Decimal('0.0')
        overall_soc_sum = Decimal('0.0')
        overall_gov_sum = Decimal('0.0')
        dept_count = departments.count()
        
        for dept in departments:
            # 1. Environmental Score (based on carbon emissions vs target goal)
            # Find carbon goal for department
            env_goal = EnvironmentalGoal.objects.filter(
                deadline__gte=month_start,
                status='Pending'
            ).first()
            target_limit = Decimal('5000.0') # Default base target
            if env_goal:
                target_limit = env_goal.target_value
                
            actual_emissions = CarbonTransaction.objects.filter(
                department=dept,
                date__gte=month_start
            ).aggregate(total=Sum('calculated_emission'))['total'] or Decimal('0.0')
            
            # If emissions exceed target, score drops. If 0 emissions, 100 score.
            if actual_emissions == 0:
                env_score = Decimal('100.0')
            else:
                ratio = actual_emissions / target_limit
                env_score = max(Decimal('0.0'), min(Decimal('100.0'), Decimal('100.0') - (ratio - 1) * 50 if ratio > 1 else Decimal('100.0')))
            
            # Save actual emission count back to EnvironmentalScore table
            target_met_pct = min(Decimal('100.0'), (target_limit / actual_emissions * 100) if actual_emissions > 0 else Decimal('100.0'))
            EnvironmentalScore.objects.update_or_create(
                department=dept,
                date=month_start,
                defaults={
                    'score': env_score,
                    'carbon_emissions': actual_emissions,
                    'target_met_percentage': target_met_pct
                }
            )

            # Update goal progress
            if env_goal:
                env_goal.current_value = actual_emissions
                if actual_emissions <= env_goal.target_value and today >= env_goal.deadline:
                    env_goal.status = 'Achieved'
                elif actual_emissions > env_goal.target_value and today >= env_goal.deadline:
                    env_goal.status = 'Failed'
                env_goal.save()
            
            # 2. Social Score
            # approved CSR participations count for employees of this department
            users_in_dept = User.objects.filter(esg_profile__department=dept)
            approved_csr_count = EmployeeParticipation.objects.filter(
                employee__in=users_in_dept,
                approval_status='Approved'
            ).count()
            
            # average training hours
            avg_training_hours = TrainingCompletion.objects.filter(
                employee__in=users_in_dept
            ).aggregate(avg_hours=Avg('duration_hours'))['avg_hours'] or 0
            
            # Diversity Metrics
            diversity_record = DiversityMetrics.objects.filter(department=dept).order_by('-date').first()
            
            div_score = Decimal('70.0') # default
            if diversity_record:
                # Target: 50% female, 20% minority
                fem_diff = abs(Decimal('50.0') - diversity_record.female_percentage)
                min_diff = abs(Decimal('20.0') - diversity_record.minority_percentage)
                div_score = max(Decimal('0.0'), Decimal('100.0') - (fem_diff * Decimal('1.5')) - (min_diff * Decimal('1.5')))
                
            csr_contribution = min(Decimal('40.0'), Decimal(approved_csr_count) * Decimal('10.0'))
            training_contribution = min(Decimal('30.0'), Decimal(avg_training_hours) * Decimal('3.0'))
            div_contribution = div_score * Decimal('0.3')
            
            social_score = csr_contribution + training_contribution + div_contribution
            
            # 3. Governance Score
            # Acknowledgement rate for active policies
            active_policies = ESGPolicy.objects.filter(status='Active')
            total_possible_acks = active_policies.count() * max(1, users_in_dept.count())
            actual_acks = PolicyAcknowledgement.objects.filter(
                employee__in=users_in_dept,
                policy__in=active_policies
            ).count()
            
            ack_rate = Decimal(actual_acks) / Decimal(total_possible_acks) if total_possible_acks > 0 else Decimal('1.0')
            
            # Compliance issues penalty
            open_issues_count = ComplianceIssue.objects.filter(owner__in=users_in_dept, status='Open').count()
            flagged_issues_count = ComplianceIssue.objects.filter(owner__in=users_in_dept, status='Flagged').count()
            
            gov_score = max(Decimal('0.0'), (ack_rate * Decimal('50.0')) + Decimal('50.0') - (Decimal(open_issues_count) * Decimal('10.0')) - (Decimal(flagged_issues_count) * Decimal('25.0')))
            
            # 4. Total Score calculation
            total_score = (
                (env_score * weights_config.environmental_weight) +
                (social_score * weights_config.social_weight) +
                (gov_score * weights_config.governance_weight)
            )
            
            DepartmentScore.objects.update_or_create(
                department=dept,
                date=month_start,
                defaults={
                    'environmental_score': env_score,
                    'social_score': social_score,
                    'governance_score': gov_score,
                    'total_score': total_score
                }
            )
            
            overall_env_sum += env_score
            overall_soc_sum += social_score
            overall_gov_sum += gov_score

        # Calculate Organization Overall Scores
        overall_env = overall_env_sum / dept_count if dept_count > 0 else Decimal('85.0')
        overall_soc = overall_soc_sum / dept_count if dept_count > 0 else Decimal('75.0')
        overall_gov = overall_gov_sum / dept_count if dept_count > 0 else Decimal('80.0')
        
        overall_total = (
            (overall_env * weights_config.environmental_weight) +
            (overall_soc * weights_config.social_weight) +
            (overall_gov * weights_config.governance_weight)
        )
        
        OverallESGScore.objects.update_or_create(
            date=month_start,
            defaults={
                'environmental_score': overall_env,
                'social_score': overall_soc,
                'governance_score': overall_gov,
                'total_score': overall_total
            }
        )
        
        return Response({
            "message": "Scores calculated successfully",
            "overall_esg_score": {
                "environmental": overall_env,
                "social": overall_soc,
                "governance": overall_gov,
                "total": overall_total
            }
        })

    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request):
        today = timezone.now().date()
        
        # Lightweight overdue check only — no full score recalculation
        check_compliance_deadlines()
        
        overall_score = OverallESGScore.objects.order_by('-date').first()
        overall_data = OverallESGScoreSerializer(overall_score).data if overall_score else {
            "environmental_score": 85.0, "social_score": 75.0, "governance_score": 80.0, "total_score": 80.0
        }
        
        latest_score_date = DepartmentScore.objects.order_by('-date').values_list('date', flat=True).first()
        if latest_score_date:
            dept_scores = DepartmentScore.objects.filter(date=latest_score_date).order_by('-total_score')
        else:
            dept_scores = DepartmentScore.objects.none()
        rankings = DepartmentScoreSerializer(dept_scores, many=True).data
        
        six_months_ago = today - datetime.timedelta(days=180)
        transactions = CarbonTransaction.objects.filter(date__gte=six_months_ago)
        
        trend_data = {}
        for tx in transactions:
            m_key = tx.date.strftime('%Y-%m')
            trend_data[m_key] = trend_data.get(m_key, Decimal('0.0')) + tx.calculated_emission
            
        trend_list = [{"month": k, "emissions": float(v)} for k, v in sorted(trend_data.items())]
        
        profiles = EmployeeProfile.objects.order_by('-xp')[:5]
        leaderboard = EmployeeProfileSerializer(profiles, many=True).data
        
        user = request.user if request.user.is_authenticated else None
        if not user:
            user = User.objects.filter(username='employee0').first() or User.objects.filter(is_superuser=False).first() or User.objects.first()
        notifications = []
        if user:
            notifications = NotificationSerializer(
                Notification.objects.filter(user=user, is_read=False).order_by('-created_at')[:5],
                many=True
            ).data
            
        return Response({
            "overall": overall_data,
            "rankings": rankings,
            "trend": trend_list,
            "leaderboard": leaderboard,
            "notifications": notifications
        })

    @action(detail=False, methods=['get', 'patch'], url_path='config')
    def config(self, request):
        cfg = SystemConfig.get_solo()
        if request.method == 'PATCH':
            serializer = SystemConfigSerializer(cfg, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        return Response(SystemConfigSerializer(cfg).data)

    @action(detail=False, methods=['get'], url_path='export-report')
    def export_report(self, request):
        # Filters
        dept_id = request.query_params.get('department')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        module = request.query_params.get('module') # environmental, social, governance
        export_format = request.query_params.get('export_format', 'csv') # csv, excel, pdf
        
        filters = Q()
        if dept_id:
            filters &= Q(department_id=dept_id)
        if start_date:
            filters &= Q(date__gte=start_date)
        if end_date:
            filters &= Q(date__lte=end_date)
            
        # Gather data based on Module
        data_rows = []
        filename = f"esg_report_{timezone.now().date()}"
        
        if module == 'environmental' or not module:
            txs = CarbonTransaction.objects.filter(filters)
            headers = ['Department', 'Record Type', 'Emission Factor', 'Quantity', 'Calculated Emission (kg CO2)']
            for tx in txs:
                data_rows.append([
                    tx.department.name,
                    tx.record_type,
                    tx.emission_factor.name if tx.emission_factor else 'N/A',
                    tx.quantity,
                    tx.calculated_emission
                ])
        elif module == 'social':
            headers = ['Employee', 'Activity/Course', 'Type', 'Points/Hours', 'Status']
            participations = EmployeeParticipation.objects.all()
            for p in participations:
                data_rows.append([
                    p.employee.username,
                    p.csr_activity.title,
                    'CSR Activity',
                    p.points_earned,
                    p.approval_status
                ])
            trainings = TrainingCompletion.objects.all()
            for t in trainings:
                data_rows.append([
                    t.employee.username,
                    t.course_name,
                    'Training',
                    t.duration_hours,
                    'Completed'
                ])
        elif module == 'governance':
            if export_format in ['csv', 'excel']:
                headers = ['Title', 'Audit', 'Severity', 'Owner', 'Status']
                issues = ComplianceIssue.objects.all()
                for i in issues:
                    data_rows.append([
                        i.title,
                        i.audit.title if i.audit else 'Independent',
                        i.severity,
                        i.owner.username,
                        i.status
                    ])
            else:
                headers = ['Title', 'Audit', 'Severity', 'Owner', 'Due Date', 'Status']
                issues = ComplianceIssue.objects.all()
                for i in issues:
                    data_rows.append([
                        i.title,
                        i.audit.title if i.audit else 'Independent',
                        i.severity,
                        i.owner.username,
                        i.due_date,
                        i.status
                    ])
                
        # Return format check
        if export_format in ['csv', 'excel']:
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="{filename}.csv"'
            writer = csv.writer(response)
            writer.writerow(headers)
            for row in data_rows:
                writer.writerow(row)
            return response
        else:
            # Generate PDF using ReportLab
            import io
            from reportlab.lib import colors
            from reportlab.lib.pagesizes import letter, landscape
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.pdfgen import canvas
            
            class NumberedCanvas(canvas.Canvas):
                def __init__(self, *args, **kwargs):
                    super(NumberedCanvas, self).__init__(*args, **kwargs)
                    self._saved_page_states = []
                def showPage(self):
                    self._saved_page_states.append(dict(self.__dict__))
                    self._startPage()
                def save(self):
                    num_pages = len(self._saved_page_states)
                    for state in self._saved_page_states:
                        self.__dict__.update(state)
                        self.draw_page_number(num_pages)
                        canvas.Canvas.showPage(self)
                    canvas.Canvas.save(self)
                def draw_page_number(self, page_count):
                    self.saveState()
                    self.setFont("Helvetica-Bold", 8)
                    self.setFillColor(colors.HexColor('#64748b'))
                    # Running Header
                    self.drawString(54, 560, f"ESG {self.module_title.upper()} REPORT")
                    self.setStrokeColor(colors.HexColor('#cbd5e1'))
                    self.setLineWidth(0.75)
                    self.line(54, 552, 738, 552)
                    # Running Footer
                    self.setFont("Helvetica", 8)
                    self.drawString(54, 30, "Confidential - For Internal Review Only")
                    self.drawRightString(738, 30, f"Page {self._pageNumber} of {page_count}")
                    self.line(54, 42, 738, 42)
                    self.restoreState()

            buffer = io.BytesIO()
            # Set margins to 54pt (0.75 inch)
            doc = SimpleDocTemplate(buffer, pagesize=landscape(letter), leftMargin=54, rightMargin=54, topMargin=72, bottomMargin=54)
            elements = []
            
            styles = getSampleStyleSheet()
            
            # Custom ParagraphStyles for Table Cells
            style_cell = ParagraphStyle(
                'Cell',
                parent=styles['Normal'],
                fontName='Helvetica',
                fontSize=9,
                leading=11,
                textColor=colors.HexColor('#1e293b')
            )
            style_cell_header = ParagraphStyle(
                'CellHeader',
                parent=styles['Normal'],
                fontName='Helvetica-Bold',
                fontSize=10,
                leading=12,
                textColor=colors.white
            )
            style_title = ParagraphStyle(
                'ReportTitle',
                parent=styles['Title'],
                fontName='Helvetica-Bold',
                fontSize=22,
                leading=26,
                textColor=colors.HexColor('#0f172a'),
                alignment=0
            )
            style_meta = ParagraphStyle(
                'ReportMeta',
                parent=styles['Normal'],
                fontName='Helvetica',
                fontSize=10,
                leading=14,
                textColor=colors.HexColor('#475569')
            )
            
            title_text = f"ESG {module.capitalize() if module else 'General'} Report"
            elements.append(Paragraph(title_text, style_title))
            elements.append(Paragraph(f"Export Date: {timezone.now().date()}", style_meta))
            elements.append(Spacer(1, 15))
            
            # Format data for table by wrapping in Paragraphs
            table_data = []
            table_data.append([Paragraph(h, style_cell_header) for h in headers])
            for row in data_rows:
                table_data.append([Paragraph(str(col), style_cell) for col in row])
                
            if len(table_data) > 1:
                # Printable area width: 792 - 2 * 54 = 684
                col_width = 684.0 / len(headers)
                t = Table(table_data, colWidths=[col_width] * len(headers))
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')), # Sleek dark slate
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                    ('TOPPADDING', (0, 0), (-1, 0), 8),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
                    ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
                    ('TOPPADDING', (0, 1), (-1, -1), 6),
                    ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
                ]))
                elements.append(t)
            else:
                elements.append(Paragraph("No data found for the selected criteria.", style_cell))
                
            # Bind module name to NumberedCanvas for header print
            NumberedCanvas.module_title = module if module else 'General'
            doc.build(elements, canvasmaker=NumberedCanvas)
            
            buffer.seek(0)
            response = HttpResponse(buffer.read(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename}.pdf"'
            return response

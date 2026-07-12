import datetime
import csv
from decimal import Decimal
from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Sum, Avg, Q
from django.utils import timezone
from django.http import HttpResponse, StreamingHttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

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
    OrganizationWeightConfigSerializer, OverallESGScoreSerializer
)

# Helper function to check and flag compliance issues
def check_compliance_deadlines():
    today = datetime.date.today()
    overdue_issues = ComplianceIssue.objects.filter(
        due_date__lt=today,
        status='Open'
    )
    for issue in overdue_issues:
        issue.status = 'Flagged'
        issue.save()
        # Create notification for owner
        Notification.objects.get_or_create(
            user=issue.owner,
            message=f"CRITICAL WARNING: Compliance issue '{issue.title}' is overdue! Status set to Flagged.",
            defaults={'is_read': False}
        )

# Helper function to check and auto-unlock badges
def check_badge_unlocks(user):
    profile = user.esg_profile
    badges = Badge.objects.all()
    
    for badge in badges:
        # Check if already awarded
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
            Notification.objects.create(
                user=user,
                message=f"CONGRATULATIONS! You have unlocked the '{badge.name}' badge!"
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

    def perform_create(self, serializer):
        participation = serializer.save()
        # If auto-approved (e.g. no evidence req or manually pre-approved)
        if participation.approval_status == 'Approved':
            self.apply_csr_rewards(participation)

    def perform_update(self, serializer):
        old_status = self.get_object().approval_status
        participation = serializer.save()
        new_status = participation.approval_status
        
        # When status moves to Approved
        if old_status != 'Approved' and new_status == 'Approved':
            self.apply_csr_rewards(participation)

    def apply_csr_rewards(self, participation):
        activity = participation.csr_activity
        employee = participation.employee
        profile = employee.esg_profile
        
        # Earn points and XP
        participation.points_earned = activity.points_earned
        participation.xp_earned = activity.xp_earned
        participation.save()
        
        # Update Profile
        profile.points += activity.points_earned
        profile.xp += activity.xp_earned
        profile.completed_csr_activities_count += 1
        profile.save()
        
        # Create notifications
        Notification.objects.create(
            user=employee,
            message=f"Your participation in CSR '{activity.title}' was approved! Earned {activity.points_earned} points and {activity.xp_earned} XP."
        )
        
        # Check badges
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
        
        # Earn XP
        participation.xp_awarded = challenge.xp
        participation.save()
        
        profile.xp += challenge.xp
        profile.completed_challenges_count += 1
        profile.save()
        
        Notification.objects.create(
            user=employee,
            message=f"Challenge '{challenge.title}' approved! Earned {challenge.xp} XP."
        )
        
        # Check badges
        check_badge_unlocks(employee)

class EmployeeProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer

    @action(detail=False, methods=['get'])
    def current(self, request):
        # Return first user profile or user from request (fallback to admin/first user for test)
        user = request.user if request.user.is_authenticated else User.objects.first()
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
        month_start = today.replace(day=1)
        
        # Trigger check/recalculate first
        self.calculate_scores(request)
        
        # Get overall score
        overall_score = OverallESGScore.objects.order_by('-date').first()
        overall_data = OverallESGScoreSerializer(overall_score).data if overall_score else {
            "environmental_score": 85.0, "social_score": 75.0, "governance_score": 80.0, "total_score": 80.0
        }
        
        # Get rankings (Department Score sorting)
        dept_scores = DepartmentScore.objects.filter(date=month_start).order_by('-total_score')
        rankings = DepartmentScoreSerializer(dept_scores, many=True).data
        
        # Carbon emission trend (past 6 months)
        six_months_ago = today - datetime.timedelta(days=180)
        transactions = CarbonTransaction.objects.filter(date__gte=six_months_ago)
        
        # Aggregate by month
        trend_data = {}
        for tx in transactions:
            m_key = tx.date.strftime('%Y-%m')
            trend_data[m_key] = trend_data.get(m_key, Decimal('0.0')) + tx.calculated_emission
            
        trend_list = [{"month": k, "emissions": float(v)} for k, v in sorted(trend_data.items())]
        
        # Leaderboard
        profiles = EmployeeProfile.objects.order_by('-xp')[:5]
        leaderboard = EmployeeProfileSerializer(profiles, many=True).data
        
        # Compliance notification flags
        user = request.user if request.user.is_authenticated else User.objects.first()
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

    @action(detail=False, methods=['get'], url_path='export-report')
    def export_report(self, request):
        # Filters
        dept_id = request.query_params.get('department')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        module = request.query_params.get('module') # environmental, social, governance
        export_format = request.query_params.get('format', 'csv') # csv, excel, pdf
        
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
            headers = ['Date', 'Department', 'Record Type', 'Emission Factor', 'Quantity', 'Calculated Emission (kg CO2)']
            for tx in txs:
                data_rows.append([
                    tx.date,
                    tx.department.name,
                    tx.record_type,
                    tx.emission_factor.name if tx.emission_factor else 'N/A',
                    tx.quantity,
                    tx.calculated_emission
                ])
        elif module == 'social':
            # CSR & Training completions
            headers = ['Date/Completion', 'Employee', 'Activity/Course', 'Type', 'Points/Hours', 'Status']
            participations = EmployeeParticipation.objects.all() # can filter if user is related to department
            for p in participations:
                data_rows.append([
                    p.completion_date,
                    p.employee.username,
                    p.csr_activity.title,
                    'CSR Activity',
                    p.points_earned,
                    p.approval_status
                ])
            trainings = TrainingCompletion.objects.all()
            for t in trainings:
                data_rows.append([
                    t.date_completed,
                    t.employee.username,
                    t.course_name,
                    'Training',
                    t.duration_hours,
                    'Completed'
                ])
        elif module == 'governance':
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
            # Simple text/HTML layout for PDF preview
            html_content = f"<html><head><style>table {{width: 100%; border-collapse: collapse;}} th, td {{border: 1px solid #ddd; padding: 8px; text-align: left;}} th {{background-color: #04AA6D; color: white;}}</style></head><body>"
            html_content += f"<h1>ESG {module.capitalize() if module else 'General'} Report</h1>"
            html_content += f"<h3>Export Date: {timezone.now().date()}</h3>"
            html_content += "<table><thead><tr>"
            for h in headers:
                html_content += f"<th>{h}</th>"
            html_content += "</tr></thead><tbody>"
            for row in data_rows:
                html_content += "<tr>"
                for col in row:
                    html_content += f"<td>{col}</td>"
                html_content += "</tr>"
            html_content += "</tbody></table></body></html>"
            return HttpResponse(html_content, content_type='text/html')

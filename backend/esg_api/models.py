from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal

# ==========================================
# 1. Master Configuration Models
# ==========================================

class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    head = models.CharField(max_length=100)
    parent_department = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subdepartments')
    employee_count = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')

    def __str__(self):
        return f"{self.name} ({self.code})"

class Category(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=[('CSR Activity', 'CSR Activity'), ('Challenge', 'Challenge')])
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')

    def __str__(self):
        return f"{self.name} - {self.type}"

class EmissionFactor(models.Model):
    name = models.CharField(max_length=100)
    carbon_value = models.DecimalField(max_digits=12, decimal_places=6) # kg CO2 per unit
    unit = models.CharField(max_length=50) # e.g. kWh, Liters, km
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')

    def __str__(self):
        return f"{self.name} ({self.carbon_value} kg CO2/{self.unit})"

class ProductESGProfile(models.Model):
    name = models.CharField(max_length=100)
    product_code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    carbon_footprint = models.DecimalField(max_digits=10, decimal_places=2) # kg CO2
    esg_score = models.DecimalField(max_digits=5, decimal_places=2) # 0-100 score

    def __str__(self):
        return f"{self.name} - ESG: {self.esg_score}"

class EnvironmentalGoal(models.Model):
    name = models.CharField(max_length=150)
    target_value = models.DecimalField(max_digits=12, decimal_places=2)
    current_value = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    deadline = models.DateField()
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Achieved', 'Achieved'), ('Failed', 'Failed')], default='Pending')

    def __str__(self):
        return f"{self.name} (Target: {self.target_value}, Status: {self.status})"

class ESGPolicy(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    effective_date = models.DateField()
    version = models.CharField(max_length=10, default="1.0")
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Draft', 'Draft'), ('Superseded', 'Superseded')], default='Active')

    def __str__(self):
        return f"{self.title} v{self.version}"

class Badge(models.Model):
    UNLOCK_RULES = [
        ('XP Threshold', 'XP Threshold'),
        ('CSR Count', 'CSR Count'),
        ('Challenge Count', 'Challenge Count')
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    unlock_rule = models.CharField(max_length=50, choices=UNLOCK_RULES)
    unlock_threshold = models.IntegerField()
    icon = models.CharField(max_length=50, default='award') # Lucide icon name

    def __str__(self):
        return self.name

class Reward(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    points_required = models.IntegerField()
    stock = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')

    def __str__(self):
        return f"{self.name} ({self.points_required} pts)"

# ==========================================
# 2. Daily Business Operations Models
# ==========================================

class PurchaseRecord(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    date = models.DateField()
    item_name = models.CharField(max_length=150)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    emission_factor = models.ForeignKey(EmissionFactor, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    calculated_emission = models.DecimalField(max_digits=12, decimal_places=2, blank=True)

    def save(self, *args, **kwargs):
        # Auto Emission Calculation from linked record using emission factor
        self.calculated_emission = Decimal(self.quantity) * Decimal(self.emission_factor.carbon_value)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Purchase {self.item_name} - {self.calculated_emission} kg CO2"

class ManufacturingRecord(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    date = models.DateField()
    product = models.ForeignKey(ProductESGProfile, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    emission_factor = models.ForeignKey(EmissionFactor, on_delete=models.PROTECT)
    calculated_emission = models.DecimalField(max_digits=12, decimal_places=2, blank=True)

    def save(self, *args, **kwargs):
        self.calculated_emission = Decimal(self.quantity) * Decimal(self.emission_factor.carbon_value)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Mfg {self.product.name} - {self.calculated_emission} kg CO2"

class ExpenseRecord(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    emission_factor = models.ForeignKey(EmissionFactor, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    calculated_emission = models.DecimalField(max_digits=12, decimal_places=2, blank=True)

    def save(self, *args, **kwargs):
        self.calculated_emission = Decimal(self.quantity) * Decimal(self.emission_factor.carbon_value)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Expense {self.category.name} - {self.calculated_emission} kg CO2"

class FleetRecord(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    vehicle_id = models.CharField(max_length=50)
    distance_traveled = models.DecimalField(max_digits=10, decimal_places=2) # in km
    fuel_type = models.CharField(max_length=50)
    emission_factor = models.ForeignKey(EmissionFactor, on_delete=models.PROTECT)
    calculated_emission = models.DecimalField(max_digits=12, decimal_places=2, blank=True)

    def save(self, *args, **kwargs):
        self.calculated_emission = Decimal(self.distance_traveled) * Decimal(self.emission_factor.carbon_value)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Fleet {self.vehicle_id} - {self.calculated_emission} kg CO2"

# ==========================================
# 3. Environmental Module & Carbon Transactions
# ==========================================

class CarbonTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('Purchase', 'Purchase'),
        ('Manufacturing', 'Manufacturing'),
        ('Expense', 'Expense'),
        ('Fleet', 'Fleet')
    ]
    record_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    record_id = models.IntegerField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    emission_factor = models.ForeignKey(EmissionFactor, on_delete=models.SET_NULL, null=True)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    calculated_emission = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return f"Carbon Transaction ({self.record_type}) - {self.calculated_emission} kg CO2"

class EnvironmentalScore(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    date = models.DateField() # Track monthly
    score = models.DecimalField(max_digits=5, decimal_places=2) # 0-100
    carbon_emissions = models.DecimalField(max_digits=12, decimal_places=2)
    target_met_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.department.name} Env Score: {self.score}"

    class Meta:
        unique_together = ('department', 'date')

# ==========================================
# 4. Social Module
# ==========================================

class CSRActivity(models.Model):
    title = models.CharField(max_length=150)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    description = models.TextField()
    points_earned = models.IntegerField(default=10)
    xp_earned = models.IntegerField(default=50)
    evidence_required = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')

    def __str__(self):
        return self.title

class EmployeeParticipation(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    csr_activity = models.ForeignKey(CSRActivity, on_delete=models.CASCADE)
    proof_description = models.TextField(blank=True, null=True)
    proof_file_url = models.CharField(max_length=255, blank=True, null=True)
    approval_status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending')
    points_earned = models.IntegerField(default=0)
    xp_earned = models.IntegerField(default=0)
    completion_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.username} in {self.csr_activity.title} ({self.approval_status})"

class DiversityMetrics(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    date = models.DateField()
    female_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    minority_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    total_employees = models.IntegerField()

    def __str__(self):
        return f"Diversity - {self.department.name} ({self.date})"

class TrainingCompletion(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=150)
    date_completed = models.DateField()
    duration_hours = models.DecimalField(max_digits=5, decimal_places=1)

    def __str__(self):
        return f"{self.employee.username} - {self.course_name}"

# ==========================================
# 5. Governance Module
# ==========================================

class PolicyAcknowledgement(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    policy = models.ForeignKey(ESGPolicy, on_delete=models.CASCADE)
    acknowledged_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'policy')

    def __str__(self):
        return f"{self.employee.username} ack {self.policy.title}"

class Audit(models.Model):
    title = models.CharField(max_length=150)
    date = models.DateField()
    scope = models.TextField()
    auditor = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=[('Draft', 'Draft'), ('In Progress', 'In Progress'), ('Completed', 'Completed')], default='In Progress')

    def __str__(self):
        return self.title

class ComplianceIssue(models.Model):
    SEVERITY_LEVELS = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical')
    ]
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('Resolved', 'Resolved'),
        ('Flagged', 'Flagged')
    ]
    audit = models.ForeignKey(Audit, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=150)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')

    def __str__(self):
        return f"{self.title} - {self.severity} ({self.status})"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:30]}"

# ==========================================
# 6. Gamification Module
# ==========================================

class Challenge(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Active', 'Active'),
        ('Under Review', 'Under Review'),
        ('Completed', 'Completed'),
        ('Archived', 'Archived')
    ]
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard')
    ]
    title = models.CharField(max_length=150)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    description = models.TextField()
    xp = models.IntegerField(default=100)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='Medium')
    evidence_required = models.BooleanField(default=True)
    deadline = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')

    def __str__(self):
        return self.title

class ChallengeParticipation(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0.0) # 0 to 100
    proof_description = models.TextField(blank=True, null=True)
    proof_file_url = models.CharField(max_length=255, blank=True, null=True)
    approval_status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending')
    xp_awarded = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.employee.username} in {self.challenge.title} ({self.progress}%)"

class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='esg_profile')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    points = models.IntegerField(default=0)
    xp = models.IntegerField(default=0)
    completed_challenges_count = models.IntegerField(default=0)
    completed_csr_activities_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} Profile - XP: {self.xp}, Pts: {self.points}"

class BadgeAward(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'badge')

    def __str__(self):
        return f"{self.employee.username} unlocked {self.badge.name}"

class RewardRedemption(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    redeemed_at = models.DateTimeField(auto_now_add=True)
    points_deducted = models.IntegerField()

    def __str__(self):
        return f"{self.employee.username} redeemed {self.reward.name}"

# ==========================================
# 7. ESG Scoring & Department Rankings Models
# ==========================================

class DepartmentScore(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    environmental_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    social_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    governance_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    total_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    date = models.DateField() # Tracked monthly (e.g. YYYY-MM-01)

    class Meta:
        unique_together = ('department', 'date')

    def __str__(self):
        return f"{self.department.name} - ESG: {self.total_score} ({self.date})"

class OrganizationWeightConfig(models.Model):
    environmental_weight = models.DecimalField(max_digits=4, decimal_places=2, default=0.40)
    social_weight = models.DecimalField(max_digits=4, decimal_places=2, default=0.30)
    governance_weight = models.DecimalField(max_digits=4, decimal_places=2, default=0.30)

    def __str__(self):
        return f"Weights - E: {self.environmental_weight}, S: {self.social_weight}, G: {self.governance_weight}"


class SystemConfig(models.Model):
    auto_emission_calculation = models.BooleanField(default=True)
    evidence_requirement = models.BooleanField(default=False)
    badge_auto_award = models.BooleanField(default=True)
    notify_new_compliance = models.BooleanField(default=True)
    notify_csr_approval = models.BooleanField(default=True)
    notify_policy_reminders = models.BooleanField(default=True)
    notify_badge_unlocks = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'System Configuration'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "System Configuration"

class OverallESGScore(models.Model):
    environmental_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    social_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    governance_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    total_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    date = models.DateField() # Monthly

    class Meta:
        unique_together = ('date',)

    def __str__(self):
        return f"Overall ESG Score: {self.total_score} ({self.date})"

# ==========================================
# Signals for Business Logic / Automation
# ==========================================

# Auto Create Profile for User
@receiver(post_save, sender=User)
def create_employee_profile(sender, instance, created, **kwargs):
    if created:
        EmployeeProfile.objects.create(user=instance)

def _auto_emission_enabled():
    return SystemConfig.get_solo().auto_emission_calculation


# Post-Save Signals to Automatically Log Carbon Transactions
@receiver(post_save, sender=PurchaseRecord)
def log_purchase_carbon(sender, instance, created, **kwargs):
    if not _auto_emission_enabled():
        return
    CarbonTransaction.objects.update_or_create(
        record_type='Purchase',
        record_id=instance.id,
        defaults={
            'department': instance.department,
            'emission_factor': instance.emission_factor,
            'quantity': instance.quantity,
            'calculated_emission': instance.calculated_emission,
            'date': instance.date
        }
    )

@receiver(post_save, sender=ManufacturingRecord)
def log_mfg_carbon(sender, instance, created, **kwargs):
    if not _auto_emission_enabled():
        return
    CarbonTransaction.objects.update_or_create(
        record_type='Manufacturing',
        record_id=instance.id,
        defaults={
            'department': instance.department,
            'emission_factor': instance.emission_factor,
            'quantity': instance.quantity,
            'calculated_emission': instance.calculated_emission,
            'date': instance.date
        }
    )

@receiver(post_save, sender=ExpenseRecord)
def log_expense_carbon(sender, instance, created, **kwargs):
    if not _auto_emission_enabled():
        return
    CarbonTransaction.objects.update_or_create(
        record_type='Expense',
        record_id=instance.id,
        defaults={
            'department': instance.department,
            'emission_factor': instance.emission_factor,
            'quantity': instance.quantity,
            'calculated_emission': instance.calculated_emission,
            'date': instance.date
        }
    )

@receiver(post_save, sender=FleetRecord)
def log_fleet_carbon(sender, instance, created, **kwargs):
    if not _auto_emission_enabled():
        return
    import datetime
    today = datetime.date.today()
    CarbonTransaction.objects.update_or_create(
        record_type='Fleet',
        record_id=instance.id,
        defaults={
            'department': instance.department,
            'emission_factor': instance.emission_factor,
            'quantity': instance.distance_traveled,
            'calculated_emission': instance.calculated_emission,
            'date': today
        }
    )

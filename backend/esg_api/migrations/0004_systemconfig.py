from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('esg_api', '0003_alter_environmentalscore_unique_together'),
    ]

    operations = [
        migrations.CreateModel(
            name='SystemConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('auto_emission_calculation', models.BooleanField(default=True)),
                ('evidence_requirement', models.BooleanField(default=False)),
                ('badge_auto_award', models.BooleanField(default=True)),
                ('notify_new_compliance', models.BooleanField(default=True)),
                ('notify_csr_approval', models.BooleanField(default=True)),
                ('notify_policy_reminders', models.BooleanField(default=True)),
                ('notify_badge_unlocks', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'System Configuration',
            },
        ),
    ]

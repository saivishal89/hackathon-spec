from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.organization import Organization
from app.models.user import User
from app.models.request import ServiceRequest
from app.models.sla_policy import SLAPolicy
from app.models.feedback import CustomerFeedback
from app.models.audit_log import AuditLog
from app.services.auth_service import get_password_hash

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return

    print("[SLA AI] Seeding initial database data...")

    # 1. Seed Organizations
    orgs = [
        Organization(
            id="org_enterprise",
            name="Enterprise Global Operations",
            slug="enterprise-global",
            tier="ENTERPRISE",
            monthly_contract_value_usd=125000.0,
            max_users=100,
            max_requests_per_month=10000,
            ai_limit_per_month=5000,
        ),
        Organization(
            id="org_fintech_global_systems",
            name="FinTech Global Systems",
            slug="fintech-global",
            tier="PRO",
            monthly_contract_value_usd=18500.0,
            max_users=25,
            max_requests_per_month=1000,
            ai_limit_per_month=500,
        )
    ]
    db.add_all(orgs)

    # 2. Seed Users
    users = [
        User(
            id="user-admin-1",
            email="sarah.connor@enterprise.io",
            hashed_password=get_password_hash("password123"),
            name="Sarah Connor",
            role="ADMIN",
            title="Lead Incident & SLA Operations",
            department="IT Infrastructure",
            organization_id="org_enterprise",
            company="Enterprise",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80",
            mfa_enabled=True,
        ),
        User(
            id="user-client-1",
            email="alex.morgan@fintechcorp.com",
            hashed_password=get_password_hash("password123"),
            name="Alex Morgan",
            role="CLIENT",
            title="VP of Engineering",
            department="Customer Operations",
            organization_id="org_fintech_global_systems",
            company="FinTech Global Systems",
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80",
            mfa_enabled=False,
        ),
        User(
            id="user-agent-1",
            email="david.kim@enterprise.io",
            hashed_password=get_password_hash("password123"),
            name="David Kim",
            role="AGENT",
            title="Senior Site Reliability Engineer",
            department="DevOps & Cloud",
            organization_id="org_enterprise",
            company="Enterprise",
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80",
            mfa_enabled=False,
        ),
        User(
            id="user-agent-3",
            email="elena.rostova@enterprise.io",
            hashed_password=get_password_hash("password123"),
            name="Elena Rostova",
            role="AGENT",
            title="Staff Database Administrator",
            department="IT Infrastructure",
            organization_id="org_enterprise",
            company="Enterprise",
            avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80",
            mfa_enabled=False,
        ),
    ]
    db.add_all(users)

    # 3. Seed SLA Policies
    policies = [
        SLAPolicy(
            id="sla-plat-01",
            name="Platinum Tier",
            tier="PLATINUM",
            description="Mission critical coverage with 24x7 immediate response guarantee and penalty rebates.",
            business_hours="24x7",
            breach_penalty_enabled=True,
            breach_penalty_per_minute_usd=150.0,
            is_default=True,
            targets=[
                {"priority": "P1_CRITICAL", "targetResponseMinutes": 15, "targetResolutionHours": 2, "escalationThresholdMinutes": 30},
                {"priority": "P2_HIGH", "targetResponseMinutes": 30, "targetResolutionHours": 4, "escalationThresholdMinutes": 60},
                {"priority": "P3_MEDIUM", "targetResponseMinutes": 60, "targetResolutionHours": 12, "escalationThresholdMinutes": 120},
                {"priority": "P4_LOW", "targetResponseMinutes": 120, "targetResolutionHours": 24, "escalationThresholdMinutes": 240},
            ]
        ),
        SLAPolicy(
            id="sla-gold-02",
            name="Gold Tier",
            tier="GOLD",
            description="Standard enterprise tier coverage with 24x7 escalation monitoring.",
            business_hours="24x7",
            breach_penalty_enabled=True,
            breach_penalty_per_minute_usd=50.0,
            is_default=False,
            targets=[
                {"priority": "P1_CRITICAL", "targetResponseMinutes": 30, "targetResolutionHours": 4, "escalationThresholdMinutes": 60},
                {"priority": "P2_HIGH", "targetResponseMinutes": 60, "targetResolutionHours": 8, "escalationThresholdMinutes": 120},
                {"priority": "P3_MEDIUM", "targetResponseMinutes": 120, "targetResolutionHours": 24, "escalationThresholdMinutes": 240},
                {"priority": "P4_LOW", "targetResponseMinutes": 240, "targetResolutionHours": 48, "escalationThresholdMinutes": 480},
            ]
        ),
        SLAPolicy(
            id="sla-silver-03",
            name="Silver Tier",
            tier="SILVER",
            description="Growth coverage for development and non-critical staging workloads.",
            business_hours="9-to-5",
            breach_penalty_enabled=False,
            breach_penalty_per_minute_usd=0.0,
            is_default=False,
            targets=[
                {"priority": "P1_CRITICAL", "targetResponseMinutes": 60, "targetResolutionHours": 8, "escalationThresholdMinutes": 120},
                {"priority": "P2_HIGH", "targetResponseMinutes": 120, "targetResolutionHours": 16, "escalationThresholdMinutes": 240},
                {"priority": "P3_MEDIUM", "targetResponseMinutes": 240, "targetResolutionHours": 48, "escalationThresholdMinutes": 480},
                {"priority": "P4_LOW", "targetResponseMinutes": 480, "targetResolutionHours": 72, "escalationThresholdMinutes": 960},
            ]
        )
    ]
    db.add_all(policies)

    # 4. Seed Requests
    now = datetime.utcnow()
    requests = [
        ServiceRequest(
            id="req-101",
            ticket_number="SLA-8941",
            title="Critical: Production database connection pool exhaustion",
            description="Backend services are experiencing intermittent timeouts connecting to primary PostgreSQL cluster. Client checkout flow is degraded.",
            category="Database Outage",
            department="IT Infrastructure",
            priority="P1_CRITICAL",
            status="IN_PROGRESS",
            requester_id="user-client-1",
            requester_name="Alex Morgan",
            requester_email="alex.morgan@fintechcorp.com",
            requester_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80",
            requester_company="FinTech Global Systems",
            assignee_id="user-agent-1",
            assignee_name="David Kim",
            assignee_email="david.kim@enterprise.io",
            assignee_avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80",
            created_at=now - timedelta(minutes=95),
            updated_at=now - timedelta(minutes=5),
            response_due_at=now - timedelta(minutes=80),
            responded_at=now - timedelta(minutes=85),
            resolution_due_at=now + timedelta(minutes=25),  # 25 min remaining
            sla_tier="PLATINUM",
            risk_score=84.0,
            risk_level="CRITICAL",
            risk_trend="increasing",
            risk_explanation="Imminent breach: 79% of contracted SLA window has elapsed while database pool locks remain unresolved.",
            complexity_score=9,
            sentiment_urgency="critical",
            tags=["Database", "P1", "PostgreSQL", "Outage"],
            timeline=[
                {
                    "id": "tl-1",
                    "timestamp": (now - timedelta(minutes=95)).isoformat() + "Z",
                    "title": "Incident Created via Client Portal",
                    "description": "Submitted by Alex Morgan (FinTech Global Systems)",
                    "actor": {"name": "Alex Morgan", "role": "CLIENT"},
                    "type": "status_change",
                },
                {
                    "id": "tl-2",
                    "timestamp": (now - timedelta(minutes=85)).isoformat() + "Z",
                    "title": "Engineer Assigned & Triaged",
                    "description": "David Kim acknowledged incident within 10 minutes (SLA Response Met).",
                    "actor": {"name": "David Kim", "role": "AGENT"},
                    "type": "status_change",
                },
                {
                    "id": "tl-3",
                    "timestamp": (now - timedelta(minutes=15)).isoformat() + "Z",
                    "title": "AI Risk Warning Triggered (>80%)",
                    "description": "Autonomous SLA monitor flagged high risk of breach due to queue lock complexity.",
                    "actor": {"name": "SLA AI Monitor", "role": "AI Engine", "isAi": True},
                    "type": "sla_warning",
                }
            ],
            risk_factors=[
                {"id": "rf-time", "label": "SLA Timeline Elapsed", "weight": 0.40, "impact": "critical", "description": "79% of contracted resolution window elapsed.", "mitigationTip": "Expedite current phase or trigger playbook."},
                {"id": "rf-workload", "label": "Engineer Queue Saturation", "weight": 0.25, "impact": "critical", "description": "David Kim has 4 concurrent high-priority tickets active.", "mitigationTip": "Rebalance or attach co-responder."},
                {"id": "rf-complexity", "label": "Database Lock Complexity", "weight": 0.20, "impact": "high", "description": "Multi-tenant connection starvation across replicas.", "mitigationTip": "Pair with DBA specialist."},
            ],
            recommended_actions=[
                {
                    "id": "act-reassign-sre",
                    "type": "reassign",
                    "title": "Smart Rebalance to Elena Rostova",
                    "description": "Auto-reassign ticket to Elena Rostova (Staff DBA) with 15% current queue utilization.",
                    "predictedRiskReduction": 38,
                    "targetAssigneeId": "user-agent-3",
                    "targetAssigneeName": "Elena Rostova",
                    "isExecuted": False,
                },
                {
                    "id": "act-grace-extension",
                    "type": "extend_grace",
                    "title": "Request 1-Hour SLA Grace Window",
                    "description": "Trigger client SLA maintenance extension protocol based on upstream cloud provider maintenance.",
                    "predictedRiskReduction": 45,
                    "isExecuted": False,
                }
            ]
        ),
        ServiceRequest(
            id="req-102",
            ticket_number="SLA-8942",
            title="Kubernetes ingress 502 errors during canary rollout",
            description="Ingress traffic to auth-service intermittently returns 502 Bad Gateway during canary deployment.",
            category="Cloud Deployment",
            department="DevOps & Cloud",
            priority="P2_HIGH",
            status="TRIAGED",
            requester_id="user-client-1",
            requester_name="Alex Morgan",
            requester_email="alex.morgan@fintechcorp.com",
            requester_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80",
            requester_company="FinTech Global Systems",
            assignee_id="user-agent-1",
            assignee_name="David Kim",
            assignee_email="david.kim@enterprise.io",
            assignee_avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80",
            created_at=now - timedelta(hours=2),
            updated_at=now - timedelta(minutes=20),
            response_due_at=now - timedelta(hours=1, minutes=30),
            responded_at=now - timedelta(hours=1, minutes=45),
            resolution_due_at=now + timedelta(hours=2),
            sla_tier="GOLD",
            risk_score=52.0,
            risk_level="MEDIUM",
            risk_trend="stable",
            risk_explanation="Elevated risk: canary traffic shifting requires SRE verification before deadline.",
            complexity_score=7,
            sentiment_urgency="high",
            tags=["Kubernetes", "DevOps", "Canary"],
            timeline=[
                {
                    "id": "tl-102-1",
                    "timestamp": (now - timedelta(hours=2)).isoformat() + "Z",
                    "title": "Request Submitted",
                    "description": "Alex Morgan reported canary ingress failures.",
                    "actor": {"name": "Alex Morgan", "role": "CLIENT"},
                    "type": "status_change",
                }
            ],
            risk_factors=[
                {"id": "rf-1", "label": "Canary Verification Pending", "weight": 0.35, "impact": "medium", "description": "Verification pending automated smoke tests.", "mitigationTip": "Run synthetic traffic suites."}
            ],
            recommended_actions=[
                {
                    "id": "act-rollback",
                    "type": "trigger_playbook",
                    "title": "1-Click Canary Rollback Playbook",
                    "description": "Trigger Helm rollback to stable v2.4.1 deployment.",
                    "predictedRiskReduction": 30,
                    "isExecuted": False,
                }
            ]
        ),
        ServiceRequest(
            id="req-103",
            ticket_number="SLA-8943",
            title="SSO SAML authentication certificate renewal",
            description="Annual SAML IdP metadata certificate renewal for Enterprise Okta federation.",
            category="Security & Access",
            department="Cybersecurity",
            priority="P3_MEDIUM",
            status="RESOLVED",
            requester_id="user-client-1",
            requester_name="Alex Morgan",
            requester_email="alex.morgan@fintechcorp.com",
            requester_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80",
            requester_company="FinTech Global Systems",
            assignee_id="user-agent-3",
            assignee_name="Elena Rostova",
            assignee_email="elena.rostova@enterprise.io",
            assignee_avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80",
            created_at=now - timedelta(days=1),
            updated_at=now - timedelta(hours=4),
            response_due_at=now - timedelta(hours=23),
            responded_at=now - timedelta(hours=23, minutes=30),
            resolution_due_at=now + timedelta(hours=11),
            resolved_at=now - timedelta(hours=4),
            sla_tier="PLATINUM",
            risk_score=15.0,
            risk_level="LOW",
            risk_trend="decreasing",
            risk_explanation="Incident successfully resolved 15 hours ahead of SLA deadline.",
            complexity_score=4,
            sentiment_urgency="moderate",
            tags=["Security", "SSO", "SAML"],
            timeline=[
                {
                    "id": "tl-103-1",
                    "timestamp": (now - timedelta(days=1)).isoformat() + "Z",
                    "title": "Certificate Renewal Requested",
                    "description": "Requested by Alex Morgan",
                    "actor": {"name": "Alex Morgan", "role": "CLIENT"},
                    "type": "status_change",
                },
                {
                    "id": "tl-103-2",
                    "timestamp": (now - timedelta(hours=4)).isoformat() + "Z",
                    "title": "Resolved Ahead of SLA",
                    "description": "Elena updated x509 cert in production federation store.",
                    "actor": {"name": "Elena Rostova", "role": "AGENT"},
                    "type": "status_change",
                }
            ],
            risk_factors=[],
            recommended_actions=[]
        )
    ]
    db.add_all(requests)

    # 5. Seed Customer Feedback
    feedbacks = [
        CustomerFeedback(
            id="fb-001",
            request_id="req-103",
            user_id="user-client-1",
            user_name="Alex Morgan",
            user_email="alex.morgan@fintechcorp.com",
            rating=5,
            response_quality_rating=5,
            sla_satisfaction_rating=5,
            comment="Outstanding response time! Elena renewed the cert without any downtime to our login services.",
            created_at=now - timedelta(hours=3),
        )
    ]
    db.add_all(feedbacks)

    db.commit()
    print("[SLA AI] Database successfully initialized with demo seed data.")

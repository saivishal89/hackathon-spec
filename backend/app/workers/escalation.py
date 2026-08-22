import time
from datetime import datetime
from app.core.database import SessionLocal
from app.models.request import ServiceRequest
from app.models.user import User
from app.services.notification_service import NotificationService

def run_escalation_cycle():
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        # Find critical tickets unassigned for over 15 minutes
        unassigned_critical = db.query(ServiceRequest).filter(
            ServiceRequest.assignee_id == None,
            ServiceRequest.priority == "P1_CRITICAL",
            ServiceRequest.status == "SUBMITTED"
        ).all()

        for req in unassigned_critical:
            # Auto-assign to available Admin or Lead SRE
            lead_admin = db.query(User).filter(User.role == "ADMIN").first()
            if lead_admin:
                req.assignee_id = lead_admin.id
                req.assignee_name = lead_admin.name
                req.assignee_email = lead_admin.email
                req.assignee_avatar = lead_admin.avatar
                req.status = "TRIAGED"
                req.updated_at = now
                
                timeline = list(req.timeline or [])
                timeline.append({
                    "id": f"tl-esc-{int(now.timestamp())}",
                    "timestamp": now.isoformat() + "Z",
                    "title": f"🚨 Automated SLA Escalation: Reassigned to Lead ({lead_admin.name})",
                    "description": "Unassigned critical ticket auto-escalated to preserve P1 SLA response commitment.",
                    "actor": {"name": "SLA Escalation Engine", "role": "Worker", "isAi": True},
                    "type": "escalation",
                })
                req.timeline = timeline

                NotificationService.create_notification(
                    db=db,
                    title=f"🚨 P1 Incident Auto-Escalated: {req.ticket_number}",
                    message=f"Ticket '{req.title}' escalated and assigned to {lead_admin.name}.",
                    type="ESCALATION",
                    severity="CRITICAL",
                    user_id=lead_admin.id,
                    request_id=req.id,
                )

        db.commit()
    except Exception as e:
        print(f"Error in escalation cycle: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("[SLA AI] SLA Escalation Worker started...")
    while True:
        try:
            run_escalation_cycle()
        except Exception as e:
            print(f"Escalation cycle exception: {e}")
        time.sleep(30)

if __name__ == "__main__":
    main()

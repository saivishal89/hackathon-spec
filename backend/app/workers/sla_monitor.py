import time
from datetime import datetime
from app.core.database import SessionLocal, engine, Base
from app.models.request import ServiceRequest
from app.services.sla_engine import SLAEngine
from app.ai.model import RiskModel
from app.services.notification_service import NotificationService

def run_sla_monitor_cycle():
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        active_requests = db.query(ServiceRequest).filter(
            ServiceRequest.status.notin_(["RESOLVED", "CLOSED"])
        ).all()

        for req in active_requests:
            sla_eval = SLAEngine.evaluate_sla_progress(
                created_at=req.created_at,
                resolution_due_at=req.resolution_due_at,
                status=req.status,
                now=now
            )

            new_risk = RiskModel.evaluate_multi_factor_risk(
                elapsed_percentage=sla_eval["percentage_elapsed"],
                complexity_score=req.complexity_score or 5,
                assignee_name=req.assignee_name,
                co_assignee_count=len(req.co_assignees or []),
                priority=req.priority
            )

            old_risk_level = req.risk_level
            req.risk_score = new_risk["risk_score"]
            req.risk_level = new_risk["risk_level"]
            req.risk_trend = new_risk["risk_trend"]
            req.risk_explanation = new_risk["risk_explanation"]
            req.risk_factors = new_risk["risk_factors"]
            req.recommended_actions = new_risk["recommended_actions"]

            # If risk elevated into CRITICAL, create notification
            if new_risk["risk_level"] == "CRITICAL" and old_risk_level != "CRITICAL":
                timeline = list(req.timeline or [])
                timeline.append({
                    "id": f"tl-warn-{int(now.timestamp())}",
                    "timestamp": now.isoformat() + "Z",
                    "title": f"⚠️ Autonomous Breach Warning: Risk escalated to {new_risk['risk_score']}%",
                    "description": f"SLA timer is at {sla_eval['percentage_elapsed']}% elapsed. Immediate rebalance advised.",
                    "actor": {"name": "SLA AI Monitor Worker", "role": "Worker", "isAi": True},
                    "type": "sla_warning",
                })
                req.timeline = timeline
                
                NotificationService.create_notification(
                    db=db,
                    title=f"Critical SLA Breach Risk: {req.ticket_number}",
                    message=f"Ticket '{req.title}' has reached {new_risk['risk_score']}% breach probability. SRE intervention required.",
                    type="SLA_WARNING",
                    severity="CRITICAL",
                    request_id=req.id,
                )

            req.updated_at = now

        db.commit()
    except Exception as e:
        print(f"Error in SLA monitor cycle: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("[SLA AI] SLA Monitor Worker started...")
    Base.metadata.create_all(bind=engine)
    while True:
        try:
            run_sla_monitor_cycle()
        except Exception as e:
            print(f"Worker cycle exception: {e}")
        time.sleep(15)

if __name__ == "__main__":
    main()

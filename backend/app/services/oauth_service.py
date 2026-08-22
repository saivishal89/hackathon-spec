import uuid
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash

class OAuthService:
    @staticmethod
    def authenticate_oauth_user(
        db: Session,
        provider: str,
        oauth_id: str,
        email: str,
        name: str,
        avatar: Optional[str] = None
    ) -> User:
        user = None
        if provider == "google":
            user = db.query(User).filter(User.google_id == oauth_id).first()
        elif provider == "github":
            user = db.query(User).filter(User.github_id == oauth_id).first()
        elif provider == "microsoft":
            user = db.query(User).filter(User.microsoft_id == oauth_id).first()

        if not user:
            # Check by email
            user = db.query(User).filter(User.email == email.lower()).first()
            if user:
                # Link OAuth ID to existing account
                if provider == "google": user.google_id = oauth_id
                elif provider == "github": user.github_id = oauth_id
                elif provider == "microsoft": user.microsoft_id = oauth_id
                if avatar and not user.avatar: user.avatar = avatar
                db.commit()
                db.refresh(user)
                return user

        if not user:
            # Create new OAuth user
            user = User(
                id=f"user-{uuid.uuid4().hex[:8]}",
                email=email.lower(),
                hashed_password=get_password_hash(uuid.uuid4().hex),
                name=name,
                role="CLIENT",
                company="Enterprise Partner",
                department="Customer Operations",
                organization_id="org_default",
                avatar=avatar or "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80",
            )
            if provider == "google": user.google_id = oauth_id
            elif provider == "github": user.github_id = oauth_id
            elif provider == "microsoft": user.microsoft_id = oauth_id
            
            db.add(user)
            db.commit()
            db.refresh(user)

        return user

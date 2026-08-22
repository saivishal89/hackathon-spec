from typing import Dict, Any, List

CRITICAL_KEYWORDS = ["outage", "down", "production", "data loss", "security breach", "vulnerability", "p0", "blocked all users", "crash", "cluster offline"]
HIGH_KEYWORDS = ["urgent", "error", "failed", "timeout", "database", "slow", "cannot deploy", "billing error", "payment", "revenue", "502", "504"]
MEDIUM_KEYWORDS = ["bug", "issue", "glitch", "feature", "configuration", "upgrade", "access", "permission", "sync", "latency"]

class FeatureExtractor:
    @staticmethod
    def extract_features(title: str, description: str, category: str = "General Support") -> Dict[str, Any]:
        text = f"{title} {description} {category}".lower()
        
        found_critical = [k for k in CRITICAL_KEYWORDS if k in text]
        found_high = [k for k in HIGH_KEYWORDS if k in text]
        found_medium = [k for k in MEDIUM_KEYWORDS if k in text]
        
        word_count = len(text.split())
        char_count = len(text)
        
        # Calculate text complexity score
        base_complexity = 3
        if found_critical:
            base_complexity += 4 + len(found_critical)
        elif found_high:
            base_complexity += 2 + len(found_high)
        if char_count > 300:
            base_complexity += 1
            
        complexity_score = min(10, max(1, base_complexity))
        
        # Urgency classification
        if found_critical or "p1" in text or "production outage" in text:
            urgency = "critical"
        elif found_high or "p2" in text:
            urgency = "high"
        elif found_medium:
            urgency = "moderate"
        else:
            urgency = "low"

        # Department classification
        department = "IT Infrastructure"
        if any(w in text for w in ["k8s", "kubernetes", "canary", "deploy", "ingress", "aws", "cloud", "docker"]):
            department = "DevOps & Cloud"
        elif any(w in text for w in ["security", "saml", "sso", "cert", "vulnerability", "auth", "mfa", "leak"]):
            department = "Cybersecurity"
        elif any(w in text for w in ["invoice", "refund", "credit", "billing", "payment", "charge", "subscription"]):
            department = "Billing & Finance"
        elif any(w in text for w in ["api", "graphql", "sql", "backend", "frontend", "null pointer", "crash", "stack"]):
            department = "Core Engineering"
        elif any(w in text for w in ["user", "onboarding", "login assistance", "client support", "access request"]):
            department = "Customer Operations"

        keywords = list(dict.fromkeys(found_critical + found_high + found_medium))[:6]

        return {
            "complexity_score": complexity_score,
            "sentiment_urgency": urgency,
            "detected_keywords": keywords,
            "suggested_department": department,
            "is_critical": len(found_critical) > 0,
            "word_count": word_count,
        }

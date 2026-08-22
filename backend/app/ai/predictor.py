from typing import Dict, Any
from app.ai.features import FeatureExtractor

class SLAPredictor:
    @staticmethod
    def predict_pre_triage(title: str, description: str, category: str = "General Support") -> Dict[str, Any]:
        feats = FeatureExtractor.extract_features(title, description, category)
        
        urgency = feats["sentiment_urgency"]
        complexity = feats["complexity_score"]
        
        if urgency == "critical":
            suggested_priority = "P1_CRITICAL"
            estimated_resolution_hours = 2.0
            predicted_breach_risk = 68.0
        elif urgency == "high":
            suggested_priority = "P2_HIGH"
            estimated_resolution_hours = 5.0
            predicted_breach_risk = 44.0
        elif urgency == "moderate":
            suggested_priority = "P3_MEDIUM"
            estimated_resolution_hours = 12.0
            predicted_breach_risk = 18.0
        else:
            suggested_priority = "P4_LOW"
            estimated_resolution_hours = 24.0
            predicted_breach_risk = 8.0

        return {
            "suggestedPriority": suggested_priority,
            "estimatedResolutionHours": estimated_resolution_hours,
            "complexityScore": complexity,
            "sentimentUrgency": urgency,
            "predictedBreachRisk": predicted_breach_risk,
            "detectedKeywords": feats["detected_keywords"],
            "suggestedDepartment": feats["suggested_department"],
        }

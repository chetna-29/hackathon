import os
import sys

def get_landslide_prediction(
    rainfall_24h: float,
    cumulative_rainfall_7d: float = 0.0,
    slope: float = 35.0,
    elevation: float = 1200.0,
    historical_disasters: int = 1
) -> dict:
    # Try importing from ml package if root is in PYTHONPATH
    try:
        from ml.predict import predict_landslide_risk
        return predict_landslide_risk(
            rainfall_24h=rainfall_24h,
            cumulative_rainfall_7d=cumulative_rainfall_7d,
            slope=slope,
            elevation=elevation,
            historical_landslides=historical_disasters
        )
    except Exception:
        pass

    # Self-contained heuristic engine fallback
    slope_factor = min(max((slope - 15.0) / 30.0, 0.0), 1.0)
    rain_factor = min(rainfall_24h / 200.0, 1.0)
    history_factor = min(historical_disasters * 0.15, 0.3)
    
    raw_score = (rain_factor * 0.55) + (slope_factor * 0.35) + history_factor
    score = min(max(raw_score, 0.05), 0.99)

    if score >= 0.70 or rainfall_24h >= 140:
        level = "HIGH"
    elif score >= 0.40 or rainfall_24h >= 75:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "risk_level": level,
        "risk_score": round(score, 2),
        "model_used": "Landslide_Hydrological_Engine"
    }

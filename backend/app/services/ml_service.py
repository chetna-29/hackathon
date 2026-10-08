"""
FIRE-EYE ML Prediction Service
Loads a pre-trained joblib model at application startup and keeps it in memory.
Falls back to a calibrated hydrological heuristic engine if no model file is found.
"""

import logging
import os

logger = logging.getLogger("fire-eye.ml")

# ── Model Singleton ──────────────────────────────────────────────────────────
_model = None
_model_loaded = False


def load_model_at_startup():
    """Call once from FastAPI lifespan/startup to warm the model into RAM."""
    global _model, _model_loaded
    model_path = os.getenv(
        "ML_MODEL_PATH",
        os.path.join(
            os.path.dirname(__file__), "..", "..", "ml", "landslide_model.joblib"
        ),
    )
    model_path = os.path.abspath(model_path)

    if os.path.exists(model_path):
        try:
            import joblib

            _model = joblib.load(model_path)
            _model_loaded = True
            logger.info(f"ML model loaded from {model_path}")
        except Exception as e:
            logger.warning(f"Failed to load ML model: {e}. Using heuristic fallback.")
    else:
        logger.info(f"No model file at {model_path}. Using heuristic fallback engine.")


def predict_risk_at_location(
    lat: float, lon: float, rainfall_24h: float = 100.0
) -> float:
    """
    Internal service function used by the Priority Engine.
    Returns a 0.0–1.0 probability score for the risk at a given coordinate.
    """
    if _model_loaded and _model is not None:
        try:
            import numpy as np

            features = np.array([[rainfall_24h, 35.0, 1200.0, lat, lon]])
            prob = float(_model.predict_proba(features)[0][1])
            return round(min(max(prob, 0.0), 1.0), 3)
        except Exception:
            pass

    # Heuristic fallback based on known Uttarakhand danger coordinates
    base_risk = min(rainfall_24h / 200.0, 1.0) * 0.6
    # Chamoli / Rudraprayag high-altitude danger corridor
    if 30.2 <= lat <= 30.7 and 78.5 <= lon <= 79.5:
        base_risk += 0.25
    return round(min(base_risk, 0.99), 3)


def get_landslide_prediction(
    rainfall_24h: float,
    cumulative_rainfall_7d: float = 0.0,
    slope: float = 35.0,
    elevation: float = 1200.0,
    historical_landslides: int = 1,
) -> dict:
    """
    Full prediction endpoint response, used by the /disaster/predict/landslide API.
    Tries the joblib model first, falls back to calibrated heuristic.
    """
    if _model_loaded and _model is not None:
        try:
            import numpy as np

            features = np.array(
                [
                    [
                        rainfall_24h,
                        slope,
                        elevation,
                        cumulative_rainfall_7d,
                        historical_landslides,
                    ]
                ]
            )
            prob = float(_model.predict_proba(features)[0][1])
            prob = min(max(prob, 0.01), 0.99)

            if prob >= 0.70:
                level = "HIGH"
            elif prob >= 0.40:
                level = "MEDIUM"
            else:
                level = "LOW"

            return {
                "risk_level": level,
                "risk_score": round(prob, 2),
                "landslide_probability": round(prob, 4),
                "risk_category": level,
                "model_used": "XGBoost_Landslide_v2",
                "features_used": {
                    "rainfall_24h": rainfall_24h,
                    "slope": slope,
                    "elevation": elevation,
                    "cumulative_rainfall_7d": cumulative_rainfall_7d,
                    "historical_landslides": historical_landslides,
                },
            }
        except Exception as e:
            logger.warning(f"Model inference failed: {e}. Falling back.")

    # ── Calibrated Heuristic Engine ──────────────────────────────────────
    slope_factor = min(max((slope - 15.0) / 30.0, 0.0), 1.0)
    rain_factor = min(rainfall_24h / 200.0, 1.0)
    cumulative_factor = (
        min(cumulative_rainfall_7d / 500.0, 1.0) * 0.15
        if cumulative_rainfall_7d > 0
        else 0.0
    )
    elevation_factor = min(max((elevation - 800) / 1500.0, 0.0), 1.0) * 0.10
    history_factor = min(historical_landslides * 0.12, 0.25)

    raw_score = (
        (rain_factor * 0.45)
        + (slope_factor * 0.30)
        + cumulative_factor
        + elevation_factor
        + history_factor
    )
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
        "landslide_probability": round(score, 4),
        "risk_category": level,
        "model_used": "Landslide_Hydrological_Engine_v2",
        "features_used": {
            "rainfall_24h": rainfall_24h,
            "slope": slope,
            "elevation": elevation,
            "cumulative_rainfall_7d": cumulative_rainfall_7d,
            "historical_landslides": historical_landslides,
        },
    }

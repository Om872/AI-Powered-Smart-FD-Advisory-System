from __future__ import annotations

import joblib
from typing import Any

import numpy as np
import pandas as pd

from app.ml.paths import PIPELINE_PATH
from app.schemas import CustomerBase

_pipeline: Any | None = None


def _load_pipeline():
    global _pipeline
    if _pipeline is not None:
        return _pipeline
    if not PIPELINE_PATH.exists():
        return None
    _pipeline = joblib.load(PIPELINE_PATH)
    return _pipeline


def reload_pipeline():
    global _pipeline
    _pipeline = None
    return _load_pipeline()


def customer_to_frame(payload: CustomerBase) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "age": payload.age,
                "income": float(payload.income),
                "savings": float(payload.savings),
                "risk_level": payload.risk_level,
            }
        ]
    )


def predict_invest_probability(payload: CustomerBase) -> tuple[float, bool]:
    """
    Returns (probability_percent_0_100, model_is_loaded).
    If no trained artifact exists, returns (heuristic, False).
    """
    pipe = _load_pipeline()
    if pipe is None:
        return _heuristic_probability(payload), False

    X = customer_to_frame(payload)
    try:
        proba_positive = float(pipe.predict_proba(X)[0, 1])
    except Exception:
        return _heuristic_probability(payload), False

    pct = float(np.clip(proba_positive * 100.0, 1.0, 99.0))
    return round(pct, 2), True


def _heuristic_probability(payload: CustomerBase) -> float:
    """Fallback when ML artifact missing — aligned with business intuition."""
    risk = {"Low": 12.0, "Medium": 4.0, "High": -6.0}[payload.risk_level]
    score = (
        22.0
        + min(35.0, payload.income / 3500.0)
        + min(30.0, payload.savings / 15000.0)
        + risk
        + (4.0 if payload.age >= 28 else 0.0)
    )
    return round(float(np.clip(score, 5.0, 96.0)), 2)

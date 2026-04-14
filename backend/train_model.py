"""
Train FD conversion classifier and save sklearn pipeline.

Run from backend folder:
  py train_model.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pandas as pd
from joblib import dump
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Ensure backend root is on path
_BACKEND_ROOT = Path(__file__).resolve().parent
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

from app.ml.paths import DATA_DIR, MODELS_DIR, PIPELINE_PATH, TRAINING_CSV  # noqa: E402


def generate_synthetic_dataset(n_samples: int = 2000, random_state: int = 42) -> pd.DataFrame:
    """
    Synthetic but realistic FD conversion labels:
    Higher savings + stable income + conservative risk -> more likely to invest in FD.
    """
    rng = np.random.default_rng(random_state)
    age = rng.integers(22, 66, size=n_samples)
    income = rng.lognormal(mean=np.log(45000), sigma=0.55, size=n_samples).clip(15000, 350000)
    savings = rng.lognormal(mean=np.log(180000), sigma=0.75, size=n_samples).clip(0, 3_000_000)

    risk_levels = rng.choice(["Low", "Medium", "High"], size=n_samples, p=[0.28, 0.52, 0.20])

    risk_num = np.select(
        [risk_levels == "Low", risk_levels == "Medium"],
        [1.0, 0.0],
        default=-0.9,
    )

    # Latent propensity (logistic link) — stronger signal for learnable patterns
    z = (
        -2.2
        + 0.85 * (savings / 100_000)
        + 0.60 * (income / 50_000)
        + 0.12 * (age - 35) / 10
        + 0.80 * risk_num
    )
    p = 1 / (1 + np.exp(-z))
    noise = rng.normal(0, 0.06, size=n_samples)
    p_noisy = np.clip(p + noise, 0.02, 0.98)
    will_invest = (rng.random(n_samples) < p_noisy).astype(int)

    return pd.DataFrame(
        {
            "age": age,
            "income": np.round(income, 2),
            "savings": np.round(savings, 2),
            "risk_level": risk_levels,
            "will_invest": will_invest,
        }
    )


def build_pipeline() -> Pipeline:
    numeric_features = ["age", "income", "savings"]
    categorical_features = ["risk_level"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                categorical_features,
            ),
        ]
    )

    # Hybrid ensemble: calibrated probabilities from LR + RF soft voting
    clf = LogisticRegression(
        max_iter=2000,
        C=0.8,
        class_weight="balanced",
        solver="lbfgs",
        random_state=42,
    )
    rf = RandomForestClassifier(
        n_estimators=300,
        max_depth=10,
        min_samples_leaf=4,
        class_weight="balanced_subsample",
        random_state=42,
        n_jobs=-1,
    )

    from sklearn.ensemble import VotingClassifier

    voting = VotingClassifier(
        estimators=[("lr", clf), ("rf", rf)],
        voting="soft",
        weights=[0.45, 0.55],
    )

    return Pipeline([("prep", preprocessor), ("model", voting)])


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Train FD conversion model")
    parser.add_argument(
        "--force-regenerate",
        action="store_true",
        help="Regenerate synthetic CSV even if fd_training.csv exists",
    )
    args = parser.parse_args()

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    if TRAINING_CSV.exists() and not args.force_regenerate:
        df = pd.read_csv(TRAINING_CSV)
        print(f"Loaded existing dataset: {TRAINING_CSV} ({len(df)} rows)")
    else:
        df = generate_synthetic_dataset()
        df.to_csv(TRAINING_CSV, index=False)
        print(f"Generated synthetic dataset: {TRAINING_CSV} ({len(df)} rows)")

    X = df[["age", "income", "savings", "risk_level"]]
    y = df["will_invest"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipe = build_pipeline()
    pipe.fit(X_train, y_train)

    y_pred = pipe.predict(X_test)
    y_proba = pipe.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    try:
        auc = roc_auc_score(y_test, y_proba)
    except ValueError:
        auc = float("nan")

    print("--- FD conversion model ---")
    print(f"Accuracy: {acc:.4f}")
    print(f"ROC-AUC:  {auc:.4f}")
    print(classification_report(y_test, y_pred, digits=3))

    dump(pipe, PIPELINE_PATH)
    print(f"Saved pipeline to: {PIPELINE_PATH}")


if __name__ == "__main__":
    main()

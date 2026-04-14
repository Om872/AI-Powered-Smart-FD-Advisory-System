
from __future__ import annotations

from app.ml.inference import predict_invest_probability
from app.schemas import CustomerBase, RecommendationResponse

PLAN_RATES = {
    "1 Year FD": 6.75,
    "3 Year FD": 7.40,
    "5 Year FD": 7.95,
}


def _rule_based_scores(payload: CustomerBase) -> dict[str, float]:
    """
    Interpretable rule layer: liquidity, income band, risk, savings size.
    """
    inc = float(payload.income)
    sav = float(payload.savings)
    risk = payload.risk_level

    s1, s3, s5 = 0.0, 0.0, 0.0

    # Savings bucket (primary driver of tenure fit)
    if sav < 60_000:
        s1 += 5.0
        s3 += 1.5
        s5 += 0.0
    elif sav < 200_000:
        s1 += 2.0
        s3 += 4.5
        s5 += 1.5
    elif sav < 600_000:
        s1 += 1.0
        s3 += 4.0
        s5 += 3.5
    else:
        s1 += 0.5
        s3 += 3.0
        s5 += 5.0

    # Monthly income stability
    if inc < 30_000:
        s1 += 3.0
        s3 += 1.5
        s5 += 0.5
    elif inc < 70_000:
        s1 += 1.5
        s3 += 3.5
        s5 += 2.0
    else:
        s1 += 0.5
        s3 += 2.5
        s5 += 3.5

    # Risk appetite (FD is conservative; "High" here = willingness for longer lock-in / growth)
    if risk == "Low":
        s1 += 3.0
        s3 += 2.5
        s5 += 1.0
    elif risk == "Medium":
        s1 += 1.5
        s3 += 4.0
        s5 += 2.5
    else:
        s1 += 0.5
        s3 += 2.5
        s5 += 4.5

    return {"1 Year FD": s1, "3 Year FD": s3, "5 Year FD": s5}


def _ml_nudge_scores(
    conversion_pct: float, payload: CustomerBase
) -> dict[str, float]:
    """
    ML layer: higher predicted FD conversion slightly favors longer tenure when liquidity allows.
    """
    sav = float(payload.savings)
    # Normalize conversion to roughly [-1, 1] around 50% midpoint
    t = (conversion_pct - 50.0) / 50.0
    t = max(-1.0, min(1.0, t))

    s1, s3, s5 = 0.0, 0.0, 0.0
    if sav < 80_000:
        # Limited corpus: ML can still nudge toward 3Y if model is confident
        s1 += max(0.0, -t) * 1.2
        s3 += abs(t) * 1.0
        s5 += max(0.0, t) * 0.3
    else:
        s5 += max(0.0, t) * 2.2
        s3 += abs(t) * 1.1
        s1 += max(0.0, -t) * 1.0

    return {"1 Year FD": s1, "3 Year FD": s3, "5 Year FD": s5}


def recommend_fd_plan(payload: CustomerBase) -> RecommendationResponse:
    conversion_pct, ml_loaded = predict_invest_probability(payload)

    rule = _rule_based_scores(payload)
    ml_nudge = _ml_nudge_scores(conversion_pct, payload)

    combined = {
        k: rule[k] + ml_nudge[k]
        for k in ("1 Year FD", "3 Year FD", "5 Year FD")
    }
    selected_plan = max(combined, key=combined.get)

    interest_rate = PLAN_RATES[selected_plan]
    estimated_annual_return = round(payload.savings * (interest_rate / 100), 2)

    top_rule = max(rule, key=rule.get)
    rationale_parts = [
        f"Rule layer favors {top_rule} (liquidity, income, risk profile).",
        (
            f"ML conversion score {conversion_pct:.1f}% "
            f"({'trained model' if ml_loaded else 'heuristic fallback'}) "
            f"nudges tenure selection."
        ),
        f"Final blend highest score: {selected_plan} (combined weighting).",
    ]
    rationale = " ".join(rationale_parts)

    return RecommendationResponse(
        recommended_plan=selected_plan,
        interest_rate=interest_rate,
        estimated_annual_return=estimated_annual_return,
        rationale=rationale,
    )

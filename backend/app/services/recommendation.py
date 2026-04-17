
from __future__ import annotations

from app.ml.inference import predict_invest_probability
from app.schemas import CustomerBase, RecommendationResponse

# ─── Real Shubhanjana Co-operative Deposit Plans ─────────────────────────────
SHUBHANJANA_PLANS = {
    # Callable FD
    "FD 6M":   {"type": "Callable FD",   "tenure": "6 Months",  "rate": 6.10, "min_savings": 0},
    "FD 12M":  {"type": "Callable FD",   "tenure": "12 Months", "rate": 6.25, "min_savings": 0},
    "FD 24M":  {"type": "Callable FD",   "tenure": "24 Months", "rate": 6.75, "min_savings": 30000},
    "FD 36M":  {"type": "Callable FD",   "tenure": "36 Months", "rate": 7.25, "min_savings": 50000},
    "FD 60M":  {"type": "Callable FD",   "tenure": "60 Months", "rate": 7.90, "min_savings": 100000},
    "FD 120M": {"type": "Callable FD",   "tenure": "120 Months","rate": 8.90, "min_savings": 200000},
    # Non-Callable FD
    "NCFD 18M": {"type": "Non-Callable FD", "tenure": "18 Months", "rate": 8.00, "min_savings": 50000},
    "NCFD 24M": {"type": "Non-Callable FD", "tenure": "24 Months", "rate": 8.25, "min_savings": 50000},
    "NCFD 36M": {"type": "Non-Callable FD", "tenure": "36 Months", "rate": 8.50, "min_savings": 75000},
    "NCFD 42M": {"type": "Non-Callable FD", "tenure": "42 Months", "rate": 8.75, "min_savings": 75000},
    "NCFD 48M": {"type": "Non-Callable FD", "tenure": "48 Months", "rate": 9.00, "min_savings": 100000},
    "NCFD 54M": {"type": "Non-Callable FD", "tenure": "54 Months", "rate": 9.25, "min_savings": 100000},
    "NCFD 60M": {"type": "Non-Callable FD", "tenure": "60 Months", "rate": 9.50, "min_savings": 150000},
    "NCFD 66M": {"type": "Non-Callable FD", "tenure": "66 Months", "rate": 9.75, "min_savings": 150000},
    "NCFD 72M": {"type": "Non-Callable FD", "tenure": "72 Months", "rate": 10.50,"min_savings": 200000},
    "NCFD 120M":{"type": "Non-Callable FD", "tenure": "120 Months","rate": 11.50,"min_savings": 300000},
    # Recurring Deposit
    "RD 12M":  {"type": "Recurring Deposit", "tenure": "12 Months", "rate": 6.25, "min_savings": 0},
    "RD 24M":  {"type": "Recurring Deposit", "tenure": "24 Months", "rate": 6.75, "min_savings": 0},
    "RD 36M":  {"type": "Recurring Deposit", "tenure": "36 Months", "rate": 7.25, "min_savings": 20000},
    "RD 60M":  {"type": "Recurring Deposit", "tenure": "60 Months", "rate": 7.90, "min_savings": 30000},
    "RD 120M": {"type": "Recurring Deposit", "tenure": "120 Months","rate": 8.90, "min_savings": 50000},
    # Daily Deposit
    "DD 1Y":   {"type": "Daily Deposit", "tenure": "356 Days",  "rate": 5.00, "min_savings": 0},
    "DD 2Y":   {"type": "Daily Deposit", "tenure": "730 Days",  "rate": 6.00, "min_savings": 0},
    "DD 3Y":   {"type": "Daily Deposit", "tenure": "1095 Days", "rate": 7.00, "min_savings": 0},
    "DD 4Y":   {"type": "Daily Deposit", "tenure": "1460 Days", "rate": 8.00, "min_savings": 10000},
    "DD 5Y":   {"type": "Daily Deposit", "tenure": "1825 Days", "rate": 9.00, "min_savings": 10000},
}


def _score_plan(key: str, plan: dict, payload: CustomerBase, conversion_pct: float) -> float:
    """
    Score each plan based on customer profile fit.
    Higher score = better match.
    """
    inc = float(payload.income)
    sav = float(payload.savings)
    risk = payload.risk_level
    age = int(payload.age)
    rate = plan["rate"]
    min_sav = plan["min_savings"]

    # Disqualify if savings too low for plan
    if sav < min_sav:
        return -100.0

    score = 0.0

    # ─ Rate attractiveness (higher rate = more score) ─
    score += rate * 1.5

    # ─ Savings fit ─
    if sav < 50000:
        # Low savings: favor short, callable, DD
        if plan["type"] in ("Callable FD", "Daily Deposit", "Recurring Deposit"):
            score += 4.0
        if "6M" in key or "12M" in key or "1Y" in key or "2Y" in key:
            score += 3.0
    elif sav < 150000:
        # Medium savings: favor medium-term callable/NCFD
        if "24M" in key or "36M" in key or "42M" in key:
            score += 4.0
    elif sav < 500000:
        # Good savings: favor longer NCFD
        if plan["type"] == "Non-Callable FD":
            score += 5.0
        if "48M" in key or "54M" in key or "60M" in key:
            score += 3.0
    else:
        # Large savings: favor premium long-term NCFD
        if plan["type"] == "Non-Callable FD":
            score += 6.0
        if "66M" in key or "72M" in key or "120M" in key:
            score += 5.0

    # ─ Income stability ─
    if inc < 25000:
        # Low income: favor liquid plans
        if plan["type"] in ("Callable FD", "Daily Deposit"):
            score += 3.0
    elif inc < 60000:
        if plan["type"] == "Recurring Deposit":
            score += 2.5
    else:
        if plan["type"] == "Non-Callable FD":
            score += 2.0

    # ─ Risk appetite ─
    if risk == "Low":
        if plan["type"] == "Callable FD":
            score += 4.0
        elif plan["type"] == "Daily Deposit":
            score += 3.0
        elif plan["type"] == "Non-Callable FD":
            score -= 2.0
    elif risk == "Medium":
        if plan["type"] in ("Callable FD", "Non-Callable FD"):
            score += 2.0
        if plan["type"] == "Recurring Deposit":
            score += 3.0
    else:  # High
        if plan["type"] == "Non-Callable FD":
            score += 5.0

    # ─ Age factor ─
    if age >= 60:
        # Senior citizens: +0.5% bonus applicable, favor safer & shorter
        score += 2.0
        if plan["type"] == "Callable FD":
            score += 2.0
    elif age < 30:
        # Young: can lock in longer
        if "60M" in key or "72M" in key or "120M" in key:
            score += 2.0

    # ─ ML conversion nudge ─
    t = (conversion_pct - 50.0) / 50.0
    t = max(-1.0, min(1.0, t))
    if t > 0:
        score += t * rate * 0.3  # High conversion -> favor higher-rate plans
    else:
        score += abs(t) * 1.5  # Low conversion -> favor safe/liquid plans more
        if plan["type"] in ("Callable FD", "Daily Deposit"):
            score += abs(t) * 2.0

    return score


def recommend_fd_plan(payload: CustomerBase) -> RecommendationResponse:
    conversion_pct, ml_loaded = predict_invest_probability(payload)

    # Score all plans
    scored = {}
    for key, plan in SHUBHANJANA_PLANS.items():
        s = _score_plan(key, plan, payload, conversion_pct)
        if s > -50:  # Only consider eligible plans
            scored[key] = s

    if not scored:
        # Fallback to safest plan
        selected_key = "FD 12M"
    else:
        selected_key = max(scored, key=scored.get)

    selected_plan_info = SHUBHANJANA_PLANS[selected_key]
    interest_rate = selected_plan_info["rate"]
    plan_type = selected_plan_info["type"]
    tenure = selected_plan_info["tenure"]

    estimated_annual_return = round(payload.savings * (interest_rate / 100), 2)

    # Build top 3 alternatives
    sorted_plans = sorted(scored.items(), key=lambda x: x[1], reverse=True)
    alternatives = []
    for alt_key, alt_score in sorted_plans[1:4]:
        alt_info = SHUBHANJANA_PLANS[alt_key]
        alternatives.append(f"{alt_info['type']} ({alt_info['tenure']}) @ {alt_info['rate']}%")

    alt_text = ", ".join(alternatives) if alternatives else "No other suitable plans"

    rationale_parts = [
        f"Based on customer profile analysis (Income: ₹{payload.income:,}, Savings: ₹{payload.savings:,}, Risk: {payload.risk_level}), ",
        f"the AI engine recommends {plan_type} for {tenure} at {interest_rate}% p.a. ",
        f"ML conversion score: {conversion_pct:.1f}% ({'trained model' if ml_loaded else 'heuristic fallback'}). ",
        f"Alternative options: {alt_text}.",
    ]
    if payload.age >= 60:
        rationale_parts.append(" Senior Citizen bonus of +0.5% is additionally applicable.")

    rationale = "".join(rationale_parts)

    return RecommendationResponse(
        recommended_plan=f"{plan_type} — {tenure}",
        interest_rate=interest_rate,
        estimated_annual_return=estimated_annual_return,
        rationale=rationale,
    )

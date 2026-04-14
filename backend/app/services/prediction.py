from app.ml.inference import predict_invest_probability
from app.schemas import CustomerBase


def predict_fd_conversion(payload: CustomerBase) -> float:
    probability, _ = predict_invest_probability(payload)
    return probability


def get_confidence_band(probability: float) -> str:
    if probability >= 75:
        return "High"
    if probability >= 45:
        return "Moderate"
    return "Low"

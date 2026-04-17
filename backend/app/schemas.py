from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

RiskLevel = Literal["Low", "Medium", "High"]


class CustomerBase(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    age: int = Field(ge=18, le=100)
    income: float = Field(gt=0)
    savings: float = Field(ge=0)
    risk_level: RiskLevel


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PredictionResponse(BaseModel):
    conversion_probability: float
    will_invest_fd: bool
    confidence_band: Literal["Low", "Moderate", "High"]


class RecommendationResponse(BaseModel):
    recommended_plan: str
    interest_rate: float
    estimated_annual_return: float
    rationale: str


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatContext(BaseModel):
    customer_data: dict | None = None


class ChatbotRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[ChatMessage] = []
    context: ChatContext | None = None

class ChatbotResponse(BaseModel):
    reply: str


class AnalyticsResponse(BaseModel):
    total_customers: int
    predicted_conversion_rate: float
    avg_income: float
    avg_savings: float
    risk_distribution: dict[str, int]


class CustomerListResponse(BaseModel):
    customers: list[CustomerResponse]
    total: int
    page: int
    page_size: int


class MLStatusResponse(BaseModel):
    pipeline_exists: bool
    pipeline_path: str
    model_accuracy: float | None = None
    roc_auc: float | None = None
    training_samples: int | None = None
    confusion_matrix: list[list[int]] | None = None
    feature_importance: dict[str, float] | None = None
    model_comparisons: list[dict[str, str | float]] | None = None
    hint: str


class EnhancedAnalyticsResponse(AnalyticsResponse):
    age_distribution: dict[str, int]
    income_bands: dict[str, int]
    recent_customers: list[CustomerResponse]
    avg_age: float

class LoginRequest(BaseModel):
    pin: str

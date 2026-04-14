from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db dependency to use the testing database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Setup tables
Base.metadata.create_all(bind=engine)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_save_user_and_list():
    # 1. Save a user
    payload = {
        "name": "Test User",
        "age": 30,
        "income": 50000,
        "savings": 100000,
        "risk_level": "Medium"
    }
    response = client.post("/save-user", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test User"
    assert "id" in data
    
    # 2. List customers and check
    response = client.get("/customers")
    assert response.status_code == 200
    list_data = response.json()
    assert list_data["total"] >= 1
    assert any(c["name"] == "Test User" for c in list_data["customers"])

def test_predict_endpoint():
    payload = {
        "name": "Predict Test",
        "age": 45,
        "income": 80000,
        "savings": 200000,
        "risk_level": "Low"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "conversion_probability" in data
    assert "will_invest_fd" in data
    assert "confidence_band" in data

def test_recommend_endpoint():
    payload = {
        "name": "Rec Test",
        "age": 25,
        "income": 30000,
        "savings": 10000,
        "risk_level": "High"
    }
    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "recommended_plan" in data
    assert "interest_rate" in data
    assert "rationale" in data

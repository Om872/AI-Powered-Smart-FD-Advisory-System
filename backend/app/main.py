from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import Base, engine, get_db
from app.ml.paths import PIPELINE_PATH, TRAINING_CSV
from app.services.chatbot import get_chatbot_reply
from app.services.prediction import get_confidence_band, predict_fd_conversion
from app.services.recommendation import recommend_fd_plan

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-Based FD Advisory & Intelligence API",
    version="0.2.0",
    description="Backend API for FD conversion prediction, plan recommendation, customer history, and analytics.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Health & Root ───────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "message": "AI-Based FD Advisory API is running",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)


# ─── Auth ────────────────────────────────────────────────────────────────────

@app.post("/admin/login")
def login(payload: schemas.LoginRequest):
    # Basic hardcoded check for college project presentation purposes
    if payload.pin == "1234":
        return {"token": "mock_jwt_token_pin_1234", "role": "admin"}
    raise HTTPException(status_code=401, detail="Invalid Security PIN")


# ─── ML Status ───────────────────────────────────────────────────────────────

@app.get("/ml/status", response_model=schemas.MLStatusResponse)
def ml_status():
    accuracy = None
    roc_auc = None
    training_samples = None

    confusion_matrix_data = None
    feature_importance_data = None
    model_comparisons = None

    if TRAINING_CSV.exists():
        try:
            import pandas as pd
            df = pd.read_csv(TRAINING_CSV)
            training_samples = len(df)
        except Exception:
            pass

    # Try to compute metrics from saved pipeline
    if PIPELINE_PATH.exists() and training_samples:
        try:
            import joblib
            import pandas as pd
            from sklearn.metrics import accuracy_score, roc_auc_score, confusion_matrix
            from sklearn.model_selection import train_test_split

            df = pd.read_csv(TRAINING_CSV)
            X = df[["age", "income", "savings", "risk_level"]]
            y = df["will_invest"]
            _, X_test, _, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            pipe = joblib.load(PIPELINE_PATH)
            y_pred = pipe.predict(X_test)
            y_proba = pipe.predict_proba(X_test)[:, 1]
            accuracy = round(float(accuracy_score(y_test, y_pred)) * 100, 2)
            roc_auc = round(float(roc_auc_score(y_test, y_proba)) * 100, 2)
            
            # Confusion Matrix
            cm = confusion_matrix(y_test, y_pred)
            confusion_matrix_data = cm.tolist()
            
            # Feature Importance (from RandomForest in VotingClassifier)
            try:
                voting_clf = pipe.named_steps['classifier']
                rf = voting_clf.estimators_[1] # index 1 is random forest
                importances = rf.feature_importances_
                
                # Get feature names from preprocessor
                preprocessor = pipe.named_steps['preprocessor']
                # Categorical features
                ohe = preprocessor.named_transformers_['cat']
                cat_features = ohe.get_feature_names_out(['risk_level'])
                
                features = ['age', 'income', 'savings'] + list(cat_features)
                feature_importance_data = {f: round(float(imp), 4) for f, imp in zip(features, importances)}
                
                # Sort by importance
                feature_importance_data = dict(sorted(feature_importance_data.items(), key=lambda item: item[1], reverse=True))
            except Exception as e:
                print(f"Could not extract feature importance: {e}")
                pass
            
            # Model Comparison (Base vs Ensemble)
            try:
                voting_clf = pipe.named_steps['classifier']
                lr = voting_clf.estimators_[0]
                rf = voting_clf.estimators_[1]
                # Try to use predict from base models directly if Pipeline allows, else we transform X_test manually
                X_test_transformed = pipe.named_steps['preprocessor'].transform(X_test)
                
                lr_pred = lr.predict(X_test_transformed)
                rf_pred = rf.predict(X_test_transformed)
                
                lr_acc = round(float(accuracy_score(y_test, lr_pred)) * 100, 2)
                rf_acc = round(float(accuracy_score(y_test, rf_pred)) * 100, 2)
                
                model_comparisons = [
                    {"model": "Logistic Regression", "accuracy": lr_acc},
                    {"model": "Random Forest", "accuracy": rf_acc},
                    {"model": "Ensemble (Voting)", "accuracy": accuracy}
                ]
            except Exception as e:
                print(f"Could not compute individual accuracies: {e}")
                pass
                
        except Exception as e:
            print(f"Error computing ML metrics: {e}")
            pass

    return schemas.MLStatusResponse(
        pipeline_exists=PIPELINE_PATH.exists(),
        pipeline_path=str(PIPELINE_PATH),
        model_accuracy=accuracy,
        roc_auc=roc_auc,
        training_samples=training_samples,
        confusion_matrix=confusion_matrix_data,
        feature_importance=feature_importance_data,
        model_comparisons=model_comparisons,
        hint="Run `py train_model.py` from the backend folder to train and save the classifier.",
    )


# ─── Customer CRUD ───────────────────────────────────────────────────────────

@app.post("/save-user", response_model=schemas.CustomerResponse)
def save_user(payload: schemas.CustomerCreate, db: Session = Depends(get_db)):
    customer = models.Customer(
        name=payload.name.strip(),
        age=payload.age,
        income=payload.income,
        savings=payload.savings,
        risk_level=payload.risk_level,
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@app.get("/customers", response_model=schemas.CustomerListResponse)
def list_customers(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.query(models.Customer).count()
    customers = (
        db.query(models.Customer)
        .order_by(models.Customer.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return schemas.CustomerListResponse(
        customers=customers,
        total=total,
        page=page,
        page_size=page_size,
    )


@app.get("/customers/export")
def export_customers(db: Session = Depends(get_db)):
    import csv
    import io
    
    customers = db.query(models.Customer).order_by(models.Customer.created_at.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Age", "Income", "Savings", "Risk Level", "Created At"])
    
    for c in customers:
        writer.writerow([c.id, c.name, c.age, c.income, c.savings, c.risk_level, c.created_at.isoformat()])
        
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=customers_export.csv"}
    )


@app.get("/customers/{customer_id}", response_model=schemas.CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


# ─── Prediction & Recommendation ─────────────────────────────────────────────

@app.post("/predict", response_model=schemas.PredictionResponse)
def predict(payload: schemas.CustomerCreate):
    probability = predict_fd_conversion(payload)
    return schemas.PredictionResponse(
        conversion_probability=probability,
        will_invest_fd=probability >= 50,
        confidence_band=get_confidence_band(probability),
    )


@app.post("/recommend", response_model=schemas.RecommendationResponse)
def recommend(payload: schemas.CustomerCreate):
    return recommend_fd_plan(payload)


# ─── Chatbot ─────────────────────────────────────────────────────────────────

@app.post("/chatbot", response_model=schemas.ChatbotResponse)
def chatbot(payload: schemas.ChatbotRequest):
    reply = get_chatbot_reply(payload)
    return schemas.ChatbotResponse(reply=reply)


# ─── Analytics ────────────────────────────────────────────────────────────────

@app.get("/analytics", response_model=schemas.AnalyticsResponse)
def analytics(db: Session = Depends(get_db)):
    total_customers = db.query(models.Customer).count()

    if total_customers == 0:
        return schemas.AnalyticsResponse(
            total_customers=0,
            predicted_conversion_rate=0,
            avg_income=0,
            avg_savings=0,
            risk_distribution={"Low": 0, "Medium": 0, "High": 0},
        )

    avg_income = float(db.query(func.avg(models.Customer.income)).scalar() or 0)
    avg_savings = float(db.query(func.avg(models.Customer.savings)).scalar() or 0)

    risk_rows = (
        db.query(models.Customer.risk_level, func.count(models.Customer.id))
        .group_by(models.Customer.risk_level)
        .all()
    )
    risk_distribution = {"Low": 0, "Medium": 0, "High": 0}
    for risk_level, count in risk_rows:
        risk_distribution[risk_level] = int(count)

    # Proxy conversion estimate from customer profiles for admin view.
    predicted_conversion_rate = round(
        min(95.0, max(5.0, 32.0 + (avg_savings / 30000.0) + (avg_income / 20000.0))), 2
    )

    return schemas.AnalyticsResponse(
        total_customers=total_customers,
        predicted_conversion_rate=predicted_conversion_rate,
        avg_income=round(avg_income, 2),
        avg_savings=round(avg_savings, 2),
        risk_distribution=risk_distribution,
    )


@app.get("/analytics/enhanced", response_model=schemas.EnhancedAnalyticsResponse)
def enhanced_analytics(db: Session = Depends(get_db)):
    base = analytics(db)

    # Age distribution
    customers = db.query(models.Customer).all()
    age_buckets = {"18-25": 0, "26-35": 0, "36-45": 0, "46-55": 0, "56+": 0}
    income_bands = {"<30K": 0, "30K-60K": 0, "60K-1L": 0, "1L-2L": 0, "2L+": 0}

    for c in customers:
        if c.age <= 25:
            age_buckets["18-25"] += 1
        elif c.age <= 35:
            age_buckets["26-35"] += 1
        elif c.age <= 45:
            age_buckets["36-45"] += 1
        elif c.age <= 55:
            age_buckets["46-55"] += 1
        else:
            age_buckets["56+"] += 1

        if c.income < 30000:
            income_bands["<30K"] += 1
        elif c.income < 60000:
            income_bands["30K-60K"] += 1
        elif c.income < 100000:
            income_bands["60K-1L"] += 1
        elif c.income < 200000:
            income_bands["1L-2L"] += 1
        else:
            income_bands["2L+"] += 1

    avg_age = float(db.query(func.avg(models.Customer.age)).scalar() or 0)

    recent = (
        db.query(models.Customer)
        .order_by(models.Customer.created_at.desc())
        .limit(5)
        .all()
    )

    return schemas.EnhancedAnalyticsResponse(
        **base.model_dump(),
        age_distribution=age_buckets,
        income_bands=income_bands,
        recent_customers=recent,
        avg_age=round(avg_age, 1),
    )


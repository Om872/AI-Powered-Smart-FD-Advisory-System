# 🏦 AI-Based FD Advisory & Intelligence System

> An AI-powered Fixed Deposit advisory platform built for **Shubhanjana Co-operative Society** that predicts FD conversion probability, recommends optimal plan tenure, and provides intelligent customer guidance through an integrated chatbot.

---

## 📌 Problem Statement

Co-operative banks rely on manual assessment to identify which customers are likely to invest in Fixed Deposits. This leads to missed opportunities, suboptimal plan recommendations, and inefficient customer advisory. This system automates the FD advisory workflow using Machine Learning and AI.

---

## 🏗️ System Architecture (PPT-Ready)

```mermaid
graph TD
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    classDef model fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff
    classDef db fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    classDef external fill:#64748b,stroke:#334155,stroke-width:2px,color:#fff

    subgraph "Frontend Client (React 19 + Vite)"
        UI[User Interface Dashboard]:::frontend
        Forms[Customer Intake Forms]:::frontend
        Charts[Recharts Analytics]:::frontend
        Chat[Chatbot Widget]:::frontend
    end

    subgraph "Backend API (FastAPI)"
        API[REST API Router]:::backend
        Auth[Auth Middleware]:::backend
        Rec[Hybrid Recommendation Engine]:::backend
        ChatService[LLM Chat Service]:::backend
    end

    subgraph "Machine Learning Engine"
        Sklearn[scikit-learn Pipeline]:::model
        Ensemble[VotingClassifier<br>RF + Logistic Regression]:::model
        Metrics[XAI Metrics Extractor]:::model
    end

    subgraph "Data Storage"
        SQLite[(SQLite Database)]:::db
        Joblib[(.joblib Artifact)]:::db
    end

    GPT[OpenRouter API<br>GPT-4o-mini]:::external

    %% Connections
    UI <-->|HTTP/JSON| API
    Forms -->|POST /save-user| API
    Charts <-->|GET /analytics| API
    Chat <-->|POST /chatbot| API

    API <--> Auth
    API --> Sklearn
    API --> Rec
    API --> ChatService
    
    Sklearn --- Ensemble
    Sklearn --- Metrics
    Sklearn <..>|Load Model| Joblib
    
    API <-->|SQLAlchemy ORM| SQLite
    ChatService <-->|REST API| GPT

```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, Recharts |
| **Backend** | Python, FastAPI, Uvicorn |
| **Database** | SQLite + SQLAlchemy ORM |
| **ML Model** | scikit-learn (VotingClassifier: Logistic Regression + Random Forest) |
| **AI Chatbot** | OpenRouter API (GPT-4o-mini) with domain-specific prompting |
| **Data** | Synthetic data generation with statistically realistic distributions |

---

## 🧠 Key Features

### 1. FD Conversion Prediction
- Binary classification: Will customer invest in FD? (Yes/No with probability %)
- Trained on 1,200 synthetic customer profiles
- Features: Age, Monthly Income, Savings, Risk Level
- Confidence bands: Low / Moderate / High

### 2. Hybrid FD Plan Recommendation
- **Rule Layer**: Interpretable scoring based on savings bucket, income stability, and risk appetite
- **ML Nudge Layer**: Model confidence adjusts tenure preference (1Y / 3Y / 5Y FD)
- **Explainability**: Natural language rationale for every recommendation

### 3. AI Advisory Chatbot
- GPT-4o-mini powered chatbot with Shubhanjana Co-operative persona
- Responds to FD queries, interest rate calculations, and savings guidance
- Supports Hinglish (Hindi-English) communication style

### 4. Admin Analytics Dashboard
- Real-time KPIs: Total customers, conversion rate, avg income/savings
- Charts: Risk distribution (Pie), Age distribution (Bar), Income bands (Bar)
- ML Model health: Accuracy, ROC-AUC, training samples
- Auto-generated insights from real customer data

### 5. Customer History & Tracking
- Paginated customer records table
- Tracks all analyzed profiles with date, risk level, and financial details
- Supports per-customer lookup via API

---

## 📊 ML Model Details

| Metric | Value |
|--------|-------|
| **Algorithm** | VotingClassifier (Logistic Regression + Random Forest) |
| **Training Data** | 2,000 synthetic samples (stratified 80/20 split) |
| **Accuracy** | 68.75% |
| **ROC-AUC** | 76.34% |
| **Preprocessing** | StandardScaler (numerics) + OneHotEncoder (risk_level) |
| **Fallback** | Heuristic probability function when model artifact is missing |

### Why Synthetic Data?
Real customer data is PII-protected and confidential. The synthetic data generator uses log-normal distributions, logistic link functions with noise, and realistic Indian demographic parameters to simulate co-operative banking customers.

### Why Ensemble Over Deep Learning?
For structured tabular data with 4 features, ensemble tree methods consistently outperform neural networks (ref: Grinsztajn et al., 2022). The VotingClassifier combines LR's calibrated probabilities with RF's non-linear patterns.

---

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt

# Train the ML model
python train_model.py

# Start API server
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `backend/.env`:
```
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/ml/status` | ML model accuracy, ROC-AUC, status |
| `POST` | `/save-user` | Save customer profile to DB |
| `POST` | `/predict` | FD conversion probability prediction |
| `POST` | `/recommend` | Hybrid FD plan recommendation |
| `POST` | `/chatbot` | AI chatbot query |
| `GET` | `/customers` | Paginated customer list |
| `GET` | `/customers/{id}` | Individual customer lookup |
| `GET` | `/analytics` | Basic analytics |
| `GET` | `/analytics/enhanced` | Enhanced analytics with distributions |

Full interactive docs: `http://localhost:8000/docs` (Swagger UI)

---

## 📂 Project Structure

```
AI-Based FD Advisory & Intelligence System/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI routes & endpoints
│   │   ├── models.py            # SQLAlchemy ORM models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── database.py          # Database engine & session
│   │   ├── ml/
│   │   │   ├── inference.py     # ML prediction & heuristic fallback
│   │   │   └── paths.py         # File path constants
│   │   └── services/
│   │       ├── chatbot.py       # OpenRouter GPT integration
│   │       ├── prediction.py    # Prediction wrapper & confidence bands
│   │       └── recommendation.py # Hybrid rule + ML recommendation
│   ├── train_model.py           # Model training & evaluation script
│   ├── data/                    # Training CSV (generated)
│   ├── models/                  # Saved pipeline (.joblib)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/               # HomePage, AnalysisPage, AdminPage, etc.
│   │   ├── components/          # Navbar, Hero, CustomerForm, ChatbotWidget
│   │   └── services/api.js      # API client functions
│   ├── package.json
│   └── vite.config.js
└── DEPLOYMENT.md
```

---

## 👨‍💻 Developed By

**Om Namdev** — AI & Data Science Student  
Internship Project for **Shubhanjana Co-operative Society**

---

## 📄 License

This project is developed as part of an internship program. All rights reserved.

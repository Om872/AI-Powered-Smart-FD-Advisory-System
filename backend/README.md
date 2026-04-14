# Backend - AI FD Advisory API

## Setup

```bash
cd backend
py -m pip install -r requirements.txt
```

## Run API

```bash
cd backend
py -m uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `GET /health`
- `GET /ml/status` — trained classifier file present or not
- `POST /save-user`
- `POST /predict` — **classification**: FD invest probability (%) + yes/no (uses trained model if present)
- `POST /recommend` — **hybrid**: rule-based scores + ML conversion nudge for best FD plan
- `POST /chatbot`

## Machine learning (FD conversion)

1. **Train** (creates `data/fd_training.csv` if missing, saves `models/fd_conversion_pipeline.joblib`):

   ```bash
   cd backend
   py train_model.py
   ```

   Regenerate synthetic data and retrain:

   ```bash
   py train_model.py --force-regenerate
   ```

2. **Model**: `ColumnTransformer` (scaled numerics + one-hot risk) + **VotingClassifier** (Logistic Regression + Random Forest, soft voting, balanced classes).

3. **Inference**: `/predict` loads the pipeline from disk; if the file is missing, a **heuristic fallback** runs so the API still works.

4. **Recommendation**: combines **interpretable rules** (savings, income, risk) with an **ML nudge** from the same conversion probability (longer tenure gets a small boost when the model is confident and liquidity allows).

## OpenRouter Setup (for chatbot)

Create `.env` in `backend`:

```bash
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```

## Swagger Docs

- `http://127.0.0.1:8000/docs`

from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = BACKEND_ROOT / "data"
MODELS_DIR = BACKEND_ROOT / "models"
TRAINING_CSV = DATA_DIR / "fd_training.csv"
PIPELINE_PATH = MODELS_DIR / "fd_conversion_pipeline.joblib"

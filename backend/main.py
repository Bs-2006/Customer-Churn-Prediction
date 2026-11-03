"""
Customer Churn Prediction API

FastAPI backend that loads pre-trained sklearn artifacts with joblib and
serves predictions to the React frontend (25-field schema).
"""

from pathlib import Path
from typing import Literal
import warnings

import joblib
import numpy as np
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sklearn.exceptions import InconsistentVersionWarning


# ---------------------------------------------------------------------------
# Warnings
# ---------------------------------------------------------------------------

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)


# ---------------------------------------------------------------------------
# Exact 25-field customer schema (reduced-feature model)
# ---------------------------------------------------------------------------

FEATURES: list[str] = [
    "Gender",
    "Age",
    "Married",
    "Dependents",
    "Tenure in Months",
    "Offer",
    "Phone Service",
    "Multiple Lines",
    "Internet Service",
    "Internet Type",
    "Online Security",
    "Online Backup",
    "Device Protection Plan",
    "Premium Tech Support",
    "Streaming TV",
    "Streaming Movies",
    "Streaming Music",
    "Unlimited Data",
    "Contract",
    "Paperless Billing",
    "Payment Method",
    "Monthly Charge",
    "Total Charges",
    "Satisfaction Score",
    "CLTV",
]


# ---------------------------------------------------------------------------
# Artifact loading
# ---------------------------------------------------------------------------

BASE = Path(__file__).resolve().parent


def _load_artifact(filename: str):
    path = BASE / filename

    if not path.exists():
        raise FileNotFoundError(f"Missing model artifact: {path}")

    try:
        return joblib.load(path)
    except Exception as exc:
        raise RuntimeError(
            f"Failed to load {filename}: {exc}"
        ) from exc


model = _load_artifact("churn_model.pkl")
preprocessor = _load_artifact("churn_preprocessor.pkl")
scaler = _load_artifact("churn_scaler.pkl")


# ---------------------------------------------------------------------------
# Artifact validation
# ---------------------------------------------------------------------------

def _validate_artifacts() -> None:
    artifact_features = list(
        getattr(preprocessor, "feature_names_in_", [])
    )

    if artifact_features != FEATURES:
        raise RuntimeError(
            "The preprocessor artifact does not expect the expected "
            f"{len(FEATURES)} fields (got {len(artifact_features)})."
        )

    n_out = scaler.n_features_in_

    if model.n_features_in_ != n_out:
        raise RuntimeError(
            f"Scaler expects {n_out} features but the model expects "
            f"{model.n_features_in_}."
        )

    if len(FEATURES) != 25:
        raise RuntimeError(
            f"Expected 25 raw features, got {len(FEATURES)}."
        )

    if n_out != 52:
        raise RuntimeError(
            f"Expected 52 preprocessed features, got {n_out}."
        )


# ---------------------------------------------------------------------------
# Startup smoke test
# ---------------------------------------------------------------------------

def _smoke_test_pipeline() -> None:
    """
    Run one full transform + prediction at startup so that
    /predict cannot fail later because of an artifact mismatch.
    """

    cat_name, cat_trans, cat_cols = next(
        (n, t, c)
        for n, t, c in preprocessor.transformers_
        if n == "cat"
    )

    template: dict[str, object] = {}

    # Use the first known category for every categorical feature.
    for i, col in enumerate(cat_cols):
        template[col] = str(cat_trans.categories_[i][0])

    # Give numerical features a simple default value.
    for col in FEATURES:
        template.setdefault(col, 0.0)

    df = pd.DataFrame(
        [template],
        columns=FEATURES
    )

    # Preprocessing
    X = preprocessor.transform(df)

    if hasattr(X, "toarray"):
        X = X.toarray()

    X = scaler.transform(
        np.asarray(X, dtype=float)
    )

    # Check feature count
    if X.shape[1] != scaler.n_features_in_:
        raise RuntimeError(
            f"Pipeline produced {X.shape[1]} features, "
            f"scaler expects {scaler.n_features_in_}."
        )

    # Test prediction
    model.predict_proba(X)
    model.predict(X)


# Validate everything when FastAPI starts importing.
_validate_artifacts()
_smoke_test_pipeline()


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Churn Prediction API",
    version="2.0.0"
)


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request schema — exactly the 25 model fields
# ---------------------------------------------------------------------------

class CustomerInput(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        populate_by_name=True
    )

    # Personal Information

    gender: str = Field(
        ...,
        alias="Gender",
        min_length=1
    )

    age: int = Field(
        ...,
        alias="Age",
        ge=18,
        le=100
    )

    married: str = Field(
        ...,
        alias="Married",
        min_length=1
    )

    dependents: str = Field(
        ...,
        alias="Dependents",
        min_length=1
    )

    # Tenure & Offer

    tenure_in_months: int = Field(
        ...,
        alias="Tenure in Months",
        ge=0,
        le=120
    )

    offer: str = Field(
        ...,
        alias="Offer",
        min_length=1
    )

    # Phone & Internet Services

    phone_service: str = Field(
        ...,
        alias="Phone Service",
        min_length=1
    )

    multiple_lines: str = Field(
        ...,
        alias="Multiple Lines",
        min_length=1
    )

    internet_service: str = Field(
        ...,
        alias="Internet Service",
        min_length=1
    )

    internet_type: str = Field(
        ...,
        alias="Internet Type",
        min_length=1
    )

    # Online Services

    online_security: str = Field(
        ...,
        alias="Online Security",
        min_length=1
    )

    online_backup: str = Field(
        ...,
        alias="Online Backup",
        min_length=1
    )

    device_protection_plan: str = Field(
        ...,
        alias="Device Protection Plan",
        min_length=1
    )

    premium_tech_support: str = Field(
        ...,
        alias="Premium Tech Support",
        min_length=1
    )

    streaming_tv: str = Field(
        ...,
        alias="Streaming TV",
        min_length=1
    )

    streaming_movies: str = Field(
        ...,
        alias="Streaming Movies",
        min_length=1
    )

    streaming_music: str = Field(
        ...,
        alias="Streaming Music",
        min_length=1
    )

    unlimited_data: str = Field(
        ...,
        alias="Unlimited Data",
        min_length=1
    )

    # Contract & Billing

    contract: str = Field(
        ...,
        alias="Contract",
        min_length=1
    )

    paperless_billing: str = Field(
        ...,
        alias="Paperless Billing",
        min_length=1
    )

    payment_method: str = Field(
        ...,
        alias="Payment Method",
        min_length=1
    )

    # Financial Information

    monthly_charge: float = Field(
        ...,
        alias="Monthly Charge",
        ge=0
    )

    total_charges: float = Field(
        ...,
        alias="Total Charges",
        ge=0
    )

    # Customer Metrics

    satisfaction_score: int = Field(
        ...,
        alias="Satisfaction Score",
        ge=1,
        le=5
    )

    cltv: int = Field(
        ...,
        alias="CLTV",
        ge=0
    )


# ---------------------------------------------------------------------------
# Response schema
# ---------------------------------------------------------------------------

class ExplanationItem(BaseModel):
    feature: str
    value: object
    contribution: float


class Explanations(BaseModel):
    increasing_churn_risk: list[ExplanationItem] = Field(default_factory=list)
    reducing_churn_risk: list[ExplanationItem] = Field(default_factory=list)


class PredictionResponse(BaseModel):
    prediction: Literal["CHURN", "NOT CHURN"]

    churn_probability: float = Field(
        ...,
        ge=0,
        le=1
    )

    risk_level: Literal[
        "LOW",
        "MEDIUM",
        "HIGH"
    ]

    explanations: Explanations = Field(
        default_factory=Explanations
    )


# ---------------------------------------------------------------------------
# Risk calculation
# ---------------------------------------------------------------------------

def _risk_level(probability: float) -> str:

    if probability < 0.40:
        return "LOW"

    if probability <= 0.70:
        return "MEDIUM"

    return "HIGH"


# ---------------------------------------------------------------------------
# ML prediction pipeline
# ---------------------------------------------------------------------------

def _run_pipeline(
    customer: CustomerInput
) -> tuple[str, float, np.ndarray]:

    # Convert request into DataFrame
    df = pd.DataFrame(
        [customer.model_dump(by_alias=True)],
        columns=FEATURES
    )

    # Preprocessing
    X = preprocessor.transform(df)

    if hasattr(X, "toarray"):
        X = X.toarray()

    # Scaling
    X = scaler.transform(
        np.asarray(X, dtype=float)
    )

    # Probability
    probability = float(
        model.predict_proba(X)[0][1]
    )

    # Prediction
    prediction = int(
        model.predict(X)[0]
    )

    label = (
        "CHURN"
        if prediction == 1
        else "NOT CHURN"
    )

    return label, probability, X


# ---------------------------------------------------------------------------
# Model explainability (coeff × transformed value)
# ---------------------------------------------------------------------------

_TOP_K = 3


def _processed_feature_names() -> list[str]:
    """Map each of the 52 processed columns back to a raw feature name."""
    raw_names = list(preprocessor.get_feature_names_out())
    mapped: list[str] = []

    for name in raw_names:
        if name.startswith("cat__"):
            body = name[len("cat__"):]
            # Column names and categories never contain '_', so the first
            # '_' separates the original feature from the one-hot category.
            base = body.split("_", 1)[0]
            mapped.append(base)
        elif name.startswith("remainder__"):
            mapped.append(name[len("remainder__"):])
        else:
            mapped.append(name.split("__", 1)[-1])

    return mapped


# Built once at import time from the fitted preprocessor.
_PROCESSED_TO_RAW = _processed_feature_names()


def _build_explanations(
    X: np.ndarray,
    customer: CustomerInput
) -> Explanations:
    """
    contribution = transformed_value × class-1 coefficient.

    One-hot columns are summed back onto their original raw feature so the
    user only ever sees the 25 human-readable names.
    """
    coefficients = np.asarray(model.coef_[0], dtype=float)
    values = np.asarray(X[0], dtype=float)

    if coefficients.shape != values.shape:
        raise RuntimeError(
            f" coef/value shape mismatch: "
            f"{coefficients.shape} vs {values.shape}"
        )

    contributions = values * coefficients

    raw_values = customer.model_dump(by_alias=True)

    # Aggregate processed contributions by original feature name.
    totals: dict[str, float] = {}
    for raw_feature, contribution in zip(_PROCESSED_TO_RAW, contributions):
        totals[raw_feature] = (
            totals.get(raw_feature, 0.0) + float(contribution)
        )

    items: list[ExplanationItem] = []
    for feature, contribution in totals.items():
        if abs(contribution) < 1e-12:
            continue
        items.append(
            ExplanationItem(
                feature=feature,
                value=raw_values.get(feature),
                contribution=round(contribution, 4),
            )
        )

    items.sort(key=lambda item: abs(item.contribution), reverse=True)

    increasing = [
        item for item in items if item.contribution > 0
    ][:_TOP_K]

    reducing = [
        item for item in items if item.contribution < 0
    ][:_TOP_K]

    return Explanations(
        increasing_churn_risk=increasing,
        reducing_churn_risk=reducing,
    )


# ---------------------------------------------------------------------------
# Health endpoint
# ---------------------------------------------------------------------------

@app.get("/")
def health() -> dict:

    return {
        "status": "ok",
        "service": "Churn Prediction API",
        "features": len(FEATURES),
        "model_loaded": model is not None,
        "preprocessor_loaded": preprocessor is not None,
        "scaler_loaded": scaler is not None,
    }


# ---------------------------------------------------------------------------
# Prediction endpoint
# ---------------------------------------------------------------------------

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(
    customer: CustomerInput
) -> PredictionResponse:

    try:

        label, probability, X = _run_pipeline(
            customer
        )

        explanations = _build_explanations(
            X,
            customer
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {exc}"
        ) from exc

    return PredictionResponse(
        prediction=label,
        churn_probability=round(
            probability,
            4
        ),
        risk_level=_risk_level(
            probability
        ),
        explanations=explanations,
    )


# ---------------------------------------------------------------------------
# Local execution
# ---------------------------------------------------------------------------

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
# Customer Churn Prediction

An end-to-end machine learning application that predicts whether a customer is likely to churn and provides a churn probability, risk level, model-based explanations, and input data validation.

## 🚀 Project Overview

Customer churn occurs when a customer stops using a company's services. Predicting churn in advance can help businesses identify high-risk customers and take appropriate retention actions.

This project uses **Logistic Regression** to predict customer churn based on customer demographics, service usage, contract information, billing details, satisfaction, and customer lifetime value.

The machine learning model is integrated with a **FastAPI backend** and a **React frontend** to provide real-time predictions through an interactive web application.

## ✨ Features

- Customer churn prediction
- Churn probability calculation
- LOW / MEDIUM / HIGH risk classification
- Model explainability with "Why This Prediction?"
- Realistic-data validation
- Form input validation
- Interactive React user interface
- FastAPI REST API
- Saved ML model and preprocessing pipeline
- End-to-end prediction workflow

## 🧠 Machine Learning

### Model

The project uses **Logistic Regression** for binary classification.

The target variable is:

- `0` → No Churn
- `1` → Churn

Hyperparameter tuning was performed using `GridSearchCV`.

The final model uses:

```text
C = 10
```

### Model Performance

The final model achieved:

| Metric | Score |
|---|---:|
| Accuracy | **95.74%** |
| Churn Precision | **95%** |
| Churn Recall | **89%** |
| Churn F1-Score | **92%** |

The model was evaluated using a stratified train-test split.

## 📊 Features Used

The final model uses **25 customer features**.

### Customer Profile

- Gender
- Age
- Married
- Dependents

### Customer Relationship

- Tenure in Months

### Services

- Offer
- Phone Service
- Multiple Lines
- Internet Service
- Internet Type
- Online Security
- Online Backup
- Device Protection Plan
- Premium Tech Support
- Streaming TV
- Streaming Movies
- Streaming Music
- Unlimited Data

### Contract & Billing

- Contract
- Paperless Billing
- Payment Method

### Financial & Customer Value

- Monthly Charge
- Total Charges
- Satisfaction Score
- CLTV

## 🔍 Exploratory Data Analysis

The dataset was analyzed to understand patterns associated with customer churn.

Some important observations included:

- Month-to-month contract customers showed substantially higher churn.
- Customers with shorter tenure were more likely to churn.
- Higher monthly charges were associated with higher churn.
- Fiber Optic customers showed higher churn compared with some other internet types.
- Customers without Online Security showed higher churn.
- Payment method was also associated with differences in churn rates.

These observations describe **associations in the dataset and do not imply causation**.

## 🔎 Model Explainability

The application includes a **"Why This Prediction?"** section.

For each prediction, the application calculates feature contributions using the Logistic Regression coefficients and the customer's transformed feature values.

The application displays:

- Top factors increasing churn risk
- Top factors reducing churn risk

For example:

```text
Increasing churn risk
+ Satisfaction Score
+ Monthly Charge
+ Online Security

Reducing churn risk
- Tenure
- Contract
- Other customer features
```

This helps users understand why the model produced a particular prediction.

## ⚠️ Realistic Data Validation

The application also performs a basic data-quality check before prediction.

For example:

```text
Tenure = 72 months
Monthly Charge = ₹90
Total Charges = ₹90
```

The approximate expected charges are:

```text
72 × ₹90 = ₹6,480
```

Since ₹90 is unusually low compared with the expected amount, the application displays a warning asking the user to verify the entered values.

The warning is **non-blocking**, so the ML prediction can still be generated.

This validation is separate from the machine learning model.

## 🏗️ System Architecture

```text
                    Customer
                       │
                       ▼
               React Frontend
                       │
                       ▼
              Input Validation
                       │
                       ▼
               FastAPI Backend
                       │
                       ▼
              Data Preprocessing
                       │
                       ▼
             Logistic Regression
                       │
              ┌────────┴────────┐
              ▼                 ▼
       Churn Probability    Risk Level
              │
              ▼
        Feature Explanation
              │
              ▼
             React
```

## 🛠️ Tech Stack

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- Joblib
- Jupyter / Google Colab

### Backend

- FastAPI
- Uvicorn
- Pydantic

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Recharts
- React Icons

### Development

- Git
- GitHub
- VS Code

## 📁 Project Structure

```text
Customer-Churn-Prediction/
│
├── backend/
│   ├── main.py
│   ├── churn_model.pkl
│   ├── churn_preprocessor.pkl
│   ├── churn_scaler.pkl
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerForm.jsx
│   │   │   ├── FeatureExplanation.jsx
│   │   │   ├── FeatureSummary.jsx
│   │   │   ├── FormSection.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── PredictionCard.jsx
│   │   │   └── RiskMeter.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── validation/
│   │   │   └── chargesValidation.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── feature_reduction_colab.ipynb
├── .gitignore
└── README.md
```

## ⚙️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Bs-2006/Customer-Churn-Prediction.git
cd Customer-Churn-Prediction
```

### 2. Backend Setup

Go to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### 3. Frontend Setup

Open another terminal and go to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## 🔌 API

### Prediction Endpoint

```text
POST /predict
```

The endpoint accepts the customer's 25 input features and returns:

```json
{
  "prediction": "CHURN",
  "churn_probability": 0.9984,
  "risk_level": "HIGH"
}
```

The response also includes the feature explanations used by the frontend.

## 🧪 Testing

The application was tested with:

- Normal low-risk customer
- Normal high-risk customer
- Unrealistic billing data
- Missing/invalid input

The validation layer correctly displays warnings for suspicious billing combinations while allowing predictions to continue.

## 🎯 Project Goals

The main goals of this project are to:

1. Build a practical machine learning classification model.
2. Understand the complete ML workflow from data preparation to deployment.
3. Integrate an ML model with a REST API.
4. Build an interactive frontend for real-time predictions.
5. Provide interpretable model predictions.
6. Handle unrealistic and invalid user input.

## 🔮 Future Improvements

Possible future improvements include:

- Deploy the frontend and backend publicly.
- Add customer retention recommendations.
- Add model monitoring.
- Add automated retraining pipelines.
- Add authentication and user management.
- Improve data validation using more domain-specific rules.

## 👩‍💻 Author

**Bindhu Madhavi**

B.Tech — Artificial Intelligence and Data Science

---

⭐ If you find this project useful, consider giving the repository a star.
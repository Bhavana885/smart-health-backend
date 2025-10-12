from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)

# ✅ Allow requests from frontend and localhost for testing
CORS(app, origins=[
    "https://smart-health-frontend.onrender.com",  # production frontend
    "http://localhost:5173"                        # local dev frontend
])

# ✅ Base directory (where this script is located)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ Load trained models and scaler with absolute paths
def load_model(filename):
    path = os.path.join(BASE_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")
    with open(path, "rb") as f:
        return pickle.load(f)

try:
    diabetes_model = load_model("diabetes_model.pkl")
    heart_model = load_model("heart_model.pkl")
    hypertension_model = load_model("hypertension_model.pkl")
    scaler = load_model("scaler.pkl")
    print("✅ All models loaded successfully.")
except Exception as e:
    print("❌ Error loading models:", e)
    raise e  # Stop app if models are missing

@app.route("/ai-prediction", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        
        required_fields = [
            "age", "gender", "bmi", "glucose", "cholesterol",
            "systolic_bp", "diastolic_bp", "smoking", "physical_activity"
        ]

        # Validate input
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing input fields"}), 400

        # Prepare input array
        features = np.array([[data[field] for field in required_fields]])
        scaled_features = scaler.transform(features)

        # Predict
        diabetes_risk = float(diabetes_model.predict(scaled_features)[0])
        heart_risk = float(heart_model.predict(scaled_features)[0])
        hypertension_risk = float(hypertension_model.predict(scaled_features)[0])

        result = {
            "prediction": {
                "diabetes": round(diabetes_risk, 2),
                "heart": round(heart_risk, 2),
                "hypertension": round(hypertension_risk, 2)
            },
            "history": []  # Optional
        }

        return jsonify(result)

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

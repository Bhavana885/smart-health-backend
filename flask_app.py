from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app, origins=["https://smart-health-frontend.onrender.com"])  # frontend URL

# Load models
with open("diabetes_model.pkl", "rb") as f:
    diabetes_model = pickle.load(f)
with open("heart_model.pkl", "rb") as f:
    heart_model = pickle.load(f)
with open("hypertension_model.pkl", "rb") as f:
    hypertension_model = pickle.load(f)
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

@app.route("/ai-prediction", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        required_fields = [
            "age", "gender", "bmi", "glucose", "cholesterol",
            "systolic_bp", "diastolic_bp", "smoking", "physical_activity"
        ]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing input fields"}), 400

        features = np.array([[data[field] for field in required_fields]])
        scaled_features = scaler.transform(features)

        diabetes_risk = float(diabetes_model.predict(scaled_features)[0])
        heart_risk = float(heart_model.predict(scaled_features)[0])
        hypertension_risk = float(hypertension_model.predict(scaled_features)[0])

        result = {
            "prediction": {
                "diabetes": round(diabetes_risk, 2),
                "heart": round(heart_risk, 2),
                "hypertension": round(hypertension_risk, 2)
            },
            "history": []  # optional
        }
        return jsonify(result)

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

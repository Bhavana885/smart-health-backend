from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# ✅ Load trained models and scaler
with open(r"C:\Users\bhava\OneDrive\Documents\smart-health-app\diabetes_model.pkl", "rb") as f:
    diabetes_model = pickle.load(f)

with open(r"C:\Users\bhava\OneDrive\Documents\smart-health-app\heart_model.pkl", "rb") as f:
    heart_model = pickle.load(f)

with open(r"C:\Users\bhava\OneDrive\Documents\smart-health-app\hypertension_model.pkl", "rb") as f:
    hypertension_model = pickle.load(f)

with open(r"C:\Users\bhava\OneDrive\Documents\smart-health-app\scaler.pkl", "rb") as f:
    scaler = pickle.load(f)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # ✅ Expected input keys
        required_fields = [
            "age", "gender", "bmi", "glucose", "cholesterol",
            "systolic_bp", "diastolic_bp", "smoking", "physical_activity"
        ]

        # ✅ Validate input
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing input fields"}), 400

        # ✅ Prepare input for prediction
        features = np.array([[data[field] for field in required_fields]])
        scaled_features = scaler.transform(features)

        # ✅ Predict using each model
        diabetes_risk = float(diabetes_model.predict(scaled_features)[0])
        heart_risk = float(heart_model.predict(scaled_features)[0])
        hypertension_risk = float(hypertension_model.predict(scaled_features)[0])

        # ✅ Construct output
        result = {
            "diabetes_risk": round(diabetes_risk, 2),
            "heart_disease_risk": round(heart_risk, 2),
            "hypertension_risk": round(hypertension_risk, 2)
        }

        return jsonify(result)

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)

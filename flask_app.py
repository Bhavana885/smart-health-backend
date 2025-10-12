from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Allow all origins or you can whitelist frontend domain

# Load models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

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
    raise e

@app.route("/ai-prediction", methods=["POST"])
def predict():
    data = request.get_json()
    required_fields = [
        "age", "gender", "bmi", "glucose", "cholesterol",
        "systolic_bp", "diastolic_bp", "smoking", "physical_activity"
    ]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing input fields"}), 400

    features = np.array([[data[field] for field in required_fields]])
    scaled_features = scaler.transform(features)

    result = {
        "prediction": {
            "diabetes": round(float(diabetes_model.predict(scaled_features)[0]), 2),
            "heart": round(float(heart_model.predict(scaled_features)[0]), 2),
            "hypertension": round(float(hypertension_model.predict(scaled_features)[0]), 2)
        },
        "history": []
    }
    return jsonify(result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

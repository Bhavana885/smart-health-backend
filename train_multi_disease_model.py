import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pickle
from sklearn.preprocessing import StandardScaler

# -------------------------------
# Step 1: Load the dataset
# -------------------------------
data = pd.read_csv(r"C:\Users\bhava\OneDrive\Documents\smart-health-app\multi_disease_data.csv")
print("✅ Dataset loaded successfully!")
print(data.head())

# -------------------------------
# Step 2: Define features and labels
# -------------------------------
features = [
    "age", "gender", "bmi", "glucose", "cholesterol",
    "systolic_bp", "diastolic_bp", "smoking", "physical_activity"
]

labels = ["diabetes_risk", "heart_disease_risk", "hypertension_risk"]

X = data[features]
y_diabetes = data["diabetes_risk"]
y_heart = data["heart_disease_risk"]
y_hypertension = data["hypertension_risk"]

# -------------------------------
# Step 3: Normalize features (optional but recommended)
# -------------------------------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Save the scaler for later use in Flask
with open(r"C:\Users\bhava\OneDrive\Documents\smart-health-app\scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

# -------------------------------
# Step 4: Split data into train/test
# -------------------------------
X_train, X_test, y_train_d, y_test_d = train_test_split(X_scaled, y_diabetes, test_size=0.2, random_state=42)
_, _, y_train_h, y_test_h = train_test_split(X_scaled, y_heart, test_size=0.2, random_state=42)
_, _, y_train_ht, y_test_ht = train_test_split(X_scaled, y_hypertension, test_size=0.2, random_state=42)

# -------------------------------
# Step 5: Train RandomForest models
# -------------------------------
rf_diabetes = RandomForestRegressor(n_estimators=100, random_state=42)
rf_diabetes.fit(X_train, y_train_d)

rf_heart = RandomForestRegressor(n_estimators=100, random_state=42)
rf_heart.fit(X_train, y_train_h)

rf_hypertension = RandomForestRegressor(n_estimators=100, random_state=42)
rf_hypertension.fit(X_train, y_train_ht)

# -------------------------------
# Step 6: Save models as .pkl
# -------------------------------
pickle.dump(rf_diabetes, open(r"C:\Users\bhava\OneDrive\Documents\smart-health-app\diabetes_model.pkl", "wb"))
pickle.dump(rf_heart, open(r"C:\Users\bhava\OneDrive\Documents\smart-health-app\heart_model.pkl", "wb"))
pickle.dump(rf_hypertension, open(r"C:\Users\bhava\OneDrive\Documents\smart-health-app\hypertension_model.pkl", "wb"))

print("✅ All models trained and saved successfully!")

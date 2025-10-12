import numpy as np
import pandas as pd

# -------------------------------
# Step 1: Configuration
# -------------------------------
num_records = 150  # number of synthetic patients
np.random.seed(42)  # for reproducibility

# -------------------------------
# Step 2: Generate input features
# -------------------------------

age = np.random.randint(20, 80, num_records)
gender = np.random.choice([0, 1], num_records)  # 0 = Male, 1 = Female
bmi = np.random.normal(26, 5, num_records).clip(15, 45)
glucose = np.random.normal(120, 30, num_records).clip(70, 250)
cholesterol = np.random.normal(200, 40, num_records).clip(100, 350)
systolic_bp = np.random.normal(130, 20, num_records).clip(90, 200)
diastolic_bp = np.random.normal(85, 10, num_records).clip(60, 120)
smoking = np.random.choice([0, 1], num_records, p=[0.7, 0.3])  # 30% smokers
physical_activity = np.random.choice([0, 1], num_records, p=[0.4, 0.6])  # 60% active

# -------------------------------
# Step 3: Generate realistic risk scores (0–10)
# -------------------------------

# Diabetes risk depends on glucose and BMI
diabetes_risk = (
    (glucose / 25) + (bmi / 10) + (age / 50)
)
diabetes_risk = np.clip(diabetes_risk / np.max(diabetes_risk) * 10, 0, 10)

# Heart disease risk depends on cholesterol, smoking, and age
heart_disease_risk = (
    (cholesterol / 30) + (smoking * 4) + (age / 40)
)
heart_disease_risk = np.clip(heart_disease_risk / np.max(heart_disease_risk) * 10, 0, 10)

# Hypertension risk depends on blood pressure and age
hypertension_risk = (
    (systolic_bp / 20) + (diastolic_bp / 15) + (age / 60)
)
hypertension_risk = np.clip(hypertension_risk / np.max(hypertension_risk) * 10, 0, 10)

# -------------------------------
# Step 4: Create DataFrame
# -------------------------------

data = pd.DataFrame({
    "age": age,
    "gender": gender,
    "bmi": np.round(bmi, 1),
    "glucose": np.round(glucose, 1),
    "cholesterol": np.round(cholesterol, 1),
    "systolic_bp": np.round(systolic_bp, 1),
    "diastolic_bp": np.round(diastolic_bp, 1),
    "smoking": smoking,
    "physical_activity": physical_activity,
    "diabetes_risk": np.round(diabetes_risk, 2),
    "heart_disease_risk": np.round(heart_disease_risk, 2),
    "hypertension_risk": np.round(hypertension_risk, 2),
})

# -------------------------------
# Step 5: Save to CSV
# -------------------------------

data.to_csv("multi_disease_data.csv", index=False)
print("✅ Synthetic dataset generated successfully!")
print(f"Total records: {len(data)}")
print("Saved as: multi_disease_data.csv")

# Display first 5 rows
print("\nSample Data:")
print(data.head())

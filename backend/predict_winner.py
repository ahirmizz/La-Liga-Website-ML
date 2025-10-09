import json
import pandas as pd
import joblib
import os

# Make sure champion_predictor folder exists
os.makedirs("champion_predictor", exist_ok=True)

# Load the saved model
model = joblib.load("champion_predictor/la_liga_model_predictor.pkl")

# Load the full season data for predictions (CSV)
df = pd.read_csv("champion_predictor/la_liga_data_2010_2026.csv")

# Select the features the model was trained on
features = ["pts/mp", "gd", "w", "l", "projected_pts"]

# Automatically detect the latest season in the CSV
latest_season = df['season'].max()
df_current = df[df['season'] == latest_season].copy()
print("Predicting win probabilities for season:", latest_season)

# Prepare feature matrix for the latest season
X_test = df_current[features]

# Run predictions
df_current["win_probability"] = model.predict_proba(X_test)[:, 1]

# Convert probabilities to percentages summing to 100%
df_current["win_probability (%)"] = (
    df_current["win_probability"] / df_current["win_probability"].sum() * 100
).round(3)

# Export squad and probability to JSON
results = df_current[["squad", "win_probability (%)"]].to_dict(
    orient="records")

with open("champion_predictor/win_prob.json", "w") as f:
    json.dump(results, f, indent=4)

# Also save as CSV for Flask backend
df_current[["squad", "win_probability (%)"]].to_csv(
    "champion_predictor/predictions.csv", index=False
)
print("Predictions saved to champion_predictor/predictions.csv")

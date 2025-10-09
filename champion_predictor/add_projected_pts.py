import pandas as pd

# Load CSV
df = pd.read_csv("champion_predictor/la_liga_data_2010_2026.csv")

# Add games_left column
df['games_left'] = 38 - df['mp']

# Add projected points column
df["projected_pts"] = df["pts"] + df["games_left"] * df["pts/mp"]

# Save back to the same CSV
df.to_csv("champion_predictor/la_liga_data_2010_2026.csv", index=False)
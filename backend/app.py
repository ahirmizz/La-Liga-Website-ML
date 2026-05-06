from flask import Flask, render_template
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)

# Load trained model
model_path = "champion_predictor/la_liga_model_predictor.pkl"
model = joblib.load(model_path)

# Load historical La Liga data
data_path = "../champion_predictor/la_liga_data_2010_2026.csv"
full_data = pd.read_csv(data_path)

# Prepare historical weight
top3_counts = full_data[full_data['season'] < 2024].groupby(
    'squad')['rk'].apply(lambda x: (x <= 3).sum())
historical_weight = top3_counts / top3_counts.sum()

# Features for prediction
features = ["pts/mp", "gd", "w", "l", "projected_pts"]


@app.route('/predictions')
def predictions():
    # Prepare current season data (2024–25)
    df_test = full_data[full_data['season'] == 2024].copy()

    # Calculate projected points if not already present
    df_test["games_left"] = 38 - df_test["mp"]
    df_test["projected_pts"] = df_test["pts"] + \
        df_test["games_left"] * df_test["pts/mp"]

    X_test = df_test[features]

    # Predict champion probability
    df_test["current_prob"] = model.predict_proba(X_test)[:, 1]
    df_test['historical_weight'] = df_test['squad'].map(
        historical_weight).fillna(0)

    # Combine current season + historical weight
    df_test['combined_prob'] = 0.7 * df_test['current_prob'] + \
        0.3 * df_test['historical_weight']
    df_test['combined_prob (%)'] = df_test['combined_prob'] / \
        df_test['combined_prob'].sum() * 100
    df_test['combined_prob (%)'] = df_test['combined_prob (%)'].round(2)

    # Sort by probability
    df_test_sorted = df_test.sort_values(
        by="combined_prob (%)", ascending=False)

    # Top predicted champion
    top_champion = df_test_sorted.iloc[0].to_dict()

    # Send all predictions to template
    predictions_data = df_test_sorted[['squad', 'pts', 'projected_pts', 'pts/mp',
                                       'gd', 'games_left', 'combined_prob (%)']].to_dict(orient='records')

    return render_template('predictions.html', top_champion=top_champion, predictions=predictions_data)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/teams')
def teams():
    return render_template('teams.html')

@app.route('/real-madrid')
def real_madrid():
    return render_template('real-madrid-players.html')

@app.route('/barcelona')
def barcelona():
    return render_template('barcelona-players.html')

if __name__ == "__main__":
    app.run(debug=True)
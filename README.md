# ⚽ La Liga Zone: Predictive Analytics Platform

A full-stack web application and predictive analytics platform for the La Liga 2025-26 season. The project combines a custom hybrid machine learning pipeline with a responsive web dashboard to showcase real-time squad statistics, automated player card interfaces, and AI-driven championship projections for the 25-26 La Liga season.

## Architectural Overview
The project is built using a clean, three-layer structure to keep the code organized and easy to maintain:
1. **Data & Analytics (Python):** Cleans historical football data (2010–2026), calculates performance metrics, and handles data exceptions before saving the final numbers to data files.
2. **Backend Server (Flask):** Handles web routing, manages page navigation, and loads data safely from the backend to the frontend.
3. **Frontend User Interface (JS/CSS):** Dynamically loads files, uses smart text filtering for the team and player search functions, and runs smooth visual animations.

---

## Built With
* **Data Processing:** Python, Pandas, NumPy, Scikit-Learn
* **Backend Development:** Flask (Python Web Framework)
* **Frontend Web Development:** HTML5, CSS3 (Flexbox and Grid layout), Vanilla JavaScript (ES6+)
* **Design & Icons:** Google Fonts (Maven Pro), IonIcons, FontAwesome

---

## The Prediction Model & Logic

### Main Idea
*A team's historical success combined with their current season pace are the strongest indicators of where they will finish in the table. Teams with a high points-per-match average and a strong goal difference are mathematically more likely to win the league.*

### How the Calculation Works
The system evaluates teams based on two primary factors:
* **Current Season Form:** Points per match (`pts/mp`), Goal Difference (`gd`), and Wins/Losses (`w`/`l`).
* **Pace Projection:** An equation calculates how many points a team is on track to get at the end of the 38-game season:
$$\text{Projected Points} = \text{Current Points} + ((38 - \text{Matches Played}) \times \text{Points Per Match})$$
* **Historical Weighting:** To keep things balanced, the final score uses a blend of $70\%$ current season performance data and $30\%$ historical top-3 finish trends. This prevents newly promoted teams from breaking the calculation.

---

## Folder Structure
```text
├── app.py                      # Flask backend server and routes
├── winner_predictor/
│   └── predictor_pipeline.py   # Python script that processes data and outputs metrics
├── static/
│   ├── css/
│   │   └── styles.css          # Visual layout styling and flip-card animations
│   ├── js/
│   │   └── script.js           # Search functions and data loading logic
│   └── data/
│       ├── players.json        # Squad rosters and image paths
│       ├── player_stats.json   # Individual player match stats
│       └── predicted_champions.json # Calculations exported from the Python script
└── templates/
    ├── index.html              # Homepage with championship predictions
    ├── templates/teams.html    # Searchable list of all La Liga clubs
    └── real_madrid.html        # Interactive team roster views
```

---

## Technical Challenges & Fixes

### 1. Handling Promoted Teams (Python)
* **The Problem:** Teams recently promoted to the top league had no historical top-3 stats. Multiplying empty data fields caused calculation errors that crashed the code.
* **The Fix:** Used the Pandas library to automatically find these blank fields and replace them with a default value of `0` (`.fillna(0)`), allowing the calculation script to run without crashing.

### 2. Matching Names Across Separate Files (JavaScript)
* **The Problem:** Slight spelling differences or special character accents (e.g., `"Éder Militão"` in the roster vs `"eder_militao"` in the statistics file) caused data links to break.
* **The Fix:** Created a JavaScript cleanup utility function that strips out accents, converts text to lowercase, and replaces blank spaces with underscores so player identities link properly:
  ```javascript
  const playerID = (player.id || player.name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
  ```

### 3. Fixing Overlapping Mobile Layouts (CSS)
* **The Problem:** The absolute-positioned sidebar navigation menu overlapped or completely blocked out the team layout grid blocks on narrow screen sizes.
* **The Fix:** Reorganized the container layout tree using a main content wrapper layout block (`.main-wrapper`) and CSS sibling selectors. This dynamically shifts the responsive grid right or left whenever the sidebar expands or collapses.

---

## How to Run the Project Locally
1. Clone the repository to your computer:
   ```bash
   git clone github.com
   cd la-liga-zone
   ```

2. Install the necessary project libraries:
   ```bash
   pip install pandas numpy scikit-learn flask
   ```

3. Run the analysis script to update the numbers:
   ```bash
   python winner_predictor/predictor_pipeline.py
   ```

4. Start the local Flask web server:
   ```bash
   python app.py
   ```
5. Open your web browser and go to: `http://127.0.0.1:5000`

---

## Project Credit
Designed and developed by Annabelle Hirmiz using Flask, HTML/CSS, JavaScript, and Python.

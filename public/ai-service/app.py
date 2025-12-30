from flask import Flask, request, jsonify
from medicine_ai import recommend

app = Flask(__name__)

# ✅ ROOT ROUTE (VERY IMPORTANT)
@app.route("/")
def home():
    return "AI service running"

@app.route("/recommend", methods=["POST"])
def recommend_medicine():
    data = request.get_json()
    symptoms = data.get("symptoms", "")

    result = recommend(symptoms)
    return jsonify(result)

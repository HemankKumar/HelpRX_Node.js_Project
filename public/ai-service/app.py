from flask import Flask, request, jsonify
from medicine_ai import recommend

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def recommend_medicine():
    data = request.get_json()
    symptoms = data.get("symptoms", "")

    result = recommend(symptoms)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

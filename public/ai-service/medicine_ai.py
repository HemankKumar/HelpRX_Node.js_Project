import pandas as pd

df = pd.read_csv("medicine_dataset.csv")

def recommend(symptoms):
    symptoms = symptoms.lower()

    for _, row in df.iterrows():
        if all(word in symptoms for word in row['symptoms'].split()):
            return {
                "disease": row["disease"],
                "medicine": row["medicine"]
            }

    return {
        "disease": "Unknown",
        "medicine": "Consult Doctor"
    }

from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load the model
generator = pipeline("text2text-generation", model="google/flan-t5-small")

@app.route('/predict', methods=['POST'])
def predict():
    ingredients = request.json.get('ingredients')
    if not ingredients:
        return jsonify({'error': 'Ingredients are required'}), 400

    prompt = f"Given these ingredients: {', '.join(ingredients)}, suggest a recipe."

    try:
        result = generator(prompt, max_length=200) 
        predicted_recipe = result[0]['generated_text']
        return jsonify({'recipe': predicted_recipe})
    except Exception as e:
        return jsonify({'error': f"Model inference failed: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
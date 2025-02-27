from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv
import json
import re

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

def clean_json_response(text: str) -> str:
    if not text:
        raise ValueError("Empty response recived from API")
    # Remove any leading/trailing whitespaces
    text = text.strip()
    # Remove thinking process
    text = re.sub(r'<think>[\s\S]*?</think>', '', text)
    # Remove markdown code blocks
    text = re.sub(r'```json\n?|\n?```', '', text)
    # remove remaining whitespaces 
    text = text.strip()
    #Fix invalid escape sequences
    text = text.replace('\\_', '_')  # Replace problematic escape sequence
    # Remove any trailing commas before closing braces/brackets
    text = re.sub(r',(\s*[}\]])', r'\1', text)
    return text

# Initialize Groq client
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

@app.route('/generate', methods=['POST'])
def generate_recipe():
    try:
        data = request.json
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Create a more structured prompt to ensure valid JSON response
        formatted_prompt = f"""
        Create a recipe using these ingredients: {message}
        
        Respond with ONLY a JSON object in this EXACT format, with NO additional text or markdown:
        {{
            "id": "unique_string",
            "name": "recipe_name",
            "ingredients": [
                {{"name": "ingredient_name", "quantity": "amount"}}
            ],
            "instructions": ["step1", "step2"],
            "cookingTime": "time_in_minutes",
            "servings": number,
            "imageUrl": "https://example.com/image.jpg"
        }}
        """
        completion = client.chat.completions.create(
            model="mixtral-8x7b-32768",  
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional chef who creates recipes. Always respond with valid JSON."
                },
                {
                    "role": "user",
                    "content": formatted_prompt
                }
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        # Extract and validate the response
        recipe_response = completion.choices[0].message.content.strip()
        if not recipe_response:
            return jsonify({'error': 'Empty response from API'}), 500
        print("Raw response API", recipe_response)
        cleaned_response = clean_json_response(recipe_response)
        print("Clean Response", cleaned_response)
        
        try:
            parsed_json = json.loads(cleaned_response)
            
            # Validate required fields
            required_fields = ['id', 'name', 'ingredients', 'instructions', 'cookingTime', 'servings', 'imageUrl']
            missing_fields = [field for field in required_fields if field not in parsed_json]
            
            if missing_fields:
                return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 500
                
            return jsonify({'response': cleaned_response})
            
        except json.JSONDecodeError as e:
            print(f"Invalid JSON response: {cleaned_response}")
            print(f"Error details: {str(e)}")
            return jsonify({
                'error': 'Invalid JSON response from API',
                'details': str(e),
                'raw_response': cleaned_response
            }), 500

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
    
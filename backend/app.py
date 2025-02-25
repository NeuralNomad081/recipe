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
    # Remove thinking process
    text = re.sub(r'<think>[\s\S]*?</think>', '', text)
    # Remove markdown code blocks
    text = re.sub(r'```json\n?|\n?```', '', text)
    return text.strip()

# Initialize Groq client
client = Groq(api_key=os.getenv('GROQ_API_KEY'))

@app.route('/generate', methods=['POST'])
def generate_recipe():
    try:
        data = request.json
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        

        completion = client.chat.completions.create(
            model="deepseek-r1-distill-qwen-32b",  
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional chef who creates recipes. Always respond with valid JSON."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        # Extract and validate the response
        recipe_response = completion.choices[0].message.content
        cleaned_response = clean_json_response(recipe_response)
        
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
    app.run(port=3000, debug=True)
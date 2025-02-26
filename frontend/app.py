from flask import Flask, request, jsonify
from flask_cors import CORS
import gorq
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure Gorq
gorq.api_key = os.getenv('GORQ_API_KEY')

@app.route('/generate', methods=['POST'])
def generate_recipe():
    try:
        data = request.json
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Call Gorq API
        response = gorq.Completion.create(
            prompt=message,
            model="gorq-v1",
            max_tokens=1000,
            temperature=0.7,
            system_message="You are a professional chef who creates recipes. Always respond with valid JSON."
        )

        # Extract the response
        recipe_response = response.text

        return jsonify({'response': recipe_response})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Failed to generate recipe'}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)
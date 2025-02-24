from groq import Groq
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

server = Flask(__name__)
load_dotenv()
CORS(server)

@server.route("/generate", methods=['POST'])
def generate_res():
    try:
        message = request.json.get('message')
        if not message:
            return jsonify({"error": "No message provided"}), 400

        client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )

        # Add specific JSON formatting instruction
        formatted_message = f"""
        {message}
        Important: Your response must be a valid JSON object with this exact structure:
        {{
            "id": "string",
            "name": "string",
            "ingredients": [{{"name": "string", "quantity": "string"}}],
            "instructions": ["string"],
            "cookingTime": "string",
            "servings": number,
            "imageUrl": "string"
        }}
        """

        completion = client.chat.completions.create(
            model="deepseek-r1-distill-qwen-32b",
            messages=[
                {
                    "role": "user",
                    "content": formatted_message
                }
            ],
            temperature=0.6,
            max_completion_tokens=4096,
            top_p=0.95,
            stream=False,
            stop=None,
        )

        # Get the response content
        response = completion.choices[0].message.content
        
        # Try to clean and parse the JSON
        response = response.strip()
        if response.startswith("```json"):
            response = response[7:]
        if response.endswith("```"):
            response = response[:-3]
        
        parsed_json = json.loads(response.strip())
        
        # Validate the required fields
        required_fields = ["id", "name", "ingredients", "instructions", "cookingTime", "servings"]
        for field in required_fields:
            if field not in parsed_json:
                return jsonify({
                    "error": f"Missing required field: {field}",
                    "raw_response": response
                }), 500

        return jsonify({"response": response})

    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {str(e)}")
        print(f"Raw response: {response}")
        return jsonify({
            "error": "Invalid JSON received from AI",
            "raw_response": response,
            "details": str(e)
        }), 500
            
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({
            "error": str(e),
            "type": str(type(e).__name__)
        }), 500

if __name__ == "__main__":
    server.run(debug=True, port=3000)
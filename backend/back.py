from groq import Groq
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

server = Flask(__name__)
load_dotenv()
CORS(server)
@server.route("/generate", methods=['POST'])
def generate_res():
    message = request.json.get('message')
    client = Groq(
		api_key=os.environ.get("GROQ_API_KEY"),
	)
    completion = client.chat.completions.create(
		model="deepseek-r1-distill-qwen-32b",
		messages=[
			{
				"role":"user",
				"content": f"respond in json : {message}"
			}
			],
		temperature=0.6,
		max_completion_tokens=4096,
		top_p=0.95,
		stream=False,
		stop=None,
	)
    response= completion.choices[0].message.content
    try:
        import json
        parsed_json = json.loads(response)
        return jsonify({"response": response})
    except json.JSONDecodeError:
        return jsonify({
                "error": "Invalid JSON received from AI",
                "raw_response": response
            }), 500
            
    except Exception as e:
        return jsonify({
            "error": str(e),
            "type": str(type(e).__name__)
        }), 500

if __name__ == "__main__":
    server.run(debug=True, port=3000)
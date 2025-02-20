from flask import Flask, request, jsonify
from dotenv import  dotenv_values
from huggingface_hub import InferenceClient

# Load environment variables from .env file
key = dotenv_values(".env")["Bearer"]


client = InferenceClient(
	provider="fireworks-ai",
	api_key="f{key}"
)

messages = [
	{
		"role": "user",
		"content" : "Hello there can you give me a recipe for a tomato soup"
	}
]

completion = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct", 
	messages=messages, 
	max_tokens=500,
)

print(completion.choices[0].message)
#push to the front end results side
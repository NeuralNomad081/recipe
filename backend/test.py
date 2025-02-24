import os
from dotenv import load_dotenv
load_dotenv()
print(f"Current GROQ_API_KEY: {'set' if os.environ.get('GROQ_API_KEY') else 'not set'}")
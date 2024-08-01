import requests
import json
from dotenv import load_dotenv
import os

def genRecipe(): 
  # Load environment variables from a .env file
  load_dotenv()
  # Access an environment variable
  API_KEY = os.getenv('LLAMA_KEY')

  response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
      "Authorization": f"Bearer {API_KEY}",
    },
    data=json.dumps({
      "model": "meta-llama/llama-3.1-8b-instruct:free",
      "messages": [
        { "role": "user", "content": "Make a quick recipe with [peaches, pears, flour, chicken, sauce]" }
      ]
    })
  )

  


  # Print only the content of the choices field from the response JSON
  try:
      # Attempt to parse the response as JSON
      response_data = response.json()
      retry_after = response.headers.get("Retry-After")
      print(retry_after)
      print(response_data )
      
      # Extract and print the content from the choices field
      if 'choices' in response_data:
          choices = response_data['choices']
          for choice in choices:
              # Extract and print the content field from each choice
              content = choice['message'].get('content', 'No content field found')
              return json.dumps({'recipe':content})
      else:
          return json.dumps({"error": "No 'choices' field found in the response."})
  except json.JSONDecodeError:
      # Handle the case where the response is not valid JSON
      return json.dumps({"error": "Invalid JSON response"})
  

if __name__ == "__main__":
    result = genRecipe()
    print(result)
# GPT3-Chatbot
Part of a Hackathon project

## ENVIRONMENT VARIABLES
To run, this project requires as `.env` file with following variables:

`API_KEY` Your OpenAI GPT-3 KEY

`AUTH_TOKEN` A string required to be passed with each request in the `Authorization` header

## Request format
Example Request:
```
curl -X POST -H "Content-Type: application/json" -d '{"prompt": "Hello, how are you?", "personality": "gaga-bot"}' http://localhost:3000/chat
```

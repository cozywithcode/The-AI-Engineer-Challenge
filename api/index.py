from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI, AzureOpenAI
import os
from dotenv import load_dotenv


load_dotenv()

SYSTEM_PROMPT_PATH = Path(__file__).parent / "system_prompt.txt"
SYSTEM_PROMPT = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8").strip()

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
client = AzureOpenAI(
              azure_endpoint=os.environ["AZURE_API_BASE"],
              api_key=os.environ["AZURE_API_KEY"],
              api_version=os.environ["AZURE_API_VERSION"],
          )

# client = OpenAI(api_key=os.getenv("GEMINI_API_KEY"),
#                 base_url="https://generativelanguage.googleapis.com/v1beta/openai/")

class MessageEntry(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[MessageEntry]

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    if not os.getenv("AZURE_API_KEY"):
        raise HTTPException(status_code=500, detail="AZURE_API_KEY not configured")

    try:
        api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in request.messages:
            api_messages.append({"role": msg.role, "content": msg.content})
        response = client.chat.completions.create(
            model="gpt-5.2-chat",
            messages=api_messages,
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")

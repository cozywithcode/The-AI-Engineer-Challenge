from pathlib import Path
import json
import urllib.request

from fastapi import FastAPI, HTTPException, Depends, Request
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


# ── Auth helpers ──────────────────────────────────────────────────────

def _get_approved_emails() -> set[str]:
    """Load approved emails from APPROVED_EMAILS env var (comma-separated)."""
    raw = os.getenv("APPROVED_EMAILS", "")
    return {e.strip().lower() for e in raw.split(",") if e.strip()}


def _verify_google_id_token(token: str) -> dict:
    """Verify a Google ID token via Google's tokeninfo endpoint."""
    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    try:
        with urllib.request.urlopen(url, timeout=5) as resp:
            return json.loads(resp.read())
    except Exception as exc:
        raise HTTPException(status_code=401, detail=f"Invalid token: {exc}")


def verify_auth(request: Request) -> dict:
    """FastAPI dependency: extract and verify the Google ID token from the Authorization header."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    token = auth_header[len("Bearer "):]
    claims = _verify_google_id_token(token)

    # Validate the token audience matches our Google Client ID
    google_client_id = os.getenv("GOOGLE_CLIENT_ID", "")
    if google_client_id and claims.get("aud") != google_client_id:
        raise HTTPException(status_code=401, detail="Token audience mismatch")

    # Check email is verified
    if claims.get("email_verified") != "true":
        raise HTTPException(status_code=401, detail="Email not verified")

    # Check against approved emails list
    approved = _get_approved_emails()
    email = claims.get("email", "").lower()
    if approved and email not in approved:
        raise HTTPException(status_code=403, detail="Email not in approved list")

    return claims


# ── Models ────────────────────────────────────────────────────────────

class MessageEntry(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[MessageEntry]


# ── Routes ────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(request: ChatRequest, user: dict = Depends(verify_auth)):
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

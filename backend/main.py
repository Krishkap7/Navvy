import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

from agents.itinerary_agent import itinerary_agent, Itinerary

app = FastAPI(title="Navvy Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    prompt: str


@app.post("/generate-itinerary", response_model=Itinerary)
async def generate_itinerary(request: PromptRequest):
    print("Received prompt:", request.prompt)
    if not request.prompt or not request.prompt.strip():
        raise HTTPException(status_code=400, detail="prompt is required")

    result = await itinerary_agent.arun(request.prompt)
    print("Agent result type:", type(result.content))
    print("Agent result:", result.content)
    if result.content is None:
        raise HTTPException(status_code=500, detail="Agent returned no content")
    return result.content


@app.get("/health")
def health():
    return {"status": "ok"}

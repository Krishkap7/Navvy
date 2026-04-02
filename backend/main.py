import os
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

from agents.itinerary_agent import itinerary_agent, Itinerary, RouteSegment
from tools.google_places import get_route_polyline

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

    try:
        result = await asyncio.wait_for(itinerary_agent.arun(request.prompt), timeout=45)
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=504,
            detail="Itinerary generation timed out after 45s. Please retry with a more specific prompt.",
        )
    print("Agent result type:", type(result.content))
    print("Agent result:", result.content)
    if result.content is None:
        raise HTTPException(status_code=500, detail="Agent returned no content")

    itinerary = result.content
    activities = itinerary.activities
    segments = []
    for i in range(len(activities) - 1):
        a, b = activities[i], activities[i + 1]
        polyline = get_route_polyline(a.lat, a.lng, b.lat, b.lng)
        segments.append(RouteSegment(from_index=i, to_index=i + 1, polyline=polyline))
    itinerary.route_segments = segments
    return itinerary


@app.get("/health")
def health():
    return {"status": "ok"}

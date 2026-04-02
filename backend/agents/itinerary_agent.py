from typing import List
from pydantic import BaseModel
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from tools.google_places import GooglePlacesTool


class Activity(BaseModel):
    name: str
    description: str
    category: str  # food | activity | nightlife | sightseeing | shopping
    estimated_time: str
    lat: float
    lng: float
    address: str


class RouteSegment(BaseModel):
    from_index: int
    to_index: int
    polyline: List[List[float]]  # [[lat, lng], ...]


class Itinerary(BaseModel):
    activities: List[Activity]
    route_segments: List[RouteSegment] = []


itinerary_agent = Agent(
    model=OpenAIChat(id="gpt-4o-mini"),
    tools=[GooglePlacesTool()],
    output_schema=Itinerary,
    structured_outputs=True,
    tool_call_limit=15,
    instructions=[
        "You are Navvy, a personal travel concierge AI.",
        "Your job: build a 3-5 activity itinerary using REAL, SPECIFIC named places you already know about.",
        "Strategy: first decide which specific named venues to include (e.g. 'Zingerman's Deli', 'The Blind Pig'), then call search_places ONCE per place using its exact name and city (e.g. 'Zingerman's Deli Ann Arbor') to get real coordinates.",
        "search_places works best with specific venue names, NOT broad category searches like 'restaurants in Ann Arbor'.",
        "Only call search_places. Do not call any routing tools.",
        "If a search returns no results, try a slightly different spelling or skip that place and pick another you know.",
        "Use the lat and lng values returned by the tool directly — do not invent coordinates.",
        "Categories must be one of: food, activity, nightlife, sightseeing, shopping.",
        "estimated_time should be a time range like '7:00 PM - 8:30 PM'.",
        "Do not fabricate addresses; use the address returned by tool results.",
    ],
)

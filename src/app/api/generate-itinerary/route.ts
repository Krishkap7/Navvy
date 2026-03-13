import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Navvy, a personal travel concierge AI. Given a user's request, generate a short itinerary of 3-5 activities.

Return ONLY valid JSON — no markdown, no explanation. Use this exact format:
[
  {
    "name": "Place Name",
    "description": "One sentence about what to do here",
    "category": "food | activity | nightlife | sightseeing | shopping",
    "estimated_time": "7:00 PM - 8:30 PM",
    "lat": 42.2808,
    "lng": -83.7430,
    "address": "123 Main St, Ann Arbor, MI"
  }
]

Use real places with accurate coordinates when possible. Order activities chronologically.`;

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";
    const cleaned = raw.replace(/^```json\s*/, "").replace(/```\s*$/, "");
    const activities = JSON.parse(cleaned);

    return NextResponse.json({ activities });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("generate-itinerary error:", message);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}

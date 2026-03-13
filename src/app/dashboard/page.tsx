"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Activity } from "@/lib/types";
import ItineraryCard from "@/components/ItineraryCard";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function PlanTab() {
  const [prompt, setPrompt] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setActivities([]);

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to generate itinerary");

      const data = await res.json();
      setActivities(data.activities);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-bold">Plan</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Plan a date night in Ann Arbor..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {loading ? "..." : "Go"}
          </button>
        </div>
      </form>

      <div className="flex-1 px-4 min-h-0">
        <div className="h-52 mb-3">
          <Map activities={activities} />
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-2">{error}</p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-6 w-6 border-2 border-black border-t-transparent rounded-full" />
          </div>
        )}

        {!loading && activities.length > 0 && (
          <div className="space-y-2 overflow-y-auto pb-4">
            {activities.map((activity, i) => (
              <ItineraryCard key={i} activity={activity} index={i} />
            ))}
          </div>
        )}

        {!loading && activities.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-sm">
            <p>Tell Navvy what you want to do.</p>
            <p className="text-xs mt-1">
              e.g. &quot;Brunch spots and a museum in downtown Detroit&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

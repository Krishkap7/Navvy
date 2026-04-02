"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Activity } from "@/lib/types";
import ItineraryCard from "@/components/ItineraryCard";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function PlanPage() {
  const [prompt, setPrompt] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setActivities([]);

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setActivities(data.activities);
    } catch {
      setError("Could not reach the backend. Make sure it's running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex">
      {/* ── Left sidebar ── */}
      <aside className="w-96 flex-shrink-0 border-r border-gray-100 flex flex-col bg-white">
        {/* Search / prompt */}
        <div className="flex-shrink-0 p-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Plan your day
          </p>
          <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A romantic evening in Ann Arbor with dinner and a walk along the river…"
              className="w-full bg-transparent px-3.5 pt-3.5 pb-2 text-sm placeholder-gray-400 focus:outline-none resize-none leading-relaxed"
              rows={4}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
              }}
            />
            <div className="flex items-center justify-between px-3.5 pb-3">
              <span className="text-xs text-gray-300">⌘↵ to generate</span>
              <button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                {loading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  "Generate →"
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading skeleton */}
          {loading && (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 p-4 animate-pulse"
                >
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-full" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activity cards */}
          {activities.length > 0 && !loading && (
            <div className="p-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Itinerary · {activities.length} stops
              </p>
              {activities.map((activity, i) => (
                <ItineraryCard key={i} activity={activity} index={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {activities.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl mb-3">
                🗺️
              </div>
              <p className="text-sm font-medium text-gray-600">
                Describe your day above
              </p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                We&apos;ll plan a full itinerary and pin it on the map
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ── Map (fills remaining space) ── */}
      <div className="flex-1 relative">
        <Map activities={activities} />
      </div>
    </div>
  );
}

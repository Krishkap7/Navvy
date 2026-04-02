"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Activity, RouteSegment } from "@/lib/types";
import ItineraryCard from "@/components/ItineraryCard";

function buildGoogleMapsUrl(activities: Activity[]): string {
  const first = activities[0];
  const last = activities[activities.length - 1];
  const middle = activities.slice(1, -1);
  const params = new URLSearchParams({
    api: "1",
    origin: `${first.lat},${first.lng}`,
    destination: `${last.lat},${last.lng}`,
    travelmode: "walking",
  });
  if (middle.length > 0) {
    params.set("waypoints", middle.map((a) => `${a.lat},${a.lng}`).join("|"));
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function buildAppleMapsUrl(activities: Activity[]): string {
  const [first, ...rest] = activities;
  const base = `https://maps.apple.com/?saddr=${first.lat},${first.lng}`;
  const dests = rest.map((a) => `daddr=${a.lat},${a.lng}`).join("&");
  return `${base}&${dests}&dirflg=w`;
}

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function PlanPage() {
  const [prompt, setPrompt] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setActivities([]);
    setRouteSegments([]);

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setActivities(data.activities);
      setRouteSegments(data.route_segments ?? []);
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

              {/* Export to maps */}
              {activities.length >= 2 && (
                <div className="pt-1 space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Open route in
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={buildGoogleMapsUrl(activities)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <GoogleMapsIcon />
                      Google Maps
                    </a>
                    <a
                      href={buildAppleMapsUrl(activities)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <AppleMapsIcon />
                      Apple Maps
                    </a>
                  </div>
                </div>
              )}
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
        <Map activities={activities} routeSegments={routeSegments} />
      </div>
    </div>
  );
}

function GoogleMapsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function AppleMapsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 8 12 12 14 14" />
    </svg>
  );
}

"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Activity } from "@/lib/types";

const DEFAULT_CENTER: [number, number] = [42.2808, -83.743];

export default function Map({ activities }: { activities: Activity[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(DEFAULT_CENTER, 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    if (activities.length > 0) {
      const bounds = L.latLngBounds([]);

      activities.forEach((a, i) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:black;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)">${i + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker([a.lat, a.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${a.name}</b><br/>${a.address}`);

        bounds.extend([a.lat, a.lng]);
      });

      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [activities]);

  return <div ref={containerRef} className="w-full h-full rounded-xl z-0" />;
}

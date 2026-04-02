"use client";

import { useEffect, useRef } from "react";
import L, { type Map as LMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Activity } from "@/lib/types";

const DEFAULT_CENTER: [number, number] = [42.2808, -83.743]; // Ann Arbor fallback
const DEFAULT_ZOOM = 13;

export default function Map({ activities }: { activities: Activity[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const activityLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false, // we'll add it in a custom position
    });

    // Custom zoom control (top-right)
    L.control.zoom({ position: "topright" }).addTo(map);

    // CartoDB Positron — clean light tiles
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Layer group for activity markers
    const activityLayer = L.layerGroup().addTo(map);
    activityLayerRef.current = activityLayer;

    mapRef.current = map;

    // Geolocate user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          if (!mapRef.current) return; // component unmounted before callback fired
          const { latitude: lat, longitude: lng } = coords;

          // Google-Maps-style blue dot
          const dotIcon = L.divIcon({
            className: "",
            html: `<div style="position:relative;width:20px;height:20px">
              <div style="position:absolute;inset:-6px;background:rgba(66,133,244,0.18);border-radius:50%"></div>
              <div style="position:absolute;inset:0;background:#4285f4;border-radius:50%;border:2.5px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,0.25)"></div>
            </div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          L.marker([lat, lng], { icon: dotIcon, zIndexOffset: 1000 })
            .addTo(mapRef.current)
            .bindTooltip("You are here", { permanent: false, direction: "top" });

          mapRef.current.setView([lat, lng], 14);
        },
        () => {
          // Geolocation denied — stay on default
        },
        { timeout: 6000 }
      );
    }

    // Ensure Leaflet sees the correct container size
    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      map.remove();
      mapRef.current = null;
      activityLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update activity markers whenever activities change
  useEffect(() => {
    const layer = activityLayerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;

    layer.clearLayers();

    if (activities.length === 0) return;

    const bounds: [number, number][] = [];

    activities.forEach((activity, i) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:30px;height:30px;background:#111;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-family:system-ui,-apple-system,sans-serif;border:2.5px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.3);cursor:pointer;">${i + 1}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      L.marker([activity.lat, activity.lng], { icon })
        .addTo(layer)
        .bindPopup(
          `<div style="font-family:system-ui,-apple-system,sans-serif;padding:12px 14px;min-width:160px">
            <div style="font-weight:600;font-size:13px;color:#111;margin-bottom:4px">${activity.name}</div>
            <div style="font-size:11px;color:#6b7280;line-height:1.4">${activity.address}</div>
            <div style="margin-top:6px;font-size:11px;color:#9ca3af">${activity.estimated_time}</div>
          </div>`,
          { maxWidth: 240 }
        );

      bounds.push([activity.lat, activity.lng]);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 15);
    }
  }, [activities]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

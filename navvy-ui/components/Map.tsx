"use client";

import { useEffect, useRef } from "react";
import type { Activity, RouteSegment } from "@/lib/types";
import { getCurrentLocation, loadGoogleMaps } from "../lib/googleMaps";

const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 42.2808, lng: -83.743 };
const DEFAULT_ZOOM = 13;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface MapProps {
  activities: Activity[];
  routeSegments?: RouteSegment[];
}

export default function Map({ activities, routeSegments = [] }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const locateUserRef = useRef<(() => void) | null>(null);
  const itineraryInfoRef = useRef<google.maps.InfoWindow | null>(null);
  const placesInfoRef = useRef<google.maps.InfoWindow | null>(null);
  const userLocationMarkerRef = useRef<google.maps.Marker | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const routeRef = useRef<google.maps.Polyline | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const activitiesRef = useRef(activities);
  const routeSegmentsRef = useRef(routeSegments);

  useEffect(() => {
    activitiesRef.current = activities;
    routeSegmentsRef.current = routeSegments;
  }, [activities, routeSegments]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!GOOGLE_MAPS_API_KEY) {
      console.error(
        "[Map] Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. Add it to navvy-ui/.env.local and restart the dev server."
      );
      return;
    }

    let destroyed = false;

    const init = async () => {
      await loadGoogleMaps(GOOGLE_MAPS_API_KEY);
      if (destroyed || !containerRef.current) return;

      const currentLocation = await getCurrentLocation();
      if (destroyed || !containerRef.current) return;

      const map = new google.maps.Map(containerRef.current, {
        center: currentLocation ?? DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        clickableIcons: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      mapRef.current = map;
      itineraryInfoRef.current = new google.maps.InfoWindow();
      placesInfoRef.current = new google.maps.InfoWindow();
      if (currentLocation) {
        userLocationMarkerRef.current = upsertUserLocationMarker(
          map,
          userLocationMarkerRef.current,
          currentLocation
        );
        if (activitiesRef.current.length === 0) {
          map.setCenter(currentLocation);
          map.setZoom(16);
        }
      }

      const recenterToUser = async () => {
        const location = await getCurrentLocation(20000);
        if (!location || !mapRef.current) {
          console.warn(
            "[Map] Could not fetch current location. Check browser permission and OS location settings."
          );
          return;
        }
        userLocationMarkerRef.current = upsertUserLocationMarker(
          mapRef.current,
          userLocationMarkerRef.current,
          location
        );
        if (activitiesRef.current.length === 0) {
          mapRef.current.panTo(location);
          mapRef.current.setZoom(Math.max(mapRef.current.getZoom() ?? DEFAULT_ZOOM, 16));
        }
      };
      locateUserRef.current = () => {
        void recenterToUser();
      };
      if (!currentLocation) {
        void recenterToUser();
      }

      listenersRef.current.push(
        map.addListener("click", (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
          const placeId = "placeId" in event ? event.placeId : undefined;
          if (!placeId || !event.latLng || !placesInfoRef.current) return;
          event.stop();
          const placesService = new google.maps.places.PlacesService(map);
          placesService.getDetails(
            {
              placeId,
              fields: ["name", "formatted_address", "rating", "url"],
            },
            (place, status) => {
              if (
                status !== google.maps.places.PlacesServiceStatus.OK ||
                !place ||
                !placesInfoRef.current
              ) {
                return;
              }

              const name = place.name ?? "Place";
              const address = place.formatted_address ?? "";
              const rating =
                typeof place.rating === "number" ? `Rating: ${place.rating.toFixed(1)}` : "";
              const site = place.url
                ? `<a href="${place.url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline">Open in Google Maps</a>`
                : "";

              placesInfoRef.current.setPosition(event.latLng);
              placesInfoRef.current.setContent(
                `<div style="font-family:system-ui,-apple-system,sans-serif;padding:8px 10px;max-width:240px">
                  <div style="font-weight:600;font-size:13px;color:#111">${escapeHtml(name)}</div>
                  ${address ? `<div style="font-size:11px;color:#6b7280;margin-top:4px">${escapeHtml(address)}</div>` : ""}
                  ${rating ? `<div style="font-size:11px;color:#6b7280;margin-top:4px">${rating}</div>` : ""}
                  ${site ? `<div style="font-size:11px;margin-top:6px">${site}</div>` : ""}
                </div>`
              );
              placesInfoRef.current.open({ map });
            }
          );
        })
      );

      if (activitiesRef.current.length > 0) {
        renderActivities(
          map,
          itineraryInfoRef,
          markersRef,
          routeRef,
          activitiesRef.current,
          routeSegmentsRef.current
        );
      }
    };

    init().catch(() => {
      console.error("[Map] Failed to initialize Google Maps.");
    });

    return () => {
      destroyed = true;
      listenersRef.current.forEach((listener) => listener.remove());
      listenersRef.current = [];
      clearMapOverlays(markersRef, routeRef);
      userLocationMarkerRef.current?.setMap(null);
      userLocationMarkerRef.current = null;
      itineraryInfoRef.current?.close();
      placesInfoRef.current?.close();
      itineraryInfoRef.current = null;
      placesInfoRef.current = null;
      locateUserRef.current = null;
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    renderActivities(map, itineraryInfoRef, markersRef, routeRef, activities, routeSegments);
  }, [activities, routeSegments]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      {!GOOGLE_MAPS_API_KEY && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.94)",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "10px 14px",
              color: "#374151",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Missing Google Maps API key. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local.
          </div>
        </div>
      )}
      {GOOGLE_MAPS_API_KEY && activities.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid #e5e7eb",
              borderRadius: 9999,
              padding: "8px 12px",
              color: "#4b5563",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Waiting for itinerary data to place markers...
          </div>
        </div>
      )}
      {GOOGLE_MAPS_API_KEY && (
        <button
          type="button"
          onClick={() => locateUserRef.current?.()}
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            background: "rgba(255,255,255,0.95)",
            padding: "8px 10px",
            fontSize: 12,
            color: "#374151",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          Use my location
        </button>
      )}
    </div>
  );
}

function renderActivities(
  map: google.maps.Map,
  itineraryInfoRef: React.MutableRefObject<google.maps.InfoWindow | null>,
  markersRef: React.MutableRefObject<google.maps.Marker[]>,
  routeRef: React.MutableRefObject<google.maps.Polyline | null>,
  activities: Activity[],
  routeSegments: RouteSegment[]
) {
  clearMapOverlays(markersRef, routeRef);
  if (activities.length === 0) return;

  const infoWindow = itineraryInfoRef.current ?? new google.maps.InfoWindow();
  itineraryInfoRef.current = infoWindow;

  const bounds = new google.maps.LatLngBounds();
  activities.forEach((activity, index) => {
    const position = { lat: activity.lat, lng: activity.lng };
    const marker = new google.maps.Marker({
      map,
      position,
      title: activity.name,
      label: {
        text: String(index + 1),
        color: "#ffffff",
        fontWeight: "700",
      },
    });

    marker.addListener("click", () => {
      infoWindow.setContent(
        `<div style="font-family:system-ui,-apple-system,sans-serif;padding:10px 12px;max-width:240px">
          <div style="font-weight:600;font-size:13px;color:#111">${escapeHtml(activity.name)}</div>
          <div style="font-size:11px;color:#6b7280;line-height:1.4;margin-top:4px">${escapeHtml(activity.address)}</div>
          <div style="font-size:11px;color:#9ca3af;margin-top:6px">${escapeHtml(activity.estimated_time)}</div>
        </div>`
      );
      infoWindow.open({ map, anchor: marker });
    });

    markersRef.current.push(marker);
    bounds.extend(position);
  });

  if (activities.length > 1) {
    map.fitBounds(bounds, 80);
  } else {
    map.setCenter(bounds.getCenter());
    map.setZoom(15);
  }

  if (routeSegments.length > 0) {
    const routePath: google.maps.LatLngLiteral[] = [];
    routeSegments.forEach((segment, index) => {
      const converted = segment.polyline.map(([lat, lng]) => ({ lat, lng }));
      routePath.push(...(index === 0 ? converted : converted.slice(1)));
    });
    routeRef.current = new google.maps.Polyline({
      map,
      path: routePath,
      geodesic: true,
      strokeColor: "#111111",
      strokeOpacity: 0.7,
      strokeWeight: 4,
    });
    return;
  }

  if (activities.length >= 2) {
    const service = new google.maps.DirectionsService();
    void service.route(
      {
        origin: { lat: activities[0].lat, lng: activities[0].lng },
        destination: {
          lat: activities[activities.length - 1].lat,
          lng: activities[activities.length - 1].lng,
        },
        waypoints: activities.slice(1, -1).map((activity) => ({
          location: { lat: activity.lat, lng: activity.lng },
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status !== google.maps.DirectionsStatus.OK || !result) return;
        const path = result.routes[0]?.overview_path?.map((point) => point.toJSON()) ?? [];
        routeRef.current = new google.maps.Polyline({
          map,
          path,
          geodesic: true,
          strokeColor: "#111111",
          strokeOpacity: 0.7,
          strokeWeight: 4,
        });
      }
    );
  }
}

function clearMapOverlays(
  markersRef: React.MutableRefObject<google.maps.Marker[]>,
  routeRef: React.MutableRefObject<google.maps.Polyline | null>
) {
  markersRef.current.forEach((marker) => marker.setMap(null));
  markersRef.current = [];
  if (routeRef.current) {
    routeRef.current.setMap(null);
    routeRef.current = null;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function upsertUserLocationMarker(
  map: google.maps.Map,
  existing: google.maps.Marker | null,
  location: google.maps.LatLngLiteral
): google.maps.Marker {
  if (existing) {
    existing.setPosition(location);
    existing.setMap(map);
    return existing;
  }

  return new google.maps.Marker({
    map,
    position: location,
    title: "Your location",
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 11,
      fillColor: "#2563eb",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 3,
    },
    zIndex: 1000,
  });
}

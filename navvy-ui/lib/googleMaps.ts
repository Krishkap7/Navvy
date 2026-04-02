declare global {
  interface Window {
    __googleMapsLoaderPromise?: Promise<void>;
  }
}

export async function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.google?.maps) return;
  if (window.__googleMapsLoaderPromise) {
    await window.__googleMapsLoaderPromise;
    return;
  }

  window.__googleMapsLoaderPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });

  await window.__googleMapsLoaderPromise;
}

export function getCurrentLocation(timeoutMs = 12000): Promise<google.maps.LatLngLiteral | null> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 30000 }
    );
  });
}

export {};

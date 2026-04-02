import json
import os

from agno.tools import Toolkit
import googlemaps
from googlemaps.convert import decode_polyline


class GooglePlacesTool(Toolkit):
    def __init__(self):
        api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_MAPS_API_KEY is required for GooglePlacesTool")
        self.client = googlemaps.Client(key=api_key, timeout=10)
        super().__init__(name="google_maps", tools=[self.search_places])

    def search_places(self, query: str) -> str:
        """
        Search Google Places for real venues matching a query.
        Returns a list of places with name, address, lat, lng, and rating.

        Args:
            query (str): Search query, e.g. "best Italian restaurants in San Francisco"

        Returns:
            JSON string with a list of place objects containing name, address, lat, lng, rating.
        """
        print(f"[GooglePlaces] searching: {query}")
        try:
            result = self.client.places(query=query)
            print(f"[GooglePlaces] status: {result.get('status')}, results: {len(result.get('results', []))}")
            places = []
            for p in result.get("results", [])[:5]:
                loc = p["geometry"]["location"]
                places.append({
                    "name": p["name"],
                    "address": p.get("formatted_address", ""),
                    "lat": loc["lat"],
                    "lng": loc["lng"],
                    "rating": p.get("rating"),
                })
            return json.dumps(places)
        except Exception as e:
            print(f"[GooglePlaces] error: {e}")
            return json.dumps([])

def get_route_polyline(
    lat1: float, lng1: float, lat2: float, lng2: float
) -> list[list[float]]:
    """
    Convenience function for API route building. Uses Google Directions walking route.
    """
    try:
        api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        if not api_key:
            return [[lat1, lng1], [lat2, lng2]]
        client = googlemaps.Client(key=api_key, timeout=10)
        routes = client.directions(
            origin=(lat1, lng1),
            destination=(lat2, lng2),
            mode="walking",
        )
        if not routes:
            return [[lat1, lng1], [lat2, lng2]]

        encoded = routes[0].get("overview_polyline", {}).get("points")
        if not encoded:
            return [[lat1, lng1], [lat2, lng2]]

        decoded = decode_polyline(encoded)
        return [[point["lat"], point["lng"]] for point in decoded]
    except Exception as e:
        print(f"[GoogleRoutes] routing error: {e}, falling back to straight line")
        return [[lat1, lng1], [lat2, lng2]]

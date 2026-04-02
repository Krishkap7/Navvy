import json
import os

from agno.tools import Toolkit
import googlemaps


class GooglePlacesTool(Toolkit):
    def __init__(self):
        self.client = googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"), timeout=10)
        super().__init__(name="google_places", tools=[self.search_places])

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

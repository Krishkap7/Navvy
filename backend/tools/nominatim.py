import json
import requests
from agno.tools import Toolkit


class NominatimTool(Toolkit):
    def __init__(self):
        super().__init__(name="nominatim", tools=[self.search_places])

    def search_places(self, query: str) -> str:
        """
        Search OpenStreetMap Nominatim for real places matching a query.
        Returns a list of places with name, address, lat, and lng.

        Args:
            query (str): Search query, e.g. "Golden Gate Park San Francisco"

        Returns:
            JSON string with a list of place objects containing name, address, lat, lng.
        """
        print(f"[Nominatim] searching: {query}")
        try:
            resp = requests.get(
                "https://nominatim.openstreetmap.org/search",
                params={"q": query, "format": "json", "limit": 5, "addressdetails": 1},
                headers={"User-Agent": "Navvy/1.0"},
                timeout=10,
            )
            resp.raise_for_status()
            results = resp.json()
            print(f"[Nominatim] got {len(results)} results")
            places = []
            for r in results:
                places.append({
                    "name": r.get("display_name", "").split(",")[0],
                    "address": r.get("display_name", ""),
                    "lat": float(r["lat"]),
                    "lng": float(r["lon"]),
                })
            return json.dumps(places)
        except Exception as e:
            print(f"[Nominatim] error: {e}")
            return json.dumps([])

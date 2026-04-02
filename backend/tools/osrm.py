import requests


def get_route_polyline(
    lat1: float, lng1: float, lat2: float, lng2: float
) -> list[list[float]]:
    """
    Call OSRM to get the road route between two points.
    Returns a list of [lat, lng] pairs representing the route geometry.
    Falls back to a straight line if OSRM is unavailable.
    """
    try:
        url = (
            f"https://router.project-osrm.org/route/v1/driving/"
            f"{lng1},{lat1};{lng2},{lat2}"
            f"?overview=full&geometries=geojson"
        )
        resp = requests.get(url, timeout=10, headers={"User-Agent": "Navvy/1.0"})
        resp.raise_for_status()
        data = resp.json()
        coords = data["routes"][0]["geometry"]["coordinates"]
        # OSRM returns [lng, lat] — flip to [lat, lng] for Leaflet
        return [[c[1], c[0]] for c in coords]
    except Exception as e:
        print(f"[OSRM] routing error: {e}, falling back to straight line")
        return [[lat1, lng1], [lat2, lng2]]

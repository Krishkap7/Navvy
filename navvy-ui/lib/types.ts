export interface Activity {
  name: string;
  description: string;
  category: "food" | "activity" | "nightlife" | "sightseeing" | "shopping";
  estimated_time: string;
  lat: number;
  lng: number;
  address: string;
}

export interface RouteSegment {
  from_index: number;
  to_index: number;
  polyline: [number, number][]; // [lat, lng] pairs
}

export type Itinerary = Activity[];

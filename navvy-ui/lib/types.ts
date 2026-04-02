export interface Activity {
  name: string;
  description: string;
  category: "food" | "activity" | "nightlife" | "sightseeing" | "shopping";
  estimated_time: string;
  lat: number;
  lng: number;
  address: string;
}

export type Itinerary = Activity[];

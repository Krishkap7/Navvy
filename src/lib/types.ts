export interface Activity {
  name: string;
  description: string;
  category: string;
  estimated_time: string;
  lat: number;
  lng: number;
  address: string;
}

export interface Itinerary {
  activities: Activity[];
}

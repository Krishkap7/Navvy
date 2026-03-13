import type { Activity } from "@/lib/types";

const categoryColors: Record<string, string> = {
  food: "bg-orange-100 text-orange-700",
  activity: "bg-blue-100 text-blue-700",
  nightlife: "bg-purple-100 text-purple-700",
  sightseeing: "bg-green-100 text-green-700",
  shopping: "bg-pink-100 text-pink-700",
};

export default function ItineraryCard({
  activity,
  index,
}: {
  activity: Activity;
  index: number;
}) {
  const color = categoryColors[activity.category] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-sm truncate">{activity.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
            {activity.category}
          </span>
        </div>
        <p className="text-xs text-gray-500">{activity.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{activity.estimated_time}</span>
          <span className="truncate">{activity.address}</span>
        </div>
      </div>
    </div>
  );
}

import type { Activity } from "@/lib/types";

const categoryConfig: Record<
  Activity["category"],
  { label: string; color: string }
> = {
  food: { label: "Food", color: "bg-orange-50 text-orange-600 border-orange-100" },
  activity: { label: "Activity", color: "bg-blue-50 text-blue-600 border-blue-100" },
  nightlife: { label: "Nightlife", color: "bg-purple-50 text-purple-600 border-purple-100" },
  sightseeing: { label: "Sightseeing", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  shopping: { label: "Shopping", color: "bg-pink-50 text-pink-600 border-pink-100" },
};

export default function ItineraryCard({
  activity,
  index,
}: {
  activity: Activity;
  index: number;
}) {
  const config = categoryConfig[activity.category] ?? categoryConfig.activity;

  return (
    <div className="flex gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">
            {activity.name}
          </h3>
          <span
            className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.color}`}
          >
            {config.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {activity.description}
        </p>
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <ClockIcon />
          <span>{activity.estimated_time}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
          <PinIcon />
          <span className="truncate">{activity.address}</span>
        </div>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

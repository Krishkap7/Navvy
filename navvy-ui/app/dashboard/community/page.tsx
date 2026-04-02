const groups = [
  {
    name: "Ann Arbor Foodies",
    members: 142,
    lastActive: "2h ago",
    emoji: "🍜",
    description: "Finding the best bites in A2",
  },
  {
    name: "Weekend Explorers",
    members: 89,
    lastActive: "1d ago",
    emoji: "🥾",
    description: "Day trips, hikes, and hidden gems",
  },
  {
    name: "Date Night Crew",
    members: 56,
    lastActive: "3d ago",
    emoji: "✨",
    description: "Romantic spots and evening plans",
  },
  {
    name: "Coffee & Cafes",
    members: 34,
    lastActive: "5d ago",
    emoji: "☕",
    description: "The best third-wave spots around",
  },
  {
    name: "Late Night A2",
    members: 28,
    lastActive: "1w ago",
    emoji: "🌙",
    description: "Bars, shows, and after-hours fun",
  },
];

export default function CommunityPage() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community</h1>
            <p className="text-sm text-gray-500 mt-1">
              Join groups and explore with others
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
            <span>+</span>
            New Group
          </button>
        </div>

        {/* Coming soon banner */}
        <div className="rounded-xl bg-white border border-gray-200 px-5 py-4 mb-6 flex items-center gap-3">
          <span className="text-lg">🚧</span>
          <p className="text-sm text-gray-500">
            Community features are coming soon — here&apos;s a preview of what&apos;s ahead.
          </p>
        </div>

        {/* Groups */}
        <div className="space-y-3">
          {groups.map((group, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 cursor-pointer hover:border-gray-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                {group.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {group.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {group.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                  <span>{group.members} members</span>
                  <span>·</span>
                  <span>Active {group.lastActive}</span>
                </div>
              </div>
              <svg
                className="w-4 h-4 text-gray-300 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

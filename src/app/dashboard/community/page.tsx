const fakeGroups = [
  { name: "Weekend Crew", members: 4, lastActive: "Today" },
  { name: "Detroit Foodies", members: 6, lastActive: "Yesterday" },
  { name: "Spring Break 2026", members: 3, lastActive: "3d ago" },
];

export default function CommunityTab() {
  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Community</h1>
        <button className="rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white">
          + New Group
        </button>
      </div>
      <p className="text-xs text-gray-400">
        Coming soon -- create groups and plan together.
      </p>

      <div className="space-y-3">
        {fakeGroups.map((group, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <h3 className="text-sm font-semibold">{group.name}</h3>
              <p className="text-xs text-gray-400">
                {group.members} members &middot; {group.lastActive}
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-300"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

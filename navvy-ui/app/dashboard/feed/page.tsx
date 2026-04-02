const posts = [
  {
    user: "Sarah M.",
    avatar: "SM",
    text: "Had an amazing time at the Ann Arbor Farmers Market this morning! The produce selection is incredible and the atmosphere is so lively.",
    time: "2h ago",
    place: "Ann Arbor Farmers Market",
  },
  {
    user: "Jake T.",
    avatar: "JT",
    text: "Dinner at Zingerman's Deli was absolutely worth the wait. The Reuben is a masterpiece. 10/10 would recommend to anyone visiting.",
    time: "5h ago",
    place: "Zingerman's Deli",
  },
  {
    user: "Priya K.",
    avatar: "PK",
    text: "The Michigan Theater had an incredible film screening last night. The restored 1920s architecture makes the whole experience magical.",
    time: "1d ago",
    place: "Michigan Theater",
  },
  {
    user: "Marcus L.",
    avatar: "ML",
    text: "Sunrise hike at the Nichols Arboretum — peaceful and absolutely beautiful this time of year. Highly recommend going early.",
    time: "2d ago",
    place: "Nichols Arboretum",
  },
  {
    user: "Elena V.",
    avatar: "EV",
    text: "The Museum of Art on campus has a stunning new exhibition. Free admission on Sundays — definitely worth going.",
    time: "3d ago",
    place: "University of Michigan Museum of Art",
  },
];

export default function FeedPage() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
          <p className="text-sm text-gray-500 mt-1">
            See what the community is discovering
          </p>
        </div>

        {/* Coming soon banner */}
        <div className="rounded-xl bg-white border border-gray-200 px-5 py-4 mb-6 flex items-center gap-3">
          <span className="text-lg">🚧</span>
          <p className="text-sm text-gray-500">
            Community features are coming soon — here&apos;s a preview of what&apos;s ahead.
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-900">
                      {post.user}
                    </span>
                    <span className="text-xs text-gray-400">{post.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {post.text}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{post.place}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

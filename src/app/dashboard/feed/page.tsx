const fakePosts = [
  {
    user: "Aryaman G.",
    text: "Just explored Kerrytown in Ann Arbor -- the farmers market was incredible!",
    time: "2h ago",
  },
  {
    user: "Aaron L.",
    text: "Found an amazing ramen spot in Detroit. Adding it to my itinerary for next week.",
    time: "5h ago",
  },
  {
    user: "Krish K.",
    text: "Weekend trip to Traverse City planned with Navvy. Cherry wine tour here we come.",
    time: "1d ago",
  },
];

export default function FeedTab() {
  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="text-lg font-bold">Feed</h1>
      <p className="text-xs text-gray-400">
        Coming soon -- see what your friends are planning.
      </p>

      <div className="space-y-3">
        {fakePosts.map((post, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{post.user}</span>
              <span className="text-xs text-gray-400">{post.time}</span>
            </div>
            <p className="text-sm text-gray-600">{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

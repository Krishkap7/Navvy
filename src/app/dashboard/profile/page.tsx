"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileTab() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith("navvy_user="));
    if (match) {
      setEmail(decodeURIComponent(match.split("=")[1]));
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "navvy_user=; path=/; max-age=0";
    router.push("/");
    router.refresh();
  };

  return (
    <div className="px-4 pt-4 space-y-6">
      <h1 className="text-lg font-bold">Profile</h1>

      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-1">
        <p className="text-xs text-gray-400">Logged in as</p>
        <p className="text-sm font-semibold">{email ?? "..."}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-500">
          Preferences{" "}
          <span className="text-xs font-normal text-gray-400">
            (coming soon)
          </span>
        </h2>

        <div className="space-y-3">
          <PlaceholderField label="Allergies" placeholder="e.g. peanuts, shellfish" />
          <PlaceholderField label="Dietary Restrictions" placeholder="e.g. vegetarian, halal" />
          <PlaceholderField label="Budget Preference" placeholder="low / medium / high" />
          <PlaceholderField label="Max Walking Distance" placeholder="e.g. 1.5 miles" />
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
      >
        Log out
      </button>
    </div>
  );
}

function PlaceholderField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        disabled
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400"
      />
    </div>
  );
}

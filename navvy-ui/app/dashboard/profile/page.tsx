"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const preferences = [
  { label: "Dietary restrictions", placeholder: "e.g. vegetarian, gluten-free" },
  { label: "Budget", placeholder: "e.g. $20–$50 per meal" },
  { label: "Max walking distance", placeholder: "e.g. 1 mile" },
  { label: "Interests", placeholder: "e.g. art, music, outdoors" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  const initial = email.charAt(0).toUpperCase() || "?";

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gray-900 text-white text-xl font-bold flex items-center justify-center flex-shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{email || "Guest"}</p>
            <p className="text-sm text-gray-400 mt-0.5">Navvy member</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Preferences</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Navvy will use these to personalize your itineraries
            </p>
          </div>
          {preferences.map((pref, i) => (
            <div
              key={pref.label}
              className={`flex items-center justify-between px-5 py-4 ${
                i < preferences.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-sm text-gray-700">{pref.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300 italic">
                  {pref.placeholder}
                </span>
                <span className="text-xs font-medium text-gray-300 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                  Coming soon
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Account</h2>
          </div>
          <div className="px-5 py-4">
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

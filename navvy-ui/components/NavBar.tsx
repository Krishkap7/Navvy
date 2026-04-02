"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Plan" },
  { href: "/dashboard/feed", label: "Feed" },
  { href: "/dashboard/community", label: "Community" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  const initial = email.charAt(0).toUpperCase() || "?";

  return (
    <header className="flex-shrink-0 h-14 flex items-center justify-between px-6 bg-white border-b border-gray-100 z-20">
      {/* Logo */}
      <Link href="/dashboard" className="text-base font-bold tracking-tight hover:opacity-70 transition-opacity">
        Navvy
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <Link
        href="/dashboard/profile"
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
      >
        <span className="text-sm text-gray-500 hidden sm:block">{email}</span>
        <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {initial}
        </div>
      </Link>
    </header>
  );
}

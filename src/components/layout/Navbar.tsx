"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <header className="px-6 h-14 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
        <span className="font-medium text-sm">NodeWave Todo</span>
      </div>
      <div className="flex items-center gap-3">
        {user?.role === "ADMIN" && (
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-xs">Admin</Button>
          </Link>
        )}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-medium">
            {initials}
          </div>
          <span className="text-sm text-gray-500">{user?.fullName?.split(" ")[0]}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="text-xs h-7 px-3"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
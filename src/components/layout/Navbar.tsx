"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="border-b bg-background">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/todos" className="font-semibold text-lg">
          NodeWave Todo
        </Link>
        <div className="flex items-center gap-4">
          {user?.role === "ADMIN" && (
            <Link href="/admin">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>
          )}
          <span className="text-sm text-muted-foreground">{user?.fullName}</span>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
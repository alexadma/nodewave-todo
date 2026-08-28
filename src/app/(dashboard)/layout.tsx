"use client";

import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-x border-gray-100 min-h-screen">
            <Navbar />
            <main>{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
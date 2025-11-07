// components/AdminLayout.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Menu, BarChart3, Users, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-indigo-600">
          🎵 AI Lyrics Admin
        </div>
  <nav className="flex-1 p-4 space-y-2">
  <Link href="/" className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-600">
    <span>📊 Dashboard</span>
  </Link>
  <Link href="/admin/users" className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-600">
    <span>👥 Users</span>
  </Link>
  <Link href="/admin/songs" className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-600">
    <span>🎵 Songs</span>
  </Link>
  <Link href="/admin/comments" className="flex items-center space-x-2 p-2 rounded hover:bg-indigo-600">
    <span>💬 Comments</span>
  </Link>
</nav>
        <div className="p-4 border-t border-indigo-600">
          <button className="flex items-center space-x-2 w-full p-2 rounded hover:bg-indigo-600">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between shadow-sm">
          <div className="flex items-center space-x-2 text-gray-700">
            <Menu className="w-6 h-6" />
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
          <span className="text-sm text-gray-500">Logged in as <b>Admin</b></span>
        </header>

        {/* Page content */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}

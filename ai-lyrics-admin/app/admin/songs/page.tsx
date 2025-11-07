"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { fetchAllSongs } from "@/lib/api";

export default function SongsPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setError("No token found.");

    fetchAllSongs(token)
      .then(setSongs)
      .catch(() => setError("Failed to fetch songs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <p className="text-center mt-10">Loading songs...</p>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <p className="text-red-500 text-center mt-10">{error}</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-4">🎵 Songs</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Genre</th>
              <th className="p-3 text-left">Language</th>
              <th className="p-3 text-left">Likes</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{s.title}</td>
                <td className="p-3">{s.genre || "—"}</td>
                <td className="p-3">{s.language || "—"}</td>
                <td className="p-3">{s.likeCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

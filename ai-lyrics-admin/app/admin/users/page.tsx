"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { fetchAllUsers } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setError("No token found.");

    fetchAllUsers(token)
      .then(setUsers)
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <p className="text-center mt-10">Loading users...</p>
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
      <h2 className="text-2xl font-semibold mb-4">👥 Users</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.username || "—"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role || "user"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

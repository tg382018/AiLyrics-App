"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { fetchAllUsers, fetchCommentsByUser, deleteComment } from "@/lib/api";


interface User {
  _id: string;
  email: string;
  username?: string;
}

interface Comment {
  _id: string;
  text: string;
  song?: { title?: string };
}

export default function CommentsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [commentsByUser, setCommentsByUser] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔹 1. Kullanıcı listesini getir
  useEffect(() => {
    if (!token) return setError("No token found. Please login as admin.");

    fetchAllUsers(token)
      .then(setUsers)
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, [token]);

  // 🔹 2. Belirli kullanıcının yorumlarını getir
  const loadUserComments = async (userId: string) => {
    try {
      const data = await fetchCommentsByUser(token!, userId);
      setCommentsByUser((prev) => ({ ...prev, [userId]: data }));
    } catch {
      alert("Yorumlar alınamadı!");
    }
  };

  // 🔹 3. Yorumu sil
  const handleDelete = async (commentId: string, userId: string) => {
    if (!confirm("Yorumu silmek istediğine emin misin?")) return;
    try {
      await deleteComment(token!, commentId);
      loadUserComments(userId); // Listeyi yenile
    } catch {
      alert("Yorum silinirken hata oluştu!");
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <p className="text-center mt-10">Loading comments...</p>
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
      <h2 className="text-2xl font-semibold mb-4">💬 Comments by Users</h2>

      {users.map((u) => (
        <div
          key={u._id}
          className="mb-6 bg-white shadow-sm rounded-lg border border-gray-200"
        >
          {/* Kullanıcı başlığı */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div>
              <p className="font-semibold text-gray-800">
                {u.username || "—"}
              </p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
            <button
              onClick={() => loadUserComments(u._id)}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700"
            >
              Yorumları Göster
            </button>
          </div>

          {/* Yorum tablosu */}
          {commentsByUser[u._id] && commentsByUser[u._id].length > 0 && (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">🎵 Şarkı</th>
                  <th className="text-left p-2">💬 Yorum</th>
                  <th className="text-center p-2">⚙️ İşlem</th>
                </tr>
              </thead>
              <tbody>
                {commentsByUser[u._id].map((c) => (
                  <tr key={c._id} className="border-t hover:bg-gray-50">
                    <td className="p-2 text-gray-700">
                      {c.song?.title || "—"}
                    </td>
                    <td className="p-2 text-gray-700">{c.text}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDelete(c._id, u._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Yorum yoksa */}
          {commentsByUser[u._id] && commentsByUser[u._id].length === 0 && (
            <p className="p-4 text-gray-500 text-sm">Yorum bulunamadı.</p>
          )}
        </div>
      ))}
    </AdminLayout>
  );
}

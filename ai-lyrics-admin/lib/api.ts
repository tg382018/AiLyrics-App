export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

/* -------------------- 🔹 Genel Admin API -------------------- */

export async function fetchAdminStats(token: string) {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchAllUsers(token: string) {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchAllSongs(token: string) {
  const res = await fetch(`${API_BASE}/songs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch songs");
  return res.json();
}

export async function fetchUserLikes(token: string, userId: string) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/likes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch likes for user ${userId}`);
  return res.json();
}

export async function fetchUserComments(token: string, userId: string) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/comments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch comments for user ${userId}`);
  return res.json();
}

/* -------------------- 💬 Comments Admin API -------------------- */

export async function fetchCommentsByUser(token: string, userId: string) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/comments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch comments for user ${userId}`);
  return res.json();
}

export async function deleteComment(token: string, commentId: string) {
  const res = await fetch(`${API_BASE}/admin/comments/${commentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
}

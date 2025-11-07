"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { PieChart, Pie, LabelList } from "recharts";

import AdminLayout from "@/components/AdminLayout";
import {
  fetchAdminStats,
  fetchAllUsers,
  fetchUserLikes,
  fetchUserComments,
} from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartConfig,
} from "@/components/ui/chart";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [userMetrics, setUserMetrics] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setError("No token found. Please login as admin.");

    // 1️⃣ Stats + Users paralel çek
    Promise.all([fetchAdminStats(token), fetchAllUsers(token)])
      .then(async ([statsData, usersData]) => {
        setStats(statsData);
        setUsers(usersData);

        // 2️⃣ Her kullanıcı için likes & comments çek
        const metrics = await Promise.all(
          usersData.map(async (u: any) => {
            const [likes, comments] = await Promise.all([
              fetchUserLikes(token, u._id),
              fetchUserComments(token, u._id),
            ]);

            return {
              userId: u._id,
              email: u.email,
              likes: Array.isArray(likes) ? likes.length : 0,
              comments: Array.isArray(comments) ? comments.length : 0,
            };
          })
        );

        setUserMetrics(metrics);
      })
      .catch(() => setError("Failed to load data"));
  }, []);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!stats || users.length === 0 || userMetrics.length === 0)
    return <p className="text-center mt-10">Loading...</p>;

  // 🔹 Kullanıcı email eşleşmesi
  const userEmailMap = new Map(users.map((u: any) => [u._id, u.email || "Unknown"]));

  // 🔹 Songs per User
  const songChartData =
    stats.userSongCounts?.map((item: any, index: number) => ({
      user: userEmailMap.get(item.userId) || "Unknown",
      count: item.songCount,
      fill: `var(--chart-${(index % 5) + 1})`,
    })) || [];

  // 🔹 Likes per User
  const likesChartData = userMetrics.map((u, i) => ({
    user: u.email,
    count: u.likes,
    fill: `var(--chart-${(i % 5) + 1})`,
  }));

  // 🔹 Comments per User
  const commentsChartData = userMetrics.map((u, i) => ({
    user: u.email,
    count: u.comments,
    fill: `var(--chart-${(i % 5) + 1})`,
  }));

  // 🔹 Chart Config
  const makeConfig = (data: any[]) =>
    Object.fromEntries(data.map((d: any) => [d.user, { label: d.user, color: d.fill }])) satisfies ChartConfig;

  // 🔹 Chart Bileşeni
  const ChartBlock = ({
    title,
    desc,
    data,
  }: {
    title: string;
    desc: string;
    data: any[];
  }) => (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={makeConfig(data)}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={data} dataKey="count">
              <LabelList
                dataKey="user"
                className="fill-background"
                stroke="none"
                fontSize={12}
              />
            </Pie>
            <ChartTooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const item = payload[0].payload;
                return (
                  <div className="bg-white shadow-md rounded-md p-2 text-sm">
                    <p className="font-medium">{item.user}</p>
                    <p className="text-gray-500">{item.count}</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-4">📊 Overview</h2>

      {/* Üst bilgi kartları */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">👥 Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">🎶 Total Songs</p>
          <p className="text-3xl font-bold">{stats.totalSongs}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">💬 Total Comments</p>
          <p className="text-3xl font-bold">{stats.totalComments}</p>
        </div>
      </div>

      {/* 3 grafik */}
      <div className="grid grid-cols-3 gap-6">
        <ChartBlock
          title="🎵 Songs per User"
          desc="How many songs each user created"
          data={songChartData}
        />
        <ChartBlock
          title="💖 Likes per User"
          desc="Total likes given to songs by each user"
          data={likesChartData}
        />
        <ChartBlock
          title="💬 Comments per User"
          desc="Total comments written by each user"
          data={commentsChartData}
        />
      </div>
    </AdminLayout>
  );
}

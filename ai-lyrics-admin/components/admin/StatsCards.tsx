import { Card } from "@/components/ui/card";

export default function StatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <p className="text-gray-500">👥 Total Users</p>
        <p className="text-3xl font-bold">{stats.totalUsers}</p>
      </Card>
      <Card className="p-4">
        <p className="text-gray-500">🎶 Total Songs</p>
        <p className="text-3xl font-bold">{stats.totalSongs}</p>
      </Card>
      <Card className="p-4">
        <p className="text-gray-500">💬 Total Comments</p>
        <p className="text-3xl font-bold">{stats.totalComments}</p>
      </Card>
    </div>
  );
}

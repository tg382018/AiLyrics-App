import ChartBlock from "./ChartBlock";

export default function AdminCharts({
  stats,
  users,
  userMetrics,
}: {
  stats: any;
  users: any[];
  userMetrics: any[];
}) {
  const userEmailMap = new Map(users.map((u: any) => [u._id, u.email || "Unknown"]));

  const songChartData =
    stats.userSongCounts?.map((item: any, index: number) => ({
      user: userEmailMap.get(item.userId) || "Unknown",
      count: item.songCount,
      fill: `var(--chart-${(index % 5) + 1})`,
    })) || [];

  const likesChartData = userMetrics.map((u, i) => ({
    user: u.email,
    count: u.likes,
    fill: `var(--chart-${(i % 5) + 1})`,
  }));

  const commentsChartData = userMetrics.map((u, i) => ({
    user: u.email,
    count: u.comments,
    fill: `var(--chart-${(i % 5) + 1})`,
  }));

  return (
    <div className="grid grid-cols-3 gap-6">
      <ChartBlock
        title="🎵 Songs per User"
        desc="How many songs each user created"
        data={songChartData}
      />
      <ChartBlock
        title="💖 Likes per User"
        desc="Total likes given to songs by user"
        data={likesChartData}
      />
      <ChartBlock
        title="💬 Comments per User"
        desc="Total comments written by each user"
        data={commentsChartData}
      />
    </div>
  );
}

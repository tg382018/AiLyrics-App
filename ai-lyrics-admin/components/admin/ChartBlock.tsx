import { TrendingUp } from "lucide-react";
import { PieChart, Pie, LabelList } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

export default function ChartBlock({
  title,
  desc,
  data,
}: {
  title: string;
  desc: string;
  data: any[];
}) {
  const config = Object.fromEntries(
    data.map((d: any) => [d.user, { label: d.user, color: d.fill }])
  ) satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
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
            <Pie data={data} dataKey="count">
              <LabelList
                dataKey="user"
                className="fill-background"
                stroke="none"
                fontSize={12}
              />
            </Pie>
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
}

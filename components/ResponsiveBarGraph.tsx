"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "Jan", sales: 400 },
  { month: "Feb", sales: 300 },
  { month: "Mar", sales: 600 },
  { month: "Apr", sales: 800 },
  { month: "May", sales: 500 },
  { month: "Jun", sales: 700 },
  { month: "Jul", sales: 100 },
  { month: "Aug", sales: 330 },
  { month: "Sep", sales: 140 },
  { month: "Oct", sales: 1000 },
  { month: "Nov", sales: 1209 },
  { month: "Dec", sales: 1500 },
];

interface graphDataInterface {
  month: string;
  sales: number;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ResponsiveBarGraph({
  className,
  graphData,
}: {
  className: string;
  graphData?: graphDataInterface[];
}) {
  return (
    <ChartContainer config={chartConfig} className={className}>
      <BarChart accessibilityLayer data={graphData ? graphData : chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="sales" fill="#4e6466" radius={2} />
      </BarChart>
    </ChartContainer>
  );
}

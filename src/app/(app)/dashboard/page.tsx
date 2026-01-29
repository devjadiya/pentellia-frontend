"use client";

import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  ComposedChart,
  Line,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Workflow,
  Clock,
  ShieldAlert,
  Activity,
  ArrowUp,
  ArrowDown,
  ScanLine,
  Target,
  LayoutTemplate,
  BarChart3,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Types ---
interface DashboardData {
  kpi: {
    totalAssets: number;
    totalScans: number;
    activeScans: number;
    failedScans24h: number;
    openCritical: number;
    openHigh: number;
  };
  charts: {
    exposureTrend: { date: string; scans: number }[];
    findingsTrend: any[];
  };
  recentScans: any[];
}

// --- Chart Configurations ---
const trendConfig = {
  scans: { label: "Scans Performed", color: "#8b5cf6" }, // Violet
  line: { label: "Trend Line", color: "#10b981" }, // Emerald
};

const radialConfig = {
  completed: { label: "Success", color: "#10b981" }, // Emerald
  failed: { label: "Failed", color: "#ef4444" }, // Red
  active: { label: "Active", color: "#3b82f6" }, // Blue
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // View State for Chart Toggles
  const [chartView, setChartView] = useState<"area" | "bar" | "composed">(
    "area"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        if (json.success) setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  // Derived Data for Visuals
  const totalOps = data.kpi.totalScans || 1;
  const radialData = [
    {
      name: "Success",
      count: totalOps - data.kpi.failedScans24h - data.kpi.activeScans,
      fill: "#10b981",
    },
    { name: "Active", count: data.kpi.activeScans, fill: "#3b82f6" },
    { name: "Failed", count: data.kpi.failedScans24h, fill: "#ef4444" },
  ];

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-2">
      {/* 1. KEY METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Scans"
          metric={data.kpi.totalScans.toString()}
          icon={ScanLine}
          trend="+12%"
          trendType="up"
        />
        <KpiCard
          title="Assets Monitored"
          metric={data.kpi.totalAssets.toString()}
          icon={Target}
          trend="+3"
          trendType="up"
        />
        <KpiCard
          title="Critical Findings"
          metric="0"
          icon={ShieldAlert}
          alert
          trend="0%"
          trendType="neutral"
        />
        <KpiCard
          title="System Health"
          metric="98%"
          icon={Activity}
          trend="Stable"
          trendType="neutral"
        />
      </div>

      {/* 2. MAIN VISUALIZATION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* A. Advanced Trend Analysis (Interactive) */}
        <GlassCard
          title="Scan Velocity (7 Days)"
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-md",
                  chartView === "area" && "bg-white/10 text-white"
                )}
                onClick={() => setChartView("area")}
                title="Area View"
              >
                <LayoutTemplate className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-md",
                  chartView === "bar" && "bg-white/10 text-white"
                )}
                onClick={() => setChartView("bar")}
                title="Bar View"
              >
                <BarChart3 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-md",
                  chartView === "composed" && "bg-white/10 text-white"
                )}
                onClick={() => setChartView("composed")}
                title="Composed View"
              >
                <LineChart className="h-3.5 w-3.5" />
              </Button>
            </div>
          }
        >
          <div className="h-[280px] w-full">
            {data.charts.exposureTrend.length > 0 ? (
              <ChartContainer config={trendConfig} className="h-full w-full">
                {chartView === "area" ? (
                  <AreaChart
                    data={data.charts.exposureTrend}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="fillScans"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      width={30}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      content={
                        <ChartTooltipContent className="bg-[#0B0C15] border-white/10" />
                      }
                    />
                    <Area
                      dataKey="scans"
                      type="monotone"
                      fill="url(#fillScans)"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : chartView === "bar" ? (
                  <BarChart
                    data={data.charts.exposureTrend}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      width={30}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      cursor={{ fill: "white", opacity: 0.05 }}
                      content={
                        <ChartTooltipContent className="bg-[#0B0C15] border-white/10" />
                      }
                    />
                    <Bar
                      dataKey="scans"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                ) : (
                  <ComposedChart
                    data={data.charts.exposureTrend}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      width={30}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      content={
                        <ChartTooltipContent className="bg-[#0B0C15] border-white/10" />
                      }
                    />
                    <Bar
                      dataKey="scans"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      opacity={0.6}
                    />
                    <Line
                      type="monotone"
                      dataKey="scans"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#10b981" }}
                    />
                  </ComposedChart>
                )}
              </ChartContainer>
            ) : (
              <EmptyState text="No scan history available" />
            )}
          </div>
        </GlassCard>

        {/* B. Operational Efficiency (Radial Bar) */}
        <GlassCard title="Operational Efficiency">
          <div className="h-[280px] w-full relative flex items-center justify-center">
            <ChartContainer config={radialConfig} className="h-full w-full">
              <RadialBarChart
                innerRadius="30%"
                outerRadius="100%"
                barSize={15}
                data={radialData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  label={{
                    position: "insideStart",
                    fill: "#fff",
                    fontSize: "10px",
                  }}
                  background
                  dataKey="count"
                  cornerRadius={10}
                />
                <Legend
                  iconSize={8}
                  layout="vertical"
                  verticalAlign="middle"
                  wrapperStyle={{ right: 0, top: "40%" }}
                />
                <Tooltip
                  content={
                    <ChartTooltipContent className="bg-[#0B0C15] border-white/10" />
                  }
                />
              </RadialBarChart>
            </ChartContainer>

            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 text-center">
              <p className="text-2xl font-bold text-white">
                {data.kpi.totalScans}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Total Ops
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 3. DATA TABLES ROW */}
      <div className="grid grid-cols-1 gap-4">
        <GlassCard title="Live Scan Feed" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase bg-white/5 text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-medium">Tool</th>
                  <th className="px-6 py-3 font-medium">Target</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.recentScans.length > 0 ? (
                  data.recentScans.map((scan) => (
                    <tr
                      key={scan.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-3 font-medium text-white">
                        {scan.tool_name || "Unknown"}
                      </td>
                      <td className="px-6 py-3 text-slate-400 font-mono text-xs group-hover:text-violet-300 transition-colors">
                        {scan.target}
                      </td>
                      <td className="px-6 py-3 text-slate-400 text-xs">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={scan.status} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link
                          href={`/dashboard/scans/${
                            scan.tool_id || "unknown"
                          }/${scan.id}`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-slate-400 hover:text-white hover:bg-white/10"
                          >
                            Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No activity recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function KpiCard({ title, metric, icon: Icon, trend, trendType, alert }: any) {
  const trendColor =
    trendType === "up"
      ? "text-emerald-400"
      : trendType === "down"
      ? "text-red-400"
      : "text-slate-500";
  const IconTrend = trendType === "up" ? ArrowUp : ArrowDown;

  return (
    <Card className="bg-[#0B0C15]/50 backdrop-blur-md border border-white/10 shadow-sm p-5 relative overflow-hidden group hover:border-white/20 transition-all">
      <div className="absolute right-4 top-4 p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-white transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h2
            className={cn(
              "text-2xl font-bold tracking-tight",
              alert && metric !== "0" ? "text-red-400" : "text-white"
            )}
          >
            {metric}
          </h2>
          {trend && (
            <span
              className={cn(
                "flex items-center text-[10px] font-medium bg-white/5 px-1.5 py-0.5 rounded",
                trendColor
              )}
            >
              {trendType !== "neutral" && (
                <IconTrend className="h-2.5 w-2.5 mr-0.5" />
              )}
              {trend}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function GlassCard({
  children,
  title,
  className,
  noPadding = false,
  action,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  noPadding?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "bg-[#0B0C15]/50 backdrop-blur-md border border-white/10 shadow-sm rounded-xl overflow-hidden flex flex-col h-full",
        className
      )}
    >
      {title && (
        <CardHeader className="px-5 py-3 border-b border-white/5 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            {title}
          </CardTitle>
          {action && <div>{action}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("flex-1", noPadding ? "p-0" : "p-5")}>
        {children}
      </CardContent>
    </Card>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 space-y-2">
      <Activity className="h-8 w-8 opacity-20" />
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    running: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    failed: "text-red-400 bg-red-500/10 border-red-500/20",
    queued: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-medium border rounded-full capitalize",
        styles[status] || styles.queued
      )}
    >
      {status === "running" && (
        <span className="mr-1.5 h-1 w-1 rounded-full bg-current animate-pulse" />
      )}
      {status}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-2 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-white/5 rounded-xl border border-white/5"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 h-[300px] bg-white/5 rounded-xl border border-white/5" />
        <div className="h-[300px] bg-white/5 rounded-xl border border-white/5" />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="h-[300px] bg-white/5 rounded-xl border border-white/5" />
      </div>
    </div>
  );
}

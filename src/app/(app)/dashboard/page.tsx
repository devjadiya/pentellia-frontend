"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  FileText,
  Fingerprint,
  Globe,
  HardDrive,
  HeartPulse,
  Router,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AttackSurfaceStat = {
  label: string;
  value: string;
  trend: string;
  icon: React.ElementType;
};

type VulnerabilitySummary = {
  critical: number;
  high: number;
  medium: number;
  low: number;
};

type ScanActivityStat = {
  label: string;
  current: number;
  total: number;
};

type SummaryData = {
  attackSurfaceStats: Omit<AttackSurfaceStat, "icon">[];
  vulnerabilitySummary: VulnerabilitySummary;
};

type ActivityData = {
  scanActivityStats: ScanActivityStat[];
};

const iconMap: { [key: string]: React.ElementType } = {
  "IP Addresses": Globe,
  Hostnames: Router,
  "Open Ports": Zap,
  Protocols: FileText,
  Services: Server,
  Technologies: HardDrive,
  "Exposed Assets": AlertTriangle,
};

export default function DashboardPage() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, activityRes] = await Promise.all([
          fetch("/api/dashboard/summary"),
          fetch("/api/dashboard/activity"),
        ]);

        if (!summaryRes.ok || !activityRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const summary = await summaryRes.json();
        const activity = await activityRes.json();

        setSummaryData(summary);
        setActivityData(activity);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
        });
      } finally {
        // Simulate network delay for skeleton loaders
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchData();
  }, [toast]);

  const attackSurfaceStats: AttackSurfaceStat[] =
    summaryData?.attackSurfaceStats.map((stat) => ({
      ...stat,
      icon: iconMap[stat.label] || Fingerprint,
      trend: "+2 from last week", // mock trend data
    })) || [];

  const vulnerabilityChartData = summaryData
    ? [
        {
          name: "Critical",
          count: summaryData.vulnerabilitySummary.critical,
          fill: "hsl(var(--chart-1))",
        },
        {
          name: "High",
          count: summaryData.vulnerabilitySummary.high,
          fill: "hsl(var(--chart-2))",
        },
        {
          name: "Medium",
          count: summaryData.vulnerabilitySummary.medium,
          fill: "hsl(var(--chart-3))",
        },
        {
          name: "Low",
          count: summaryData.vulnerabilitySummary.low,
          fill: "hsl(var(--chart-4))",
        },
      ]
    : [];

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold lg:text-3xl">Dashboard</h1>
        <Tabs defaultValue="overview" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="whats-new">What's new</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs defaultValue="overview">
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Attack Surface Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {loading ? (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Card key={i} className="min-h-[120px] p-4">
                        <Skeleton className="mb-2 h-8 w-8 rounded-full" />
                        <Skeleton className="mb-2 h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {attackSurfaceStats.map((stat) => (
                      <Card key={stat.label} className="min-h-[120px]">
                        <CardContent className="flex h-full flex-col justify-between p-4">
                          <div className="flex items-start justify-between">
                            <div className="text-3xl font-semibold">
                              {stat.value}
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <stat.icon className="h-4 w-4" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {stat.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {stat.trend}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="shadow-[0_12px_40px_rgba(0,0,0,0.6)] border-white/5 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Vulnerability Summary
                </CardTitle>
                <Select defaultValue="30">
                  <SelectTrigger className="h-8 w-[140px] text-xs">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="14">Last 14 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {loading ? (
                  <div className="flex h-full flex-col justify-between">
                     <Skeleton className="h-48 w-full rounded-md" />
                     <div className="flex items-center justify-center gap-4 text-xs">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ) : (
                  <>
                  <div className="h-48 flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={vulnerabilityChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-xs mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]"></span>
                      <span>Critical</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]"></span>
                      <span>High</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-3))]"></span>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-4))]"></span>
                      <span>Low</span>
                    </div>
                  </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Scan Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                     <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <Skeleton className="mt-2 h-5 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
                  {activityData?.scanActivityStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-white/10 bg-muted">
                        <div className="text-4xl font-bold">{stat.current}</div>
                        <div className="text-sm text-muted-foreground">
                          / {stat.total}
                        </div>
                      </div>
                      <p className="mt-2 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    
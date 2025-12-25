
'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {ChartConfig} from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Activity, AlertTriangle, FileWarning, Target, ShieldAlert, Network, Globe, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

const exposureTrendData = [
  {date: '2024-07-01', vulnerabilities: 21},
  {date: '2024-07-02', vulnerabilities: 23},
  {date: '2024-07-03', vulnerabilities: 22},
  {date: '2024-07-04', vulnerabilities: 25},
  {date: '2024-07-05', vulnerabilities: 24},
  {date: '2024-07-06', vulnerabilities: 28},
  {date: '2024-07-07', vulnerabilities: 26},
];

const exposureTrendConfig = {
  vulnerabilities: {
    label: 'Vulnerabilities',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        <KpiCard 
          title="Open Critical Findings" 
          metric="8"
          delta="+2"
          deltaType="increase"
          icon={AlertTriangle}
        />
        <KpiCard 
          title="New Assets (7d)" 
          metric="20"
          delta="+5.2%"
          deltaType="increase"
          icon={Target}
        />
        <KpiCard 
          title="Stale Findings (>90d)" 
          metric="14"
          delta="-3"
          deltaType="decrease"
          icon={FileWarning}
        />
        <KpiCard 
          title="Scans Failed (24h)" 
          metric="1"
          delta="+1"
          deltaType="increase"
          icon={ShieldAlert}
        />
         <KpiCard
            title="IP Addresses"
            metric="12"
            delta="+1"
            deltaType="increase"
            icon={Network}
        />
        <KpiCard
            title="Hostnames"
            metric="31"
            delta="+3"
            deltaType="increase"
            icon={Globe}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Exposure Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] w-full p-2">
              <ChartContainer config={exposureTrendConfig} className="h-full w-full">
                <AreaChart
                  accessibilityLayer
                  data={exposureTrendData.concat(exposureTrendData.map(d => ({...d, date: `2024-07-${parseInt(d.date.split('-')[2]) + 7}`})))}
                  margin={{
                    left: -20,
                    right: 20,
                    top: 10,
                    bottom: 10,
                  }}
                >
                  <defs>
                    <linearGradient id="fillVulnerabilities" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      width={30}
                    />
                  <Tooltip
                    cursor={{stroke: 'hsl(var(--border))', strokeWidth: 1}}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="vulnerabilities"
                    type="natural"
                    fill="url(#fillVulnerabilities)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             <KpiCard title="Open Ports" metric="34" delta="+3" deltaType="increase" icon={DoorOpen} />
             <KpiCard title="Vulnerabilities" metric="43" delta="+5" deltaType="increase" icon={Activity} />
             <KpiCard title="Services" metric="18" delta="-1" deltaType="decrease" />
             <KpiCard title="Technologies" metric="29" delta="+2" deltaType="increase" />
             <KpiCard title="Exposed Assets" metric="2" delta="0" deltaType="neutral" />
             <KpiCard title="New This Week" metric="7" delta="+1" deltaType="increase" />
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Latest Scans</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="overflow-hidden border border-border rounded-lg">
            <table className="w-full text-sm">
                <thead className="bg-white/5">
                <tr className='border-b-0'>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Tool</th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Target</th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Workspace</th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Start date</th>
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Status</th>
                    <th className="px-6 py-3 text-right font-semibold text-muted-foreground">View</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-border">
                <tr className="transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-secondary">
                    Website Scanner
                    </td>
                    <td className="px-6 py-4 text-foreground/80">
                    https://www.gohighlevel.com/78486a1
                    </td>
                    <td className="px-6 py-4 text-foreground/80">My Workspace</td>
                    <td className="px-6 py-4 text-foreground/80">
                    Oct 30, 2025 – 20:20
                    </td>
                    <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium text-success">
                        <span className="h-2 w-2 rounded-full bg-success" />
                        Completed
                    </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <Button variant='link' className='p-0 h-auto text-primary'>View status</Button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

type KpiCardProps = {
    title: string;
    metric: string;
    delta: string;
    deltaType: 'increase' | 'decrease' | 'neutral';
    icon?: React.ElementType;
}

function KpiCard({ title, metric, delta, deltaType, icon: Icon }: KpiCardProps) {
    const deltaColor = deltaType === 'increase' ? 'text-destructive' : deltaType === 'decrease' ? 'text-success' : 'text-muted-foreground';

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{metric}</div>
                <p className={`text-xs text-muted-foreground`}>
                    <span className={deltaColor}>{delta}</span> since last period
                </p>
            </CardContent>
        </Card>
    );
}

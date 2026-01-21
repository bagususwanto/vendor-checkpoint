'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHourlyLeadTime } from '@/hooks/api/use-dashboard';

export function LeadTimeChart() {
  const { data: leadTimeData, isLoading } = useHourlyLeadTime();

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Lead Time per Jam</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <span className="text-muted-foreground">Loading chart...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Lead Time per Jam</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={leadTimeData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorLeadTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px' }}
                formatter={(value: any) => [`${value} menit`, 'Lead Time']}
              />
              <Area
                type="monotone"
                dataKey="lead_time"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#colorLeadTime)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

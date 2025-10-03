"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "Mar 1", phishing: 420, spam: 1240, malware: 12 },
  { date: "Mar 3", phishing: 380, spam: 1180, malware: 18 },
  { date: "Mar 5", phishing: 520, spam: 1320, malware: 8 },
  { date: "Mar 7", phishing: 680, spam: 1450, malware: 22 },
  { date: "Mar 9", phishing: 590, spam: 1280, malware: 15 },
  { date: "Mar 10", phishing: 450, spam: 1150, malware: 11 },
]

export function ThreatTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Trends</CardTitle>
        <CardDescription>Detected threats over the last 10 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            phishing: {
              label: "Phishing",
              color: "hsl(var(--chart-1))",
            },
            spam: {
              label: "Spam",
              color: "hsl(var(--chart-2))",
            },
            malware: {
              label: "Malware",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillPhishing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSpam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMalware" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-4)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-4)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="phishing"
              stackId="1"
              stroke="var(--color-chart-1)"
              fill="url(#fillPhishing)"
            />
            <Area type="monotone" dataKey="spam" stackId="1" stroke="var(--color-chart-2)" fill="url(#fillSpam)" />
            <Area
              type="monotone"
              dataKey="malware"
              stackId="1"
              stroke="var(--color-chart-4)"
              fill="url(#fillMalware)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

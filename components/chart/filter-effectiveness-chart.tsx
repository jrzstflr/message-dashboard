"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { time: "00:00", accuracy: 98.2, blocked: 420 },
  { time: "04:00", accuracy: 98.5, blocked: 380 },
  { time: "08:00", accuracy: 98.1, blocked: 520 },
  { time: "12:00", accuracy: 98.9, blocked: 680 },
  { time: "16:00", accuracy: 98.7, blocked: 590 },
  { time: "20:00", accuracy: 98.4, blocked: 450 },
  { time: "23:59", accuracy: 98.6, blocked: 410 },
]

export function FilterEffectivenessChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Effectiveness</CardTitle>
        <CardDescription>Accuracy rate and blocked messages over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            accuracy: {
              label: "Accuracy %",
              color: "hsl(var(--chart-1))",
            },
            blocked: {
              label: "Blocked",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="accuracy"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="blocked"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

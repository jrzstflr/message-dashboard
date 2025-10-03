"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { metric: "Data Retention", score: 100 },
  { metric: "Access Control", score: 99 },
  { metric: "Audit Logging", score: 100 },
  { metric: "Encryption", score: 98 },
  { metric: "Incident Response", score: 99 },
]

export function ComplianceMetricsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Metrics</CardTitle>
        <CardDescription>Regulatory compliance scores by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            score: {
              label: "Score %",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
            <YAxis dataKey="metric" type="category" tickLine={false} axisLine={false} width={120} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="score" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

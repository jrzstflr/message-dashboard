"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { region: "North America", threats: 8420 },
  { region: "Europe", threats: 6280 },
  { region: "Asia Pacific", threats: 12450 },
  { region: "Latin America", threats: 3180 },
  { region: "Middle East", threats: 2890 },
  { region: "Africa", threats: 1240 },
]

export function GeographicDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <CardDescription>Threat origins by region</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            threats: {
              label: "Threats",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis dataKey="region" type="category" tickLine={false} axisLine={false} width={120} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="threats" fill="var(--color-chart-4)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

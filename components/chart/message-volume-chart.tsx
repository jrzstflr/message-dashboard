"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { time: "00:00", messages: 2400 },
  { time: "04:00", messages: 1800 },
  { time: "08:00", messages: 3200 },
  { time: "12:00", messages: 4100 },
  { time: "16:00", messages: 3800 },
  { time: "20:00", messages: 2900 },
  { time: "23:59", messages: 2200 },
]

export function MessageVolumeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Volume</CardTitle>
        <CardDescription>Messages processed over the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="messages" stroke="#4f46e5" fill="url(#fillMessages)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

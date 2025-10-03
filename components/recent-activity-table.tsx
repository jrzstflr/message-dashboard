"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMessages } from "@/components/messages-provider"
import { useMemo } from "react"

export function RecentActivityTable() {
  const { messages: allMessages } = useMessages()

  const recentActivity = useMemo(() => {
    return allMessages
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map((msg) => {
        // Calculate relative time
        const msgDate = new Date(msg.timestamp)
        const now = new Date()
        const diffMs = now.getTime() - msgDate.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        let timeAgo = ""
        if (diffDays > 0) {
          timeAgo = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
        } else if (diffHours > 0) {
          timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
        } else if (diffMins > 0) {
          timeAgo = `${diffMins} min${diffMins > 1 ? "s" : ""} ago`
        } else {
          timeAgo = "Just now"
        }

        return {
          id: msg.id,
          time: timeAgo,
          action: msg.status,
          type: msg.category,
          sender: msg.senderEmail,
        }
      })
  }, [allMessages])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest message filtering actions from uploaded data</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Message ID</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sender</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-mono text-xs">{activity.id}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{activity.time}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      activity.action === "Blocked"
                        ? "destructive"
                        : activity.action === "Flagged"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {activity.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{activity.type}</Badge>
                </TableCell>
                <TableCell className="text-sm">{activity.sender}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

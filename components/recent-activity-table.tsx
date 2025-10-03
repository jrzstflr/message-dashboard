import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recentActivity = [
  {
    id: "MSG-1247",
    time: "2 min ago",
    action: "Blocked",
    type: "Phishing",
    sender: "suspicious@example.com",
  },
  {
    id: "MSG-1246",
    time: "5 min ago",
    action: "Allowed",
    type: "Business",
    sender: "team@company.com",
  },
  {
    id: "MSG-1245",
    time: "8 min ago",
    action: "Flagged",
    type: "Spam",
    sender: "marketing@promo.net",
  },
  {
    id: "MSG-1244",
    time: "12 min ago",
    action: "Blocked",
    type: "Malware",
    sender: "noreply@malicious.ru",
  },
  {
    id: "MSG-1243",
    time: "15 min ago",
    action: "Allowed",
    type: "Internal",
    sender: "admin@internal.com",
  },
]

export function RecentActivityTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest message filtering actions</CardDescription>
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

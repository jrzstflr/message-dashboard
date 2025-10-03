"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Search, Filter } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockAuditLogs = [
  {
    id: "AUD-1247",
    timestamp: "2025-03-10 14:35:22",
    user: "admin@company.com",
    action: "Filter Rule Modified",
    target: "Phishing Detection Rule #42",
    status: "Success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "AUD-1246",
    timestamp: "2025-03-10 14:28:15",
    user: "auditor@company.com",
    action: "Report Generated",
    target: "Monthly Compliance Report",
    status: "Success",
    ipAddress: "192.168.1.105",
  },
  {
    id: "AUD-1245",
    timestamp: "2025-03-10 14:15:08",
    user: "system",
    action: "Automatic Backup",
    target: "Database Backup",
    status: "Success",
    ipAddress: "Internal",
  },
  {
    id: "AUD-1244",
    timestamp: "2025-03-10 13:58:42",
    user: "admin@company.com",
    action: "User Permission Changed",
    target: "user@example.com",
    status: "Success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "AUD-1243",
    timestamp: "2025-03-10 13:42:33",
    user: "auditor@company.com",
    action: "Message Review",
    target: "MSG-001",
    status: "Completed",
    ipAddress: "192.168.1.105",
  },
  {
    id: "AUD-1242",
    timestamp: "2025-03-10 13:25:17",
    user: "system",
    action: "Filter Applied",
    target: "Spam Filter #12",
    status: "Success",
    ipAddress: "Internal",
  },
  {
    id: "AUD-1241",
    timestamp: "2025-03-10 13:10:55",
    user: "admin@company.com",
    action: "Configuration Updated",
    target: "System Settings",
    status: "Success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "AUD-1240",
    timestamp: "2025-03-10 12:58:29",
    user: "auditor@company.com",
    action: "Export Data",
    target: "Filtered Messages (CSV)",
    status: "Success",
    ipAddress: "192.168.1.105",
  },
]

export function AuditLogContent() {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Audit Log</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Search Audit Logs</CardTitle>
            <CardDescription>Filter and search through all system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by user, action, or target..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>Complete audit trail of all system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAuditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell className="text-sm">{log.user}</TableCell>
                    <TableCell className="text-sm font-medium">{log.action}</TableCell>
                    <TableCell className="text-sm">{log.target}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.status}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Audit Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Events Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground mt-1">+142 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Currently logged in</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">No failures detected</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Filter, Eye, Trash2 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockMessages = [
  {
    id: "MSG-001",
    timestamp: "2025-03-10 14:32:15",
    sender: "user@example.com",
    subject: "Urgent: Account Verification Required",
    category: "Phishing",
    status: "Blocked",
    risk: "High",
  },
  {
    id: "MSG-002",
    timestamp: "2025-03-10 14:28:42",
    sender: "newsletter@company.com",
    subject: "Weekly Newsletter - March Edition",
    category: "Marketing",
    status: "Allowed",
    risk: "Low",
  },
  {
    id: "MSG-003",
    timestamp: "2025-03-10 14:15:33",
    sender: "support@suspicious-site.ru",
    subject: "You have won $1,000,000!",
    category: "Spam",
    status: "Blocked",
    risk: "High",
  },
  {
    id: "MSG-004",
    timestamp: "2025-03-10 14:05:21",
    sender: "team@workspace.com",
    subject: "Project Update: Q1 Review",
    category: "Business",
    status: "Allowed",
    risk: "Low",
  },
  {
    id: "MSG-005",
    timestamp: "2025-03-10 13:58:17",
    sender: "noreply@bank-alert.com",
    subject: "Suspicious Activity Detected",
    category: "Phishing",
    status: "Flagged",
    risk: "Medium",
  },
  {
    id: "MSG-006",
    timestamp: "2025-03-10 13:42:09",
    sender: "admin@internal.company.com",
    subject: "System Maintenance Scheduled",
    category: "Internal",
    status: "Allowed",
    risk: "Low",
  },
]

export function MessagesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Messages</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Messages</CardTitle>
            <CardDescription>Search and filter messages by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by sender, subject, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="phishing">Phishing</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="allowed">Allowed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Message List</CardTitle>
            <CardDescription>Showing {mockMessages.length} messages</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-mono text-xs">{message.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{message.timestamp}</TableCell>
                    <TableCell className="text-sm">{message.sender}</TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm">{message.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{message.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          message.status === "Blocked"
                            ? "destructive"
                            : message.status === "Flagged"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          message.risk === "High" ? "destructive" : message.risk === "Medium" ? "secondary" : "outline"
                        }
                      >
                        {message.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

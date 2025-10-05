"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Filter, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMessages } from "@/components/messages-provider"
import { FileUpload } from "@/components/file-upload"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function MessagesContent() {
  const { messages: allMessages, isLoaded } = useMessages()

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null)

  const messagesPerPage = 50

  const filteredMessages = useMemo(() => {
    return allMessages.filter((message) => {
      const matchesSearch =
        searchQuery === "" ||
        message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilter === "all" || message.category.toLowerCase() === categoryFilter.toLowerCase()

      const matchesStatus = statusFilter === "all" || message.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [allMessages, searchQuery, categoryFilter, statusFilter])

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage)
  const startIndex = (currentPage - 1) * messagesPerPage
  const endIndex = startIndex + messagesPerPage
  const currentMessages = filteredMessages.slice(startIndex, endIndex)

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Messages</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={!isLoaded}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {!isLoaded ? (
          <FileUpload />
        ) : (
          <>
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
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="pl-9"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={handleFilterChange(setCategoryFilter)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                      <SelectItem value="phishing">Phishing</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
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
                <CardDescription>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredMessages.length)} of{" "}
                  {filteredMessages.length.toLocaleString()} messages
                  {filteredMessages.length !== allMessages.length &&
                    ` (filtered from ${allMessages.length.toLocaleString()} total)`}
                </CardDescription>
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
                    {currentMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-mono text-xs">{message.id}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{message.timestamp}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span>{message.sender}</span>
                            <span className="text-xs text-muted-foreground">{message.senderEmail}</span>
                          </div>
                        </TableCell>
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
                              message.risk === "High"
                                ? "destructive"
                                : message.risk === "Medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {message.risk}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(message)}>
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

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Message Viewer Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject || "Message Details"}</DialogTitle>
            <DialogDescription>
              {selectedMessage ? (
                <div className="space-y-2 mt-2">
                  <p><strong>From:</strong> {selectedMessage.sender} ({selectedMessage.senderEmail})</p>
                  <p><strong>Timestamp:</strong> {selectedMessage.timestamp}</p>
                  <p><strong>Category:</strong> {selectedMessage.category}</p>
                  <p><strong>Status:</strong> {selectedMessage.status}</p>
                  <p><strong>Risk:</strong> {selectedMessage.risk}</p>
                  <hr className="my-3" />
                  <p>{selectedMessage.content || "No message body available."}</p>
                </div>
              ) : (
                <p>No message selected.</p>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

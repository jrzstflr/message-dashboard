// components/messages-content.tsx
"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, ChevronLeft, ChevronRight, ArrowUpDown, ArrowDown, ArrowUp, Image as ImageIcon, MessageSquare, Layers, Users, FolderOpen } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useMessages } from "@/components/messages-provider"
import { FileUpload } from "@/components/file-upload"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ProcessedMessage } from "@/lib/message-utils"

type SortConfig = {
  key: "latest_ts" | "roomName" | "messageCount"
  direction: "asc" | "desc"
} | null

interface ConversationGroup {
  room_id: string
  roomName: string
  roomType: string
  participants: string[]
  categories: Set<string>
  latest_ts: number
  latest_timestamp: string
  latest_message_preview: string
  hasAttachments: boolean
  messageCount: number
  messages: ProcessedMessage[]
}

export function MessagesContent() {
  const { messages: allMessages, isLoaded, clearMessages } = useMessages()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedConversation, setSelectedConversation] = useState<ConversationGroup | null>(null)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "latest_ts", direction: "desc" })
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const itemsPerPage = 15

  // Smooth scroll to the bottom of the visible chat conversation
  useEffect(() => {
    if (selectedConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedConversation])

  // Groups log entries into unique conversation channels
  const conversationThreads = useMemo(() => {
    const groups: Record<string, ConversationGroup> = {}

    allMessages.forEach((message) => {
      const roomId = message.room_id

      if (!groups[roomId]) {
        groups[roomId] = {
          room_id: roomId,
          roomName: message.roomName || message.room_name || "Private Conversation",
          roomType: message.roomType || "Gateway",
          participants: [],
          categories: new Set<string>(),
          latest_ts: message.ts,
          latest_timestamp: message.timestamp,
          latest_message_preview: message.fullMessage,
          hasAttachments: false,
          messageCount: 0,
          messages: [],
        }
      }

      const currentGroup = groups[roomId]
      currentGroup.messages.push(message)
      currentGroup.categories.add(message.category)
      currentGroup.messageCount++
      
      if (message.attachments && message.attachments.length > 0) {
        groups[roomId].hasAttachments = true
      }

      if (message.ts >= currentGroup.latest_ts) {
        currentGroup.latest_ts = message.ts
        currentGroup.latest_timestamp = message.timestamp
        currentGroup.latest_message_preview = message.fullMessage
      }
    })

    Object.values(groups).forEach((group) => {
      const uniqueNames = new Set<string>()
      group.messages.forEach((m) => {
        if (m.sender) uniqueNames.add(m.sender)
      })
      group.participants = Array.from(uniqueNames)
      group.messages.sort((a, b) => a.ts - b.ts)
    })

    return Object.values(groups)
  }, [allMessages])

  // Filters and sorts grouped conversation rooms
  const processedConversations = useMemo(() => {
    let filtered = conversationThreads.filter((thread) => {
      const searchLower = searchQuery.toLowerCase()
      
      const matchesSearch =
        searchQuery === "" ||
        thread.roomName.toLowerCase().includes(searchLower) ||
        thread.participants.some(p => p.toLowerCase().includes(searchLower)) ||
        thread.messages.some(m => m.fullMessage.toLowerCase().includes(searchLower))

      const matchesCategory =
        categoryFilter === "all" ||
        Array.from(thread.categories).some(cat => cat.toLowerCase() === categoryFilter.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ||
        thread.messages.some(m => m.status.toLowerCase() === statusFilter.toLowerCase())

      return matchesSearch && matchesCategory && matchesStatus
    })

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === undefined || bValue === undefined) return 0
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }
    return filtered
  }, [conversationThreads, searchQuery, categoryFilter, statusFilter, sortConfig])

  useEffect(() => {
    if (processedConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(processedConversations[0])
    } else if (processedConversations.length === 0) {
      setSelectedConversation(null)
    }
  }, [processedConversations, selectedConversation])

  const totalPages = Math.ceil(processedConversations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentConversations = processedConversations.slice(startIndex, endIndex)

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  const toggleSort = (key: "latest_ts" | "roomName" | "messageCount") => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-zinc-950 h-screen w-full overflow-hidden">
      {/* APPBAR HEADER */}
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 shadow-sm z-10">
        <SidebarTrigger className="hover:bg-accent rounded-lg" />
        <div className="h-5 w-[1px] bg-slate-200 dark:bg-zinc-800" />
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600" />
          <h1 className="text-sm font-bold tracking-tight text-slate-800 dark:text-zinc-100">Audit Message Center</h1>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          {isLoaded && (
            <Button variant="ghost" size="sm" onClick={clearMessages} className="text-xs font-semibold text-muted-foreground hover:text-destructive h-9 px-3 rounded-lg mr-2">
              Remove All Entries
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-9 rounded-lg font-semibold shadow-xs" disabled={!isLoaded}>
            <Download className="mr-2 h-3.5 w-3.5 opacity-80" /> Download Log Batch
          </Button>
        </div>
      </header>

      {/* RENDER CLEAN UPLOAD CARD DRAGZONE IF BLANK */}
      {!isLoaded || allMessages.length === 0 ? (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1200px] w-full mx-auto mt-12">
          <FileUpload />
        </div>
      ) : (
        /* 🚀 RIGID PRO-LEVEL TWO-PANEL SPLIT WORKSPACE (FIXES COMPRESSION AND SIDEBAR CLASHES) */
        <div className="flex-1 grid grid-cols-[380px_1fr] h-full w-full min-h-0 overflow-hidden relative">
          
          {/* LEFT SIDEBAR: EXACT 380PX FIXED CHAT DIRECTORY */}
          <div className="border-r border-slate-200 bg-background flex flex-col h-full min-h-0 overflow-hidden w-[380px] shrink-0">
            
            {/* SEARCH AND FILTERS */}
            <div className="p-3 border-b space-y-2 bg-slate-50/60 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Filter by user name, keywords..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                  className="pl-8 h-9 border-slate-200 bg-background text-xs font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={categoryFilter} onValueChange={handleFilterChange(setCategoryFilter)}>
                  <SelectTrigger className="h-8 border-slate-200 text-[11px] font-semibold bg-background">
                    <SelectValue placeholder="Channel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="spam">Spam Records</SelectItem>
                    <SelectItem value="phishing">Phishing Indicators</SelectItem>
                    <SelectItem value="marketing">Marketing Material</SelectItem>
                    <SelectItem value="business">Internal Business</SelectItem>
                    <SelectItem value="sms">SMS Gateway</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
                  <SelectTrigger className="h-8 border-slate-200 text-[11px] font-semibold bg-background">
                    <SelectValue placeholder="Safety Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Security Status</SelectItem>
                    <SelectItem value="allowed">Allowed Transfers</SelectItem>
                    <SelectItem value="blocked">Blocked Violations</SelectItem>
                    <SelectItem value="flagged">Flagged Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-1 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                <span className="cursor-pointer hover:text-slate-700 flex items-center gap-1" onClick={() => toggleSort("latest_ts")}>
                  Recent Activity {sortConfig?.key === "latest_ts" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </span>
                <span className="cursor-pointer hover:text-slate-700 flex items-center gap-1" onClick={() => toggleSort("messageCount")}>
                  Log Volume {sortConfig?.key === "messageCount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </span>
              </div>
            </div>

            {/* CONVERSATION DIRECTORY TILES */}
            <div className="flex-1 min-h-0 relative">
              <ScrollArea className="h-full w-full">
                <div className="p-2 space-y-1">
                  {currentConversations.map((thread) => {
                    const isActive = selectedConversation?.room_id === thread.room_id
                    return (
                      <div
                        key={thread.room_id}
                        onClick={() => setSelectedConversation(thread)}
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 border text-left min-w-0 ${
                          isActive
                            ? "bg-blue-50/80 border-blue-200 shadow-xs"
                            : "bg-background border-transparent hover:border-slate-200 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-xs border transition-colors ${
                          isActive ? "bg-blue-600 border-blue-700 text-white" : "bg-slate-100 border-slate-200 text-slate-700"
                        }`}>
                          {thread.roomName.substring(0, 2).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className={`text-xs font-bold truncate tracking-tight ${isActive ? "text-blue-900" : "text-slate-900"}`}>
                              {thread.roomName}
                            </h4>
                            <span className="text-[9px] font-semibold text-slate-400 font-mono shrink-0">
                              {thread.latest_timestamp.split(",")[1]?.trim() || thread.latest_timestamp}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate">
                            <Users className="h-2.5 w-2.5 opacity-60 shrink-0" />
                            <span className="truncate">{thread.participants.join(", ")}</span>
                          </div>

                          <p className={`text-[11px] truncate pt-0.5 ${isActive ? "text-blue-700/80" : "text-slate-500"}`}>
                            {thread.hasAttachments && (
                              <span className="inline-flex items-center font-bold text-[9px] text-blue-600 bg-blue-50 px-1 rounded mr-1 shrink-0">
                                Media
                              </span>
                            )}
                            {thread.latest_message_preview}
                          </p>
                        </div>

                        <div className="shrink-0 self-center pl-1">
                          <span className={`inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold ${
                            isActive ? "bg-blue-600 text-white" : "bg-slate-100 border text-slate-500"
                          }`}>
                            {thread.messageCount}
                          </span>
                        </div>
                      </div>
                    )
                  })}

                  {currentConversations.length === 0 && (
                    <div className="text-center p-8 text-xs font-medium text-slate-400 italic">
                      No matching audit files resolved.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* DIRECTORY PAGINATION */}
            <div className="p-3 border-t bg-slate-50/50 flex items-center justify-between text-[11px] font-semibold text-slate-500 shrink-0">
              <span>Segment {currentPage} of {totalPages || 1}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-7 text-[11px] px-2 rounded-md" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>
                  Prev
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[11px] px-2 rounded-md" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: CHAT HISTORIC VIEWPORT */}
          <div className="flex-1 bg-slate-100/30 dark:bg-zinc-950/40 flex flex-col h-full min-w-0 overflow-hidden">
            {selectedConversation ? (
              <>
                {/* HEADER ROW ACTIONS PANEL */}
                <div className="p-4 bg-background border-b flex items-center justify-between shadow-xs shrink-0 min-w-0">
                  <div className="space-y-0.5 min-w-0 mr-4">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight truncate">
                      {selectedConversation.roomName}
                    </h2>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      Audited Channel Users: {selectedConversation.participants.join(", ")}
                    </p>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 text-blue-600 bg-blue-50 border-blue-100 whitespace-nowrap">
                      CONVERSATION HISTORY
                    </Badge>
                    <p className="text-[10px] font-mono text-slate-400">Total dialog links: {selectedConversation.messageCount}</p>
                  </div>
                </div>

                {/* FLOWING MESSAGE CHAT CONTAINER */}
                <div className="flex-1 min-h-0 relative">
                  <ScrollArea className="h-full w-full p-4 lg:p-6">
                    <div className="space-y-4 flex flex-col justify-end pr-2">
                      {selectedConversation.messages.map((msg, idx) => {
                        const isInternal = msg.senderEmail?.toLowerCase().includes("mwyattinsurance.com")

                        return (
                          <div
                            key={idx}
                            className={`flex flex-col max-w-[80%] ${isInternal ? "self-end items-end" : "self-start items-start"}`}
                          >
                            <span className="text-[10px] text-slate-400 font-bold mb-1 px-1 tracking-tight">
                              {msg.sender} • {msg.timestamp}
                            </span>
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed border shadow-xs transition-all ${
                                isInternal
                                  ? "bg-blue-600 border-blue-700 text-white rounded-tr-xs"
                                  : "bg-background border-slate-200 text-slate-800 dark:text-zinc-200 rounded-tl-xs"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.fullMessage}</p>

                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className={`mt-2.5 pt-2 border-t flex items-center gap-1.5 text-xs font-semibold ${
                                  isInternal ? "border-blue-500/30 text-blue-100" : "border-slate-100 text-blue-600"
                                }`}>
                                  <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                                  <span className="underline tracking-tight truncate cursor-pointer">
                                    {msg.attachments[0].filename || "attachment_stream.bin"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <FolderOpen className="h-8 w-8 opacity-20 mb-2" />
                <p className="text-xs font-medium italic">Select an available audited thread from the directory column to begin analysis mapping.</p>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  )
}
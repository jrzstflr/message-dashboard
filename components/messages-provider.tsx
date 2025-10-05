"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  processMessage,
  calculateStats,
  type RawMessage,
  type ProcessedMessage,
} from "@/lib/message-utils"

interface MessagesContextType {
  messages: ProcessedMessage[]
  stats: ReturnType<typeof calculateStats>
  isLoaded: boolean
  uploadMessages: (rawMessages: RawMessage[]) => void
  clearMessages: () => void
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined)

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ProcessedMessage[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  /**
   * ✅ FIXED: Normalize uploaded messages to match ProcessedMessage type
   * Removes references to 'content' and ensures 'fullMessage' is used consistently.
   */
  const uploadMessages = (rawMessages: RawMessage[]) => {
    const processed = rawMessages.map((msg, idx) => {
      const result = processMessage(msg, idx)

      return {
        ...result,

        // ✅ Always ensure we have a message body available for display
        fullMessage: result.fullMessage || msg.message || "",

        // ✅ Ensure sender info and subject are filled
        sender: result.sender || msg.author_user_name || "Unknown Sender",
        senderEmail: result.senderEmail || msg.author_user_email || "N/A",
        subject: result.subject || msg.room_name || "No Subject",

        // ✅ Normalize category and timestamp
        category: result.category || msg.room_type || "Uncategorized",
        timestamp:
          result.timestamp ||
          (msg.ts_iso
            ? new Date(msg.ts_iso).toLocaleString()
            : msg.ts
            ? new Date(msg.ts).toLocaleString()
            : "—"),

        // ✅ Preserve risk and status
        status: result.status || "Allowed",
        risk: result.risk || "Low",

        // ✅ Include recipients for modal display
        room_members: msg.room_members || [],
      }
    })

    setMessages(processed)
    setIsLoaded(true)
  }

  const clearMessages = () => {
    setMessages([])
    setIsLoaded(false)
  }

  const stats = calculateStats(messages)

  return (
    <MessagesContext.Provider
      value={{ messages, stats, isLoaded, uploadMessages, clearMessages }}
    >
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessagesContext)
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider")
  }
  return context
}

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { processMessage, calculateStats, type RawMessage, type ProcessedMessage } from "@/lib/message-utils"

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

  const uploadMessages = (rawMessages: RawMessage[]) => {
    const processed = rawMessages.map((msg, idx) => processMessage(msg, idx))
    setMessages(processed)
    setIsLoaded(true)
  }

  const clearMessages = () => {
    setMessages([])
    setIsLoaded(false)
  }

  const stats = calculateStats(messages)

  return (
    <MessagesContext.Provider value={{ messages, stats, isLoaded, uploadMessages, clearMessages }}>
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

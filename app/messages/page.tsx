// app/messages/page.tsx
"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MessagesContent } from "@/components/messages-content"

export default function MessagesPage() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <AppSidebar />
        <main className="flex-1 min-w-0 h-full overflow-hidden relative">
          <MessagesContent />
        </main>
      </div>
    </SidebarProvider>
  )
}
import { AppSidebar } from "@/components/app-sidebar"
import { MessagesContent } from "@/components/messages-content"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function MessagesPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <MessagesContent />
        </main>
      </div>
    </SidebarProvider>
  )
}

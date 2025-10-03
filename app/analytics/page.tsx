import { AppSidebar } from "@/components/app-sidebar"
import { AnalyticsContent } from "@/components/analytics-content"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AnalyticsPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <AnalyticsContent />
        </main>
      </div>
    </SidebarProvider>
  )
}

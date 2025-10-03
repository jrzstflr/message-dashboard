import { AppSidebar } from "@/components/app-sidebar"
import { AuditLogContent } from "@/components/audit-log-content"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AuditLogPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <AuditLogContent />
        </main>
      </div>
    </SidebarProvider>
  )
}

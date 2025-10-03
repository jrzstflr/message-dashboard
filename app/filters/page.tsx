import { AppSidebar } from "@/components/app-sidebar"
import { FiltersContent } from "@/components/filters-content"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function FiltersPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <FiltersContent />
        </main>
      </div>
    </SidebarProvider>
  )
}

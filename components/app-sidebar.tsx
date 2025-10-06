"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageSquare, BarChart3, FileText, Filter, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const mainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Audit Log",
    url: "/audit-log",
    icon: FileText,
  },
  {
    title: "Filters & Rules",
    url: "/filters",
    icon: Filter,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      {/* --- HEADER --- */}
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
            <Image
              src="/jrz_logo_v2.png"
              alt="App Logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Dashboard and Audit Management</span>
            <span className="text-xs text-muted-foreground">Professional Edition</span>
          </div>
        </div>
      </SidebarHeader>

      {/* --- MAIN CONTENT --- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={cn(
                      "transition-colors",
                      pathname === item.url && "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* --- FOOTER --- */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-muted-foreground">
          <div>Version 1.0.0</div>
          <div className="mt-1">© 2025 Jrz Dev | Dashboard and Filter Pro</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, AlertTriangle, CheckCircle2 } from "lucide-react"
import { MessageVolumeChart } from "@/components/chart/message-volume-chart"
import { FilterEffectivenessChart } from "@/components/chart/filter-effectiveness-chart"
import { CategoryDistributionChart } from "@/components/chart/category-distribution-chart"
import { RecentActivityTable } from "@/components/recent-activity-table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useMessages } from "@/components/messages-provider"
import { FileUpload } from "@/components/file-upload"

export function DashboardContent() {
  const { messages, stats, isLoaded } = useMessages()

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={!isLoaded}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {!isLoaded ? (
          <FileUpload />
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-muted-foreground">From uploaded data</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Filtered Messages</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.filtered.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-muted-foreground">
                      {((stats.filtered / stats.total) * 100).toFixed(1)}% of total
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Filter Accuracy</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.accuracy}%</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-muted-foreground">Based on categorization</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Flagged for Review</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.flagged.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-muted-foreground">
                      {((stats.flagged / stats.total) * 100).toFixed(1)}% of total
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-4 md:grid-cols-2">
              <MessageVolumeChart />
              <FilterEffectivenessChart />
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <CategoryDistributionChart />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Category Breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(stats.categories)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{category}</span>
                        <span className="text-sm font-semibold">{count.toLocaleString()}</span>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <RecentActivityTable />
          </>
        )}
      </div>
    </div>
  )
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function BarChart3({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react"
import { MessageVolumeChart } from "@/components/message-volume-chart"
import { FilterEffectivenessChart } from "@/components/filter-effectiveness-chart"
import { CategoryDistributionChart } from "@/components/category-distribution-chart"
import { RecentActivityTable } from "@/components/recent-activity-table"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardContent() {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">284,592</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-chart-1" />
                <span className="text-chart-1">+12.5%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filtered Messages</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42,891</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">-3.2%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filter Accuracy</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.7%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-chart-1" />
                <span className="text-chart-1">+0.3%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged for Review</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-destructive" />
                <span className="text-destructive">+8.1%</span> from last period
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
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Spam Detected</span>
                <span className="text-sm font-semibold">12,483</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Phishing Attempts</span>
                <span className="text-sm font-semibold">342</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Malware Blocked</span>
                <span className="text-sm font-semibold">89</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">False Positives</span>
                <span className="text-sm font-semibold">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Manual Reviews</span>
                <span className="text-sm font-semibold">456</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <RecentActivityTable />
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

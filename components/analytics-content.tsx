"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThreatTrendsChart } from "@/components/chart/threat-trends-chart"
import { ResponseTimeChart } from "@/components/chart/response-time-chart"
import { ComplianceMetricsChart } from "@/components/chart/compliance-metrics-chart"
import { GeographicDistributionChart } from "@/components/chart/geographic-distribution-chart"

export function AnalyticsContent() {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Analytics</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Analytics
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">142ms</div>
              <p className="text-xs text-muted-foreground mt-1">-23ms from previous period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">99.2%</div>
              <p className="text-xs text-muted-foreground mt-1">+0.5% from previous period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Threat Detection Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">97.8%</div>
              <p className="text-xs text-muted-foreground mt-1">+1.2% from previous period</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <ThreatTrendsChart />
          <ResponseTimeChart />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ComplianceMetricsChart />
          <GeographicDistributionChart />
        </div>

        {/* Detailed Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Detailed breakdown of system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <div className="font-medium">Message Throughput</div>
                  <div className="text-sm text-muted-foreground">Messages processed per hour</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">11,858</div>
                  <div className="text-xs text-chart-1">+8.3%</div>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <div className="font-medium">False Positive Rate</div>
                  <div className="text-sm text-muted-foreground">Incorrectly flagged messages</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">0.8%</div>
                  <div className="text-xs text-chart-3">-0.2%</div>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <div className="font-medium">System Uptime</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">99.98%</div>
                  <div className="text-xs text-chart-1">+0.01%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Audit Compliance</div>
                  <div className="text-sm text-muted-foreground">Regulatory requirements met</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs text-muted-foreground">Maintained</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

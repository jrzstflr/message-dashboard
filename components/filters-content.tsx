"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Power, PowerOff } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

const mockFilters = [
  {
    id: 1,
    name: "Phishing Detection",
    description: "Detects and blocks phishing attempts using AI-powered analysis",
    enabled: true,
    priority: "High",
    messagesFiltered: 12483,
    accuracy: 98.7,
  },
  {
    id: 2,
    name: "Spam Filter",
    description: "Identifies and filters spam messages based on content patterns",
    enabled: true,
    priority: "High",
    messagesFiltered: 28942,
    accuracy: 97.2,
  },
  {
    id: 3,
    name: "Malware Scanner",
    description: "Scans attachments and links for malicious content",
    enabled: true,
    priority: "Critical",
    messagesFiltered: 342,
    accuracy: 99.9,
  },
  {
    id: 4,
    name: "Marketing Filter",
    description: "Categorizes marketing and promotional emails",
    enabled: true,
    priority: "Medium",
    messagesFiltered: 15678,
    accuracy: 95.4,
  },
  {
    id: 5,
    name: "Content Policy Enforcement",
    description: "Enforces company content policies and compliance rules",
    enabled: true,
    priority: "High",
    messagesFiltered: 892,
    accuracy: 96.8,
  },
  {
    id: 6,
    name: "Sensitive Data Detection",
    description: "Identifies messages containing sensitive or confidential information",
    enabled: false,
    priority: "Medium",
    messagesFiltered: 0,
    accuracy: 94.1,
  },
]

export function FiltersContent() {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Filters & Rules</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Filter
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Filter Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">1 disabled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Filtered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">58,337</div>
              <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">97.4%</div>
              <p className="text-xs text-muted-foreground mt-1">Across all filters</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142ms</div>
              <p className="text-xs text-muted-foreground mt-1">Average per message</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter List */}
        <div className="space-y-4">
          {mockFilters.map((filter) => (
            <Card key={filter.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{filter.name}</CardTitle>
                      <Badge
                        variant={
                          filter.priority === "Critical"
                            ? "destructive"
                            : filter.priority === "High"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {filter.priority}
                      </Badge>
                      {filter.enabled ? (
                        <Badge variant="outline" className="gap-1">
                          <Power className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <PowerOff className="h-3 w-3" />
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{filter.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={filter.enabled} />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-8">
                  <div>
                    <div className="text-sm text-muted-foreground">Messages Filtered</div>
                    <div className="text-2xl font-bold">{filter.messagesFiltered.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                    <div className="text-2xl font-bold">{filter.accuracy}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

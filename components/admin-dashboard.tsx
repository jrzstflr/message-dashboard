"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, DollarSign, ShoppingCart, TrendingUp, MoreVertical, Download, Filter } from "lucide-react"

// Mock data
const mockOrders = [
  {
    id: "1001",
    customer: "John Doe",
    email: "john@example.com",
    total: 129.99,
    status: "completed",
    date: "2025-03-01",
  },
  { id: "1002", customer: "Jane Smith", email: "jane@example.com", total: 89.5, status: "pending", date: "2025-03-02" },
  {
    id: "1003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    total: 249.99,
    status: "processing",
    date: "2025-03-02",
  },
  {
    id: "1004",
    customer: "Alice Brown",
    email: "alice@example.com",
    total: 159.0,
    status: "completed",
    date: "2025-03-03",
  },
  {
    id: "1005",
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    total: 199.99,
    status: "cancelled",
    date: "2025-03-03",
  },
]

const mockStats = [
  { title: "Total Revenue", value: "$12,345", change: "+12.5%", icon: DollarSign },
  { title: "Total Orders", value: "1,234", change: "+8.2%", icon: ShoppingCart },
  { title: "Total Customers", value: "892", change: "+15.3%", icon: Users },
  { title: "Growth Rate", value: "23.5%", change: "+4.1%", icon: TrendingUp },
]

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "processing":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your store and orders</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="mr-2 size-4" />
                Export
              </Button>
              <Switch />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mockStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 dark:text-green-400">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Manage and track customer orders</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 size-4" />
                Filter
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="mt-4 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search orders, customers, or emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="text-muted-foreground">{order.email}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="font-medium">${order.total}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

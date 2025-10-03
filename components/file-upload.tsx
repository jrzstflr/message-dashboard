"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileJson, AlertCircle, CheckCircle2, X } from "lucide-react"
import { useMessages } from "@/components/messages-provider"
import { Alert, AlertDescription } from "../components/ui/alert"
import type { RawMessage } from "../lib/message-utils"

export function FileUpload() {
  const { uploadMessages, clearMessages, isLoaded, messages } = useMessages()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      setIsProcessing(true)

      try {
        // Validate file type
        if (!file.name.toLowerCase().endsWith(".json")) {
          throw new Error("Please upload a JSON file")
        }

        // Read file
        const text = await file.text()
        const data = JSON.parse(text)

        // Validate data structure
        if (!Array.isArray(data)) {
          throw new Error("JSON file must contain an array of messages")
        }

        if (data.length === 0) {
          throw new Error("JSON file is empty")
        }

        // Validate first message has required fields
        const firstMsg = data[0]
        const requiredFields = ["author_user_email", "author_user_name", "message", "ts_iso"]

        const missingOrInvalidFields = requiredFields.filter((field) => {
          const value = firstMsg[field]
          return typeof value !== "string" || value.trim() === ""
        })

        if (missingOrInvalidFields.length > 0) {
          throw new Error(
            `Missing or invalid fields: ${missingOrInvalidFields.join(", ")}`
          )
        }

        // Upload messages
        uploadMessages(data as RawMessage[])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process file")
      } finally {
        setIsProcessing(false)
      }
    },
    [uploadMessages],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  if (isLoaded) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Data Loaded Successfully
              </CardTitle>
              <CardDescription>
                {messages.length.toLocaleString()} messages processed and ready for analysis
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearMessages}>
              <X className="mr-2 h-4 w-4" />
              Clear Data
            </Button>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Message Data</CardTitle>
        <CardDescription>Upload your data.json file to begin analyzing messages</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            ${isProcessing ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-primary/50"}
          `}
        >
          <input
            type="file"
            accept=".json"
            onChange={handleFileInput}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={isProcessing}
          />

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {isProcessing ? (
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            ) : (
              <FileJson className="h-8 w-8 text-primary" />
            )}
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold">
              {isProcessing ? "Processing file..." : "Drop your data.json file here"}
            </p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>

          <Button variant="secondary" disabled={isProcessing}>
            <Upload className="mr-2 h-4 w-4" />
            Select File
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold">Expected JSON format:</p>
          <pre className="rounded-lg bg-muted p-3 text-xs overflow-x-auto">
            {`[
  {
    "author_user_email": "user@example.com",
    "author_user_name": "John Doe",
    "message": "Message content...",
    "room_name": "Room name",
    "room_type": "direct",
    "ts_iso": "2024-01-01T12:00:00Z"
  }
]`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}

// components/file-upload.tsx
"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileJson, AlertCircle, CheckCircle2, X, Loader2 } from "lucide-react"
import { useMessages } from "@/components/messages-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RawMessageSchema, type RawMessage } from "@/lib/message-utils"

export function FileUpload() {
  const { uploadMessages, clearMessages, isLoaded, messages } = useMessages()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const workerRef = useRef<Worker | null>(null)

  // Initialize background worker thread safely on mount
  useEffect(() => {
    workerRef.current = new Worker("/workers/json-parser.worker.js")
    return () => workerRef.current?.terminate()
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return
      setError(null)
      setIsProcessing(true)

      if (!file.name.toLowerCase().endsWith(".json")) {
        setError("Invalid file extension. Please drop a verified .json file.")
        setIsProcessing(false)
        return
      }

      try {
        const text = await file.text()

        if (!workerRef.current) {
          throw new Error("Worker thread failed to initialize.")
        }

        // Send text to background thread
        workerRef.current.postMessage({ text })

        // Listen for parsed response from worker thread
        workerRef.current.onmessage = (e) => {
          const { success, data, error: workerError } = e.data

          if (!success) {
            setError(`JSON Structure Error: ${workerError}`)
            setIsProcessing(false)
            return
          }

          // Validate structural mapping with Zod
          const ArraySchema = z.array(RawMessageSchema)
          const validationResult = ArraySchema.safeParse(data)

          if (!validationResult.success) {
            const firstError = validationResult.error.errors[0]
            setError(`Data mismatch at path [${firstError.path.join(".")}]: ${firstError.message}`)
            setIsProcessing(false)
            return
          }

          uploadMessages(validationResult.data as RawMessage[])
          setIsProcessing(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delegate file parsing.")
        setIsProcessing(false)
      }
    },
    [uploadMessages],
  )

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  if (isLoaded) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-sm">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Audit Records Loaded</CardTitle>
                <CardDescription className="text-xs text-emerald-700/80">
                  {messages.length.toLocaleString()} diagnostic logs processed successfully.
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearMessages} className="text-muted-foreground hover:text-destructive">
              <X className="mr-1.5 h-4 w-4" /> Clear Audit
            </Button>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-muted/60">
      <CardHeader>
        <CardTitle className="text-lg font-bold tracking-tight">Console Log Integration</CardTitle>
        <CardDescription>Upload exported administrative log batches to compile message maps.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
          className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 transition-all ${
            isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-muted-foreground/25 bg-muted/20"
          } ${isProcessing ? "opacity-60 pointer-events-none" : "cursor-pointer hover:bg-muted/40 hover:border-muted-foreground/40"}`}
        >
          <input
            type="file"
            accept=".json"
            onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file) }}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={isProcessing}
          />

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background border shadow-sm text-primary">
            {isProcessing ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <FileJson className="h-6 w-6" />}
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold tracking-tight">{isProcessing ? "Processing Stream Off-Thread..." : "Drop audit data.json file here"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Max batch scale recommendation: ~50MB</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4 py-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-mono">{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
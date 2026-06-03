import { z } from "zod"

export const RoomMemberSchema = z.object({
  room_member_id: z.string(),
  room_member_name: z.string(),
})

export const RawMessageSchema = z.object({
  // Gracefully handle missing or null emails
  author_user_email: z.string().nullish().transform(val => val || "no-email@provided.com"),
  author_user_id: z.string(),
  author_user_name: z.string().nullish().transform(val => val || "Unknown User"),
  // Handle empty messages (e.g., when it's just a photo attachment)
  message: z.string().nullish().transform(val => val || "[No text content]"),
  room_id: z.string(),
  room_members: z.array(RoomMemberSchema).default([]),
  room_name: z.string().nullish().transform(val => val || "Unknown Room"),
  room_type: z.string(),
  ts: z.number(),
  ts_iso: z.string(),
  // Capture attachments if they exist
  attachments: z.array(z.any()).optional(),
})

export type RawMessage = z.infer<typeof RawMessageSchema>

export interface ProcessedMessage extends RawMessage {
  id: string
  timestamp: string
  sender: string
  senderEmail: string
  subject: string
  category: string
  status: "Allowed" | "Blocked" | "Flagged"
  risk: "Low" | "Medium" | "High" | "Critical"
  roomType: string
  roomName: string
  fullMessage: string
}

type CategorizationRule = {
  name: string
  category: string
  risk: ProcessedMessage["risk"]
  status: ProcessedMessage["status"]
  match: (content: string, email: string, roomType: string) => boolean
}

const CATEGORY_RULES: CategorizationRule[] = [
  {
    name: "Phishing Detection",
    category: "Phishing",
    risk: "High",
    status: "Blocked",
    match: (c, e) =>
      (c.includes("verify") && c.includes("account")) ||
      c.includes("suspended") ||
      (c.includes("click here") && c.includes("urgent")) ||
      c.includes("confirm your") ||
      (e.endsWith(".ru") && !e.includes("mwyattinsurance")),
  },
  {
    name: "Spam Detection",
    category: "Spam",
    risk: "High",
    status: "Blocked",
    match: (c) =>
      (c.includes("won") && c.includes("$")) ||
      (c.includes("congratulations") && c.includes("prize")) ||
      c.includes("click here now") ||
      c.includes("limited time offer"),
  },
  {
    name: "Marketing",
    category: "Marketing",
    risk: "Low",
    status: "Allowed",
    match: (c, e) =>
      c.includes("newsletter") ||
      c.includes("unsubscribe") ||
      c.includes("promotion") ||
      e.includes("marketing") ||
      e.includes("newsletter"),
  },
  {
    name: "Internal Business",
    category: "Business",
    risk: "Low",
    status: "Allowed",
    match: (c, e, rt) =>
      e.includes("mwyattinsurance.com") ||
      rt === "direct" ||
      c.includes("meeting") ||
      c.includes("project"),
  },
  {
    name: "SMS Traffic",
    category: "SMS",
    risk: "Low",
    status: "Allowed",
    match: (_, __, rt) => rt === "sms",
  },
]

function categorizeMessage(message: RawMessage): {
  category: string
  risk: ProcessedMessage["risk"]
  status: ProcessedMessage["status"]
} {
  const content = message.message.toLowerCase()
  const email = message.author_user_email.toLowerCase()
  const roomType = message.room_type.toLowerCase()

  for (const rule of CATEGORY_RULES) {
    if (rule.match(content, email, roomType)) {
      return { category: rule.category, risk: rule.risk, status: rule.status }
    }
  }

  return { category: "Uncategorized", risk: "Medium", status: "Flagged" }
}

export function processMessage(
  rawMessage: RawMessage,
  index: number
): ProcessedMessage {
  const { category, risk, status } = categorizeMessage(rawMessage)

  const subject =
    rawMessage.message.length > 50
      ? `${rawMessage.message.substring(0, 50)}...`
      : rawMessage.message

  const timestamp = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(rawMessage.ts_iso))

  return {
    ...rawMessage, 
    id: `MSG-${String(index + 1).padStart(6, "0")}`,
    timestamp,
    sender: rawMessage.author_user_name,
    senderEmail: rawMessage.author_user_email,
    subject,
    category,
    status,
    risk,
    roomType: rawMessage.room_type,
    roomName: rawMessage.room_name,
    fullMessage: rawMessage.message,
  }
}

export function calculateStats(messages: ProcessedMessage[]) {
  return messages.reduce(
    (acc, msg) => {
      acc.total++
      if (msg.status === "Blocked") acc.filtered++
      if (msg.status === "Flagged") acc.flagged++
      if (msg.status === "Allowed") acc.allowed++

      acc.categories[msg.category] = (acc.categories[msg.category] || 0) + 1
      acc.risks[msg.risk] = (acc.risks[msg.risk] || 0) + 1

      return acc
    },
    {
      total: 0,
      filtered: 0,
      flagged: 0,
      allowed: 0,
      categories: {} as Record<string, number>,
      risks: {} as Record<string, number>,
      accuracy: "0.0",
    }
  )
}
export interface RawMessage {
  author_user_email: string
  author_user_id: string
  author_user_name: string
  message: string
  room_id: string
  room_members: Array<{
    room_member_id: string
    room_member_name: string
  }>
  room_name: string
  room_type: string
  ts: number
  ts_iso: string
}

export interface ProcessedMessage {
  id: string
  timestamp: string
  sender: string
  senderEmail: string
  subject: string
  category: string
  status: string
  risk: string
  roomType: string
  roomName: string
  fullMessage: string
}

function categorizeMessage(message: RawMessage): {
  category: string
  risk: string
  status: string
} {
  const content = message.message.toLowerCase()
  const email = message.author_user_email.toLowerCase()

  // Phishing detection
  if (
    (content.includes("verify") && content.includes("account")) ||
    content.includes("suspended") ||
    (content.includes("click here") && content.includes("urgent")) ||
    content.includes("confirm your") ||
    (email.includes(".ru") && !email.includes("gertzrosen"))
  ) {
    return { category: "Phishing", risk: "High", status: "Blocked" }
  }

  // Spam detection
  if (
    (content.includes("won") && content.includes("$")) ||
    (content.includes("congratulations") && content.includes("prize")) ||
    content.includes("click here now") ||
    content.includes("limited time offer")
  ) {
    return { category: "Spam", risk: "High", status: "Blocked" }
  }

  // Marketing
  if (
    content.includes("newsletter") ||
    content.includes("unsubscribe") ||
    content.includes("promotion") ||
    email.includes("marketing") ||
    email.includes("newsletter")
  ) {
    return { category: "Marketing", risk: "Low", status: "Allowed" }
  }

  // Internal/Business
  if (
    email.includes("gertzrosen.com") ||
    message.room_type === "direct" ||
    content.includes("meeting") ||
    content.includes("project")
  ) {
    return { category: "Business", risk: "Low", status: "Allowed" }
  }

  // SMS messages
  if (message.room_type === "sms") {
    return { category: "SMS", risk: "Low", status: "Allowed" }
  }

  // Default - flag for review
  return { category: "Uncategorized", risk: "Medium", status: "Flagged" }
}

export function processMessage(rawMessage: RawMessage, index: number): ProcessedMessage {
  const { category, risk, status } = categorizeMessage(rawMessage)

  // Create a subject line from the first 50 chars of message
  const subject = rawMessage.message.length > 50 ? rawMessage.message.substring(0, 50) + "..." : rawMessage.message

  // Format timestamp
  const date = new Date(rawMessage.ts_iso)
  const timestamp = date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return {
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
  const total = messages.length
  const filtered = messages.filter((m) => m.status === "Blocked").length
  const flagged = messages.filter((m) => m.status === "Flagged").length
  const allowed = messages.filter((m) => m.status === "Allowed").length

  const accuracy = total > 0 ? (((allowed + filtered) / total) * 100).toFixed(1) : "0.0"

  // Category breakdown
  const categories = messages.reduce(
    (acc, msg) => {
      acc[msg.category] = (acc[msg.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Risk breakdown
  const risks = messages.reduce(
    (acc, msg) => {
      acc[msg.risk] = (acc[msg.risk] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    total,
    filtered,
    flagged,
    allowed,
    accuracy,
    categories,
    risks,
  }
}

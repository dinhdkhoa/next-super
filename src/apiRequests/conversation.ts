import http from "@/lib/https"

export interface Conversation {
  content: string
  receiver_id: string
  sender_id: string
  _id: string
}

export interface GetConversationRes {
  result: {
    limit: number
    page: number
    total_page: number
    conversations: Conversation[]
  }
}

const conversationAPI = {
  getConversation: ({
    limit = 10,
    page = 1,
    receiverId
  }: {
    limit?: number
    page?: number
    receiverId: string
  }) => {
    const url = joinUrlWithObj(`conversations/receiver/${receiverId}`, {
      limit,
      page
    })
    const a = http.get<GetConversationRes>(url)
    return new Promise<typeof a>((resolve) => {
      resolve(a)
    })
  }
}

export default conversationAPI

// Function to join a URL with query parameters from an object
function joinUrlWithObj(url: string, obj: any) {
  return url + (url.indexOf("?") === -1 ? "?" : "&") + getQuery(obj)
}

// Function to convert an object into a query string
function getQuery(obj: any) {
  if (obj == null) return ""

  return Object.keys(obj)
    .map((key) => {
      const value = obj[key]
      if (value == null) return null // Skip null values

      // Handle Date objects
      const paramValue = value instanceof Date ? value.toISOString() : value
      return `${encodeURIComponent(key)}=${encodeURIComponent(paramValue)}`
    })
    .filter(Boolean) // Remove any null values
    .join("&") // Join the parameters with '&'
}

const a = {
  limit: 10,
  page: 1,
  total_page: 1,
  conversations: [
    {
      _id: "67adbbf1bbf0f2f28ad76b96",
      sender_id: "67a4fd97e57cecea777ed3c3",
      receiver_id: "67a4fd97e57cecea777ed3bb",
      content: "123123123",
      created_at: "2025-02-13T09:31:29.330Z",
      updated_at: "2025-02-13T09:31:29.330Z"
    }
  ]
}

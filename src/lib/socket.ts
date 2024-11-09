import { io, Socket } from "socket.io-client"
import envConfig from "@/config"
import StorageService from "./storage"
import { SocketEventListener } from "@/constants/socket"

// "undefined" means the URL will be computed from the `window.location` object

// export const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
//   auth: {
//     Authorization: `Bearer ${StorageService.getAccessToken()}`
//   }
// })
type SocketEventListener = typeof SocketEventListener[keyof typeof SocketEventListener];
class WebSocket {
  private socket: Socket | null = null
  public isConnected : boolean = false

  connect() {
    const accessToken = StorageService.getAccessToken()
    if (!accessToken) {
      console.error("Don't have any access token to establish socket")
      return
    }
    if (!this.socket) {
      this.socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
        auth: {
          Authorization: `Bearer ${accessToken}`
        },
        reconnection: true, // Enable reconnection
        reconnectionAttempts: 5, // Max number of reconnection attempts before giving up
        reconnectionDelay: 1000, // Delay between reconnection attempts (in milliseconds)
        reconnectionDelayMax: 5000, // Maximum delay between attempts (in milliseconds)
        timeout: 20000 // Connection timeout before failing
      })

      this.socket.on(SocketEventListener.Connect, () => {
        this.isConnected = true
        console.log("WebSocket connected:", this.socket?.id)
      })

      this.socket.on(SocketEventListener.Disconnect, () => {
        this.isConnected = false  
        console.log("WebSocket disconnected")
      })
    }
  }

  on<T>(event: SocketEventListener, callback: (...args: T[]) => void) {
    this.socket?.on(event, callback)
  }

  off<T>(event: SocketEventListener, callback: (...args: T[]) => void) {
    this.socket?.off(event, callback)
  }

  disconnect() {
    if (this.socket) {
      this.isConnected = false  
      this.socket.disconnect()
      this.socket = null
    }
  }
}
export const socket = new WebSocket()

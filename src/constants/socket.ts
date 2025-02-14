export const SocketEventListener = {
  Connect: "connect",
  ConnectionError: "connect_error",
  Disconnect: "disconnect",
  UpdateOrder: "update-order",
  NewOrder: "new-order",
  Payment: "payment",
  RefreshToken: "refresh-token",
  Logout: "logout",
  ReceivePrivateMessage: "reply_private_message"
} as const

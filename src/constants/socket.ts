export const SocketEventListener = {
  Connect: 'connect',
  Disconnect: 'disconnect',
  UpdateOrder: 'update-order',
  NewOrder: 'new-order',
  Payment: 'payment',
  RefreshToken: 'refresh-token',
} as const;
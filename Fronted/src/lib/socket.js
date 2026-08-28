import { io } from "socket.io-client";

// VITE_SOCKET_URL should be your deployed backend's root URL (no /api suffix),
// e.g. https://coinsblogs-api.onrender.com — falls back to localhost in dev.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

let socket = null;

export function connectSocket(userId) {
  if (!userId || socket?.connected) return socket;
  socket = io(SOCKET_URL, {
    query: { userId },
    withCredentials: true,
  });
  return socket;
}

export function disconnectSocket() {
  if (socket?.connected) socket.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}

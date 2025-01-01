// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

const BACKEND_URL = "http://localhost:3001"; // oder deine Railway-/Render-URL

// Optional: Typ für den Socket definieren, falls du eigene Events typisieren willst
export const socket: Socket = io(BACKEND_URL, {
  // z. B.: autoConnect: false
});

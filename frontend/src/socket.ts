import { io } from "socket.io-client";

// adjust to backend URL
let VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
if (!VITE_BACKEND_URL) {
  VITE_BACKEND_URL = "http://localhost:3000";
}
console.log("Connecting to backend at:", VITE_BACKEND_URL);
export const socket = io(VITE_BACKEND_URL);

import { io } from "socket.io-client";

// adjust to backend URL
export const socket = io("http://localhost:3001");

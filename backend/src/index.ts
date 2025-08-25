import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { Player, Room, Tile } from "./types.ts";
import { placeOrb } from "./game.ts";


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let rooms: Record<string, Room> = {};

// --- Utility: random room code ---
function generateRoomId(): string {
  return Math.random().toString(36).substr(2, 6);
}

// --- Cleanup every 5 min ---
setInterval(() => {
  const now = Date.now();
  for (const roomId in rooms) {
    if (now - rooms[roomId].lastMoveTime > 5 * 60 * 1000) {
      delete rooms[roomId];
      console.log(`Room ${roomId} expired due to inactivity`);
    }
  }
}, 5 * 60 * 1000);

// --- Socket.IO Events ---
io.on("connection", (socket: Socket) => {
  console.log("Client connected:", socket.id);

  // Create Room
  socket.on("createRoom", ({ playerName, customCode, maxPlayers }) => {
    const roomId = customCode || generateRoomId();
    if (rooms[roomId]) {
      socket.emit("errorMessage", { message: "Room already exists" });
      return;
    }

    const rows = 8;
    const cols = 6;
    const newBoard = Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => new Tile()) // Creates a new Tile for every cell
    );

    const newRoom: Room = {
      players: [
        new Player(socket.id, playerName, "red")// first player
      ],
      maxPlayers: maxPlayers || 2,
      board: newBoard,
      currentTurn: 0,
      lastMoveTime: Date.now(),
      winner: null,
      moves: [],
    };

    rooms[roomId] = newRoom;

    socket.join(roomId);
    socket.emit("roomCreated", { roomId });
    console.log(`Room ${roomId} created by ${playerName} with Socket ID: ${socket.id}`);
  });

  // Join Room
  socket.on("joinRoom", ({ roomId, playerName }) => {
    const room = rooms[roomId];
    if (!room) {
      socket.emit("errorMessage", { message: "Room does not exist" });
      return;
    }
    if (room.players.length >= room.maxPlayers) {
      socket.emit("errorMessage", { message: "Room is full" });
      return;
    }

    const colors = ["red", "blue", "green", "yellow"];
    const color = colors[room.players.length];

    room.players.push(new Player(socket.id, playerName, color));
    socket.join(roomId);

    io.to(roomId).emit("roomJoined", {
      roomId,
      room: room,
    });

    console.log(`${playerName} joined room ${roomId}`);
  });

  // Place Orb
  socket.on("placeOrb", ({ roomId, x, y }) => {
    const room: Room = rooms[roomId];
    if (!room) return;

    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex !== room.currentTurn) {
      socket.emit("errorMessage", { message: "Not your turn" });
      return;
    }

    placeOrb(room, x, y, playerIndex);
    
    // if (room.winner !== null) {
    //   io.to(roomId).emit("gameDone", {
    //     winner: room.winner
    //   });
    // }
    // else{
      io.to(roomId).emit("updateState", {
        room: room,
      });
    // }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

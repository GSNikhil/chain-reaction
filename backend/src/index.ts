import express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
import { Player, Room, Tile } from "./types";
import { placeOrb } from "./game";
// import cors from "cors"; // Import the cors middleware


const app = express();
const server = http.createServer(app);

// Use the cors middleware
// app.use(cors());

// const io = new Server(server, {
//   cors: { origin: "*" },
// });

const io = new Server(server, {
  cors: {
    origin: ["https://chainreactiongamengs.netlify.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});


let rooms: Record<string, Room> = {};

const colors = [
      "red",
      "blue",
      "green",
      "yellow",
      "cyan",     // bright teal-blue
      "magenta",  // vivid pink-purple
      "orange",   // strong warm tone, distinct from red/yellow
      "white"      // neon green, brighter than standard green
];

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
      socket.emit("errorMessage", { message: `Room ${roomId} already exists. Create a new room or click Join Room button.` });
      return;
    }

    const rows = 8;
    const cols = 6;
    const newBoard = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => new Tile()) // Creates a new Tile for every cell
    );

    const newRoom: Room = {
      players: [
        new Player(socket.id, playerName, colors[0])// first player
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
    room.moves = [];
    // }
  });

  socket.on("replayRoom", ({ roomId }) => {
    if (!rooms[roomId]) return;
    const room = rooms[roomId];
    for (const player of room.players) {
      player.eliminated = false;
      player.hasPlayed = false;
    }
    room.currentTurn = 0;
    room.winner = null;
    room.board = room.board.map(row => row.map(() => new Tile()));
    room.moves = [];
    room.lastMoveTime = Date.now();
    io.to(roomId).emit("resetBoard", { room });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

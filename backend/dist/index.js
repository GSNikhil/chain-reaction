"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const socket_io_1 = require("socket.io");
const types_1 = require("./types");
const game_1 = require("./game");
// import cors from "cors"; // Import the cors middleware
const app = (0, express_1.default)();
const server = http.createServer(app);
// Use the cors middleware
// app.use(cors());
// const io = new Server(server, {
//   cors: { origin: "*" },
// });
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://chainreactiongamengs.netlify.app",
        methods: ["GET", "POST"],
        credentials: true
    }
});
let rooms = {};
// --- Utility: random room code ---
function generateRoomId() {
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
io.on("connection", (socket) => {
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
        const newBoard = Array.from({ length: rows }, () => Array.from({ length: cols }, () => new types_1.Tile()) // Creates a new Tile for every cell
        );
        const newRoom = {
            players: [
                new types_1.Player(socket.id, playerName, "red") // first player
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
        room.players.push(new types_1.Player(socket.id, playerName, color));
        socket.join(roomId);
        io.to(roomId).emit("roomJoined", {
            roomId,
            room: room,
        });
        console.log(`${playerName} joined room ${roomId}`);
    });
    // Place Orb
    socket.on("placeOrb", ({ roomId, x, y }) => {
        const room = rooms[roomId];
        if (!room)
            return;
        const playerIndex = room.players.findIndex((p) => p.id === socket.id);
        if (playerIndex !== room.currentTurn) {
            socket.emit("errorMessage", { message: "Not your turn" });
            return;
        }
        (0, game_1.placeOrb)(room, x, y, playerIndex);
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

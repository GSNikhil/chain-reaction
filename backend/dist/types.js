"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.Player = exports.Tile = void 0;
// types.ts
class Tile {
    constructor(count = 0, owner = null) {
        this.count = count;
        this.owner = owner;
    }
}
exports.Tile = Tile;
// Room and Player interfaces remain unchanged
class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.eliminated = false;
        this.hasPlayed = false;
    }
}
exports.Player = Player;
class Room {
    constructor(players = [], maxPlayers, board, currentTurn = 0, lastMoveTime) {
        this.players = players;
        this.maxPlayers = maxPlayers;
        this.board = board;
        this.currentTurn = currentTurn;
        this.lastMoveTime = lastMoveTime;
        this.winner = null;
        this.moves = [];
    }
}
exports.Room = Room;

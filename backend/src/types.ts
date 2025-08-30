// types.ts
export class Tile {
  count: number; // number of orbs on the tile
  owner: number | null; // player index or null if unowned, different from socket ID

  constructor(count: number = 0, owner: number | null = null) {
    this.count = count;
    this.owner = owner;
  }
}

export type Board = Tile[][];

export type Move = {
  x: number;
  y: number;
  count: number;
  owner: number | null;
};

// Room and Player interfaces remain unchanged
export class Player {
  id: string; // socket ID
  name: string;
  color: string;
  eliminated: boolean;
  hasPlayed: boolean;

  constructor(id: string, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.eliminated = false;
    this.hasPlayed = false;
  }
}

export class Room {
  players: Player[];
  maxPlayers: number;
  board: Board;
  currentTurn: number; // index of players[]
  lastMoveTime: number;
  winner: number | null; // index of players[] or null if no winner yet
  moves: Move[]; // history of board states

  constructor(players: Player[] = [], maxPlayers: number, board: Board, currentTurn: number = 0, lastMoveTime: number) {
    this.players = players;
    this.maxPlayers = maxPlayers;
    this.board = board;
    this.currentTurn = currentTurn;
    this.lastMoveTime = lastMoveTime;
    this.winner = null;
    this.moves = [];
  }
}
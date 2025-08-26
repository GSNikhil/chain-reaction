"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrb = placeOrb;
function criticalMass(board, x, y) {
    const rows = board.length;
    const cols = board[0].length;
    // Corners -> 2 neighbors -> max = 1
    // Edges -> 3 neighbors -> max = 2
    // Center -> 4 neighbors -> max = 3
    let neighbors = 0;
    if (x > 0)
        neighbors++;
    if (x < rows - 1)
        neighbors++;
    if (y > 0)
        neighbors++;
    if (y < cols - 1)
        neighbors++;
    return neighbors;
}
function placeOrb(room, x, y, playerIndex) {
    const board = room.board;
    const tile = board[x][y];
    room.moves = []; // clear move history on new move
    if (room.currentTurn !== playerIndex) {
        return; // { board, eliminated: [], winner: null }; // Not player's turn
    }
    if (tile.owner === null) {
        tile.owner = playerIndex;
    }
    if (tile.owner !== playerIndex) {
        return; // { board, eliminated: [], winner: null }; // Can't place on opponent
    }
    const rows = board.length;
    const cols = board[0].length;
    room.players[playerIndex].hasPlayed = true;
    board[x][y].count += 1;
    board[x][y].owner = playerIndex;
    let queue = [[x, y]];
    while (queue.length > 0) {
        // Create a deep copy of the board before a change happens
        const boardCopy = structuredClone(board);
        room.moves.push(boardCopy);
        const [cx, cy] = queue.shift();
        const currentTile = board[cx][cy];
        let critical_mass = criticalMass(board, cx, cy) - 1;
        if (currentTile.count > critical_mass) {
            currentTile.count = 0;
            currentTile.owner = null;
            const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (const [dx, dy] of directions) {
                const nx = cx + dx;
                const ny = cy + dy;
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
                    board[nx][ny].count += 1;
                    board[nx][ny].owner = playerIndex;
                    queue.push([nx, ny]);
                }
            }
        }
    }
    // Push the final state after the while loop has completed
    const finalBoardCopy = JSON.parse(JSON.stringify(board));
    room.moves.push(finalBoardCopy);
    // Get player counts
    const playerCounts = new Array(room.players.length).fill(0);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const t = board[i][j];
            if (t.owner !== null) {
                playerCounts[t.owner]++;
            }
        }
    }
    // Find eliminated players
    for (let i = 0; i < playerCounts.length; i++) {
        if (playerCounts[i] === 0 && room.players[i].hasPlayed) {
            room.players[i].eliminated = true;
        }
    }
    // Check for winner
    const activePlayers = room.players.filter(p => !p.eliminated);
    if (activePlayers.length === 1) {
        room.winner = room.players.findIndex(p => !p.eliminated);
    }
    // update last move time
    room.lastMoveTime = Date.now();
    // Get inx of next active player
    for (let i = playerIndex + 1; i < room.players.length + playerIndex; i++) {
        const idx = i % room.players.length;
        if (!room.players[idx].eliminated) {
            room.currentTurn = idx;
            break;
        }
    }
    return; // { board, eliminated, winner:  curr_winner};
}

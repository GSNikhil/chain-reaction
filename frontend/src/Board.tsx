// import React from "react";
import { socket } from "./socket";
import Tile from "./Tile";

type BoardProps = {
  board: any[][];
  roomId: string;
  currentTurn: number;
};

function Board({ board, roomId, currentTurn }: BoardProps) {
  const handleClick = (x: number, y: number) => {
    socket.emit("placeOrb", { roomId, x, y });
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${board[0].length}, 60px)`,
        gap: "4px",
      }}
    >
      {board.map((row, i) =>
        row.map((tile, j) => (
          <Tile key={`${i}-${j}`} tile={tile} onClick={() => handleClick(i, j)} />
        ))
      )}

      {false && <div>Current Turn: Player {currentTurn + 1}</div>}
    </div>
  );
}

export default Board;

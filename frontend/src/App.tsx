// import React from "react";
import { useState, useEffect } from "react";
import { socket } from "./socket";
import Board from "./Board";

function App() {
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [gameState, setGameState] = useState<any>(null);
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const [currentBoard, setCurrentBoard] = useState<any>(null);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("roomCreated", ({ roomId }) => {
      setRoomId(roomId);
      const link = `${window.location.origin}/join/${roomId}`;
      setJoinLink(link);
      alert(`Room created! Share this link to invite others: ${link}`);
    });

    socket.on("roomJoined", ({ roomId, room }) => {
      setRoomId(roomId);
      setGameState(room);
      setCurrentBoard(room.board);
    });

    socket.on("updateState", ({ room }) => {
      setGameState(room);
      animateMoves(room.moves);
      if (room.winner !== null) {
        alert(`Game Over! Winner is Player ${room.winner + 1}: ${room.players[room.winner].name}`);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("updateState");
    };
  }, []);

  const animateMoves = (moves: any[]) => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < moves.length) {
        setCurrentBoard(moves[i]);
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);
  };

  const createRoom = () => {
    if (!playerName) return;
    socket.emit("createRoom", { playerName, customCode: roomId, maxPlayers: 2 });
  };

  const joinRoom = () => {
    if (!playerName || !roomId) return;
    socket.emit("joinRoom", { roomId, playerName });
  };

  return (
    <div style={{ padding: 20, textAlign: "center", width: "100%" }}>
      <h1>Chain Reaction</h1>

      {joinLink && (
        <p>
          Share this link to invite others: <a href={joinLink}>{joinLink}</a>
        </p>
      )}

      {!connected && <p>Connecting...</p>}

      {!gameState && (
        <div>
          <p>
            <input
              type="text"
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </p>

          <p>
            <input
              type="text"
              placeholder="Room ID"
              value={roomId || ""}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </p>

          <div>
            <button onClick={createRoom}>Create Room</button>
            <button onClick={joinRoom}>Join Room</button>
          </div>
        </div>
      )}

      {gameState && (
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: 20 }}>
          {/* Board */}
          <Board
            board={currentBoard}
            roomId={roomId!}
            currentTurn={gameState.currentTurn}
          />

          {/* Players list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
            <h3>Players</h3>
            {gameState.players.map((player: any, idx: number) => (
              <div
                key={idx}
                style={{
                  padding: "10px 15px",
                  borderRadius: "8px",
                  backgroundColor: "#000000ff",
                  border: gameState.currentTurn === idx ? "5px solid #ffffffff" : "1px solid #000000ff",
                  fontWeight: gameState.currentTurn === idx ? "bold" : "normal",
                  minWidth: "120px",
                  color: player.eliminated ? "#767676ff" : "#ffffffff",
                  textAlign: "center",
                  textDecoration: player.eliminated ? "line-through" : "none",
                }}
              >
                {player.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

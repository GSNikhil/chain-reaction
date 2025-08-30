// import React from "react";
import { useState, useEffect } from "react";
import { socket } from "./socket";
import Board from "./Board";
import "./App.css";


function App() {
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [gameState, setGameState] = useState<any>(null);
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const [currentBoard, setCurrentBoard] = useState<any>(null);
  const [numPlayers, setNumPlayers] = useState(2);

  useEffect(() => {
    // Extract roomId from URL if present
    const pathParts = window.location.pathname.split("/");
    if (pathParts[1] === "join" && pathParts[2]) {
      setRoomId(pathParts[2]);
    }

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

    socket.on("updateState", async ({ room }) => {
      setGameState(room);
      // console.log("Room moves:", room.moves);
      await animateMoves(room.moves);
      setCurrentBoard(room.board);
      // Check for winner
      if (room.winner !== null) {
        alert(`Game Over! Winner is Player ${room.winner + 1}: ${room.players[room.winner].name}`);
      }
    });

    socket.on("resetBoard", ({ room }) => {
      setGameState(room);
      setCurrentBoard(room.board);
    });

    socket.on("errorMessage", ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("updateState");
      socket.off("resetBoard");
    };
  }, []);

  // const animateMoves = (moves: any[]): Promise<void> => {
  //   return new Promise((resolve) => {
  //     let i = 0;
  //     const intervalId = setInterval(() => {
  //       if (i < moves.length) {
  //         setCurrentBoard(moves[i]);
  //         i++;
  //       } else {
  //         clearInterval(intervalId);
  //         resolve();
  //       }
  //     }, 10);
  //   });
  // };

  // const animateMoves = (moves: any[]): Promise<void> => {
  //   console.log("Animating moves:", moves);
  //   return new Promise((resolve) => {
  //     const intervalId = setInterval(() => {
  //       for (const move of moves) {
  //         console.log("Move", move);
  //         setCurrentBoard((prevBoard:any) => {
  //           console.log("Move at i:", move);
  //           prevBoard[move.x][move.y] = {
  //             count: move.count,
  //             owner: move.owner
  //           };
  //           return prevBoard;
  //         });
  //       }

  //       clearInterval(intervalId);
  //       resolve();
  //     }, 100);
  //   });
  // };

  const animateMoves = (moves: any[]): Promise<void> => {
    // console.log("Animating moves:", moves);
    return new Promise((resolve) => {
      let i = 0;

      const intervalId = setInterval(() => {
        if (i < moves.length) {
          const move = moves[i];
          // console.log("Animating move:", move);

          setCurrentBoard((prevBoard: any) => {
            // Create a deep copy (so React re-renders)
            const newBoard = prevBoard.map((row: any[]) => [...row]);
            // console.log("Animating move:", move);
            newBoard[move.x][move.y] = {
              count: move.count,
              owner: move.owner
            };

            return newBoard;
          });

          i++;
        } else {
          clearInterval(intervalId);
          resolve();
        }
      }, 30); // adjust speed (ms per move)
    });
  };



  const createRoom = () => {
    if (!playerName) return;
    socket.emit("createRoom", { playerName, customCode: roomId, maxPlayers: numPlayers });
  };

  const joinRoom = () => {
    if (!playerName || !roomId) return;
    socket.emit("joinRoom", { roomId, playerName });
  };

  const replayRoom = () => {
    if (!roomId) return;
    console.log("Replaying room:", roomId);
    socket.emit("replayRoom", { roomId });
  };

  return (
    <div style={{ padding: 20, textAlign: "center", width: "100%" }}>
      <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        {!gameState && <img src="./src/assets/logo.png" style={{ width: '100%', maxWidth: '100px' }}></img>}
        {gameState && <h4>
          <img src="./src/assets/home.png" style={{ width: '25px', verticalAlign: 'middle', color: 'white' }}></img>
          Home</h4>}
        <h1>Chain Reaction</h1>
      </a>

      {joinLink && (
        <p>
          Share this link to invite others:{" "}
          <a href={joinLink} target="_blank" rel="noopener noreferrer">
            {joinLink}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(joinLink)}>
            <img src="./src/assets/copy.png" style={{ width: '25px', verticalAlign: 'middle' }}></img>
          </button>
        </p>
      )}


      {!connected && <p>Connecting...</p>}

      {!gameState && (
        <div>

          <input
            type="text"
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Room ID"
            value={roomId || ""}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <select
            value={numPlayers}
            onChange={(e) => setNumPlayers(Number(e.target.value))}
          >
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
            <option value={5}>5 Players</option>
            <option value={6}>6 Players</option>
            <option value={7}>7 Players</option>
            <option value={8}>8 Players</option>
          </select>

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
                  border: gameState.currentTurn === idx ? `5px solid ${player.color}` : "1px solid #000000ff",
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

      {(gameState && gameState.winner !== null) && <button onClick={replayRoom}>Replay</button>}
    </div>
  );
}

export default App;

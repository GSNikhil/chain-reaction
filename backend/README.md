# Chain Reaction Backend

This is the backend server for the Chain Reaction multiplayer game, built with Node.js, Express, and Socket.IO.

## Features

- Real-time multiplayer game logic
- Room creation, joining, and management
- Turn-based gameplay and player elimination
- Automatic room cleanup after inactivity
- TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/GSNikhil/chain-reaction.git
   cd chain-reaction/backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Server (Development)

```sh
npm run dev
```
This uses `nodemon` and `ts-node` to run the TypeScript server with auto-reload.

### Building and Running (Production)

1. Build the TypeScript code:
   ```sh
   npx tsc
   ```
2. Start the server:
   ```sh
   node dist/index.js
   ```

### Configuration

- The server listens on port `3001` by default (or the port set in `process.env.PORT`).
- Room inactivity timeout is 5 minutes.

## Project Structure

```
backend/
  src/
    game.ts       # Game logic (orb placement, elimination, etc.)
    index.ts      # Express and Socket.IO server
    types.ts      # Type definitions
  package.json    # Project metadata and scripts
  tsconfig.json   # TypeScript configuration
```

## How It Works

- Clients connect via Socket.IO for real-time communication.
- Players can create or join rooms, and play turns.
- Game logic is handled in `src/game.ts`.
- Room and player state is managed in memory.

## Deployment

You can deploy the backend to platforms like Vercel, Heroku, or any Node.js hosting provider. I used Render.com
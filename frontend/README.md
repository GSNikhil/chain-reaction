# Chain Reaction Frontend

This is the frontend for the Chain Reaction multiplayer game, built with React and Vite.

## Features

- Real-time multiplayer gameplay using Socket.IO
- Interactive board and orb animations
- Responsive design for desktop and mobile
- Audio feedback for moves
- Custom room creation and joining
- Player color assignment and turn indication

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/GSNikhil/chain-reaction.git
   cd chain-reaction/frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App

Start the development server:
```sh
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

### Building for Production

```sh
npm run build
```
The production build will be in the `dist/` folder.

### Linting

```sh
npm run lint
```

## Project Structure

```
frontend/
  public/           # Static assets
  src/              # Source code
    App.tsx         # Main app component
    Board.tsx       # Game board UI
    Orb.tsx         # Orb rendering
    Tile.tsx        # Tile rendering
    socket.ts       # Socket.IO client logic
    assets/         # Images and icons
  index.html        # HTML entry point
  vite.config.ts    # Vite configuration
  package.json      # Project metadata and scripts
```

## Environment Variables

You can set custom backend URLs or other settings in `.env.local`.

## How It Works

- The frontend connects to the backend via Socket.IO (`src/socket.ts`).
- Players can create or join rooms, and play turns on the board.
- Game state updates are received in real-time and reflected in the UI.

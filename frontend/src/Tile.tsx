import React from "react";
import Orb from "./Orb.tsx";

type TileProps = {
  tile: { count: number; owner: number | null };
  onClick: () => void;
};

function Tile({ tile, onClick }: TileProps) {
  const [hovered, setHovered] = React.useState(false);
  const colors = ["red", "blue", "green", "yellow"];
  const color = tile.owner !== null ? colors[tile.owner] : "lightgray";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "60px",
        height: "60px",
        backgroundColor: "#000000ff",
        border: tile.owner !== null ? `1px solid ${color}` : "1px solid #aaa",
        // borderColor: tile.owner !== null ? `${color}` : "#aaa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontWeight: "bold",
        borderWidth: hovered ? '2px' : '1px',
        color,
      }}
    >
      {/* {tile.count > 0 ? tile.count : ""} */}
      {tile.count > 0 ? <Orb count={tile.count as 1|2|3} color={color} gradientId={String(tile.owner)}></Orb> : ""}
    </div>
  );
}

export default Tile;

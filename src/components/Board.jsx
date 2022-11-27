import React from "react";
import "./board.css";
import Square from "./Square";

export default function Board({ squares, handleClick }) {
  return (
    <div className="board">
      {squares.map((square, i) => (
        <Square key={i} value={square} onClick={(e) => handleClick(e, i)} />
      ))}
    </div>
  );
}

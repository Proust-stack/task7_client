import React from "react";
import { useSelector } from "react-redux";

import "./board.css";
import Square from "./Square";

export default function Board({ handleClick }) {
  const { gameBoard } = useSelector((state) => state.game);
  return (
    <div className="board">
      {gameBoard.map((square, i) => (
        <Square key={i} value={square} onClick={(e) => handleClick(e, i)} />
      ))}
    </div>
  );
}

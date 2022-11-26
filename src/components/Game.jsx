import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";

import Board from "./Board";
import "./game.css";
import { getWinner } from "./utils/winner";

export default function Game() {
  const initialArray = Array(9).fill(null);
  const [board, setBoard] = useState(initialArray);
  const [isXNext, setIsXNext] = useState(true);

  const [currentChat, setCurrentChat] = useState(uuidv4());
  const [currentUser, setCurrentUser] = useState(uuidv4());

  const winner = getWinner(board);

  const handleClick = (index) => {
    const boardCopy = [...board];
    if (winner || boardCopy[index]) return;
    boardCopy[index] = isXNext ? "X" : "0";
    setBoard(boardCopy);
    setIsXNext(!isXNext);
  };

  const startNewGame = () => {
    return (
      <button className="start_btn" onClick={() => setBoard(initialArray)}>
        Clear board
      </button>
    );
  };

  const socket = useRef();

  useEffect(() => {
    if (currentUser) {
      socket.current = io("http://localhost:5000");
      socket.current.emit("add-user", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage(msg);
        handleClick({
          vertical: "top",
          horizontal: "center",
        });
      });
    }
  }, []);

  return (
    <div className="wrapper">
      {startNewGame()}
      <Board squares={board} handleClick={handleClick} />
      <p className="info">
        {winner && winner !== "Draw" ? "Winner is " + winner : null}
        {winner === "Draw"
          ? "Draw"
          : winner
          ? null
          : "Next turn " + (isXNext ? "X" : "0")}
      </p>
    </div>
  );
}

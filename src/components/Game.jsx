import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { SocketContext } from "../socketContext";

import Board from "./Board";
import "./game.css";
import { getWinner } from "./utils/winner";

const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  cursor: default;
`;

export default function Game() {
  const socket = useContext(SocketContext);
  const [board, setBoard] = useState(Array(9).fill(null));

  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);

  const handleClick = (e, index) => {
    const boardCopy = [...board];
    boardCopy[index] = playerSymbol;
    setBoard(boardCopy);
    sendUpdate();
  };
  const sendUpdate = () => {
    if (socket) {
      socket.emit("update_game", board);
      const winner = getWinner(board);
      if (winner) {
        socket.emit("game_win", "You lost!");
        alert("You Won!");
      }
      setPlayerTurn(false);
    }
  };

  const handleGameUpdate = () => {
    if (socket) {
      socket.on("on_game_update", (board) => {
        console.log(board);
        setBoard(board);
        setPlayerTurn(true);
      });
    }
  };

  const handleGameStart = () => {
    if (socket) {
      socket.on("start_game", (options) => {
        console.log("game started");
        setGameStarted(true);
        setPlayerSymbol(options.symbol);
        if (options.start) {
          setPlayerTurn(true);
        } else {
          setPlayerTurn(false);
        }
      });
    }
  };

  const handleGameWin = () => {
    if (socket) {
      socket.on("on_game_win", (message) => {
        setPlayerTurn(false);
        alert(message);
      });
    }
  };

  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameWin();
  }, []);

  return (
    <div className="wrapper">
      {!isGameStarted && <h2>Waiting for another Player to join the game!</h2>}
      {(!isGameStarted || !isPlayerTurn) && <PlayStopper />}
      <Board squares={board} handleClick={handleClick} />
      <p className="info">turn</p>
    </div>
  );
}

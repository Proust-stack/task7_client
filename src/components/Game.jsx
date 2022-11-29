import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { SocketContext } from "../socketContext";

import Board from "./Board";
import "./game.css";
import { getWinner } from "./utils/winner";
import { saveBoard } from "../store/gameSlice";
import { Box, Button } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 98;
  cursor: default;
`;

export default function Game() {
  const socket = useContext(SocketContext);
  const { gameBoard, user } = useSelector((state) => state.game);
  const dispatch = useDispatch();

  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [annoucment, setAnnoucment] = useState(false);
  const [joined, setJoined] = useState(false);
  const [leaved, setLeaved] = useState(false);
  const [partner, setPartner] = useState(false);
  const [winner, setWinner] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const handleClick = (e, index) => {
    const boardCopy = [...gameBoard];
    if (!boardCopy[index]) {
      boardCopy[index] = playerSymbol;
      dispatch(saveBoard({ boardCopy }));
      sendUpdate(boardCopy);
    }
  };
  const sendUpdate = (boardCopy) => {
    if (socket) {
      socket.emit("update_game", { boardCopy });
      const winner = getWinner(boardCopy);
      setWinner(winner);
      if (winner === "draw") {
        socket.emit("game_ended", "Draw");
        setModalIsOpen(true);
      }
      if (winner) {
        socket.emit("game_ended", winner);
        setModalIsOpen(true);
      }
      setPlayerTurn(false);
    }
  };

  const handleGameUpdate = () => {
    if (socket) {
      socket.on("on_game_update", ({ boardCopy }) => {
        dispatch(saveBoard({ boardCopy }));
        setPlayerTurn(true);
      });
    }
  };

  const handleGameStart = () => {
    if (socket) {
      socket.on("start_game", (options) => {
        setAnnoucment(true);
        setGameStarted(true);
        setPlayerSymbol(options.symbol);
        setUsers(options.users);
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
      socket.on("game_ended", (winner) => {
        setPlayerTurn(false);
        setWinner(winner);
        setModalIsOpen(true);
      });
    }
  };
  const handleGameJoin = () => {
    if (socket) {
      socket.on("room_joined", (name) => {
        setPartner(name);
        setJoined(true);
        setLeaved(false);
      });
    }
  };
  const handleUserLeaved = () => {
    if (socket) {
      socket.on("user_leaved", (name) => {
        setLeaved(true);
      });
    }
  };

  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameWin();
    handleGameJoin();
    handleUserLeaved();
  }, []);

  const handleCloseAnn = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setJoined(false);
    setAnnoucment(false);
  };
  const handleCloseJoined = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setJoined(false);
  };
  const handleCloseLeaved = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const yesButton = () => {
    setModalIsOpen(false);
    const boardCopy = Array(9).fill(null);
    dispatch(saveBoard({ boardCopy }));
    sendUpdate(boardCopy);
    setAnnoucment(true);
  };
  const noButton = () => {
    setModalIsOpen(false);
    socket.emit("user_leaving", user);
    window.location.reload();
  };

  const onLeaved = () => {
    socket.emit("user_leaving", user);
    window.location.reload();
  };

  return (
    <div className="wrapper">
      {!isGameStarted && (
        <h2 style={{ color: "lightgrey" }}>
          Waiting for another Player to join the game!
        </h2>
      )}
      {(!isGameStarted || !isPlayerTurn) && <PlayStopper />}
      <Board handleClick={handleClick} />
      <p className="info">
        Players:{" "}
        <span style={{ fontSize: "20px", color: "lightgrey" }}>
          {users[0]} <span style={{ fontSize: "20px", color: "grey" }}>vs</span>{" "}
          {users[1]}
        </span>
      </p>
      <p className="info">
        You play for:{" "}
        <span style={{ fontSize: "20px", color: "grey" }}>
          {isGameStarted ? playerSymbol : null}
        </span>
      </p>
      <p className="info">
        Current move:{" "}
        <span style={{ fontSize: "20px", color: "grey" }}>
          {isGameStarted ? (isPlayerTurn ? "yours" : "your partner") : null}
        </span>
      </p>
      <Snackbar
        open={annoucment}
        autoHideDuration={2000}
        onClose={handleCloseAnn}
        severity="success"
      >
        <Alert severity="success">A new game has started</Alert>
      </Snackbar>
      <Snackbar
        open={joined}
        autoHideDuration={2000}
        onClose={handleCloseJoined}
        severity="success"
      >
        <Alert severity="success">{partner} joined the game!</Alert>
      </Snackbar>
      <Snackbar
        open={leaved}
        autoHideDuration={3000}
        onClose={handleCloseLeaved}
      >
        <Alert severity="warning">Your partner leaved the game!</Alert>
      </Snackbar>
      <Modal
        open={modalIsOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {winner === "draw" ? "draw" : `${winner} won`}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Start new game?
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={yesButton}
            sx={{ marginRight: 5 }}
            disabled={leaved}
          >
            <Typography>Yes</Typography>
          </Button>
          <Button variant="contained" color="success" onClick={noButton}>
            <Typography>No</Typography>
          </Button>
        </Box>
      </Modal>
      <Button
        variant="contained"
        color="success"
        onClick={onLeaved}
        sx={{ position: "absolut", zIndex: 99 }}
      >
        Quit the game
      </Button>
    </div>
  );
}

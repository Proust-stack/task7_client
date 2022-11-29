import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { SocketContext } from "../socketContext";
import { getRoom, registryUser } from "../store/gameSlice";
import { Box } from "@mui/material";

export default function WelcomePage({ setInRoom }) {
  const [currentRoom, setCurrentRoom] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [isJoining, setJoining] = useState(false);
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);
  useEffect(() => {
    if (socket) {
      socket.on("user-connected", (msg) => {
        console.log(msg);
      });
    }
  }, []);

  const handleRoomChange = (e) => {
    const value = e.target.value;
    setCurrentRoom(value);
  };
  const handleNameChange = (e) => {
    const value = e.target.value;
    setCurrentUser(value);
  };

  const joinRoom = async (e) => {
    if (!currentRoom || currentRoom.trim() === "" || !socket) return;

    setJoining(true);
    dispatch(registryUser({ currentUser }));
    dispatch(getRoom({ currentRoom }));
    socket.emit("join_game", currentRoom, currentUser);
    setInRoom(true);
    setJoining(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        bgcolor: "#cfe8fc",
      }}
    >
      <Stack
        sx={{ bgcolor: "#cfe8fc", height: "100%", display: "flex" }}
        justifyContent="center"
        alignItems="center"
        spacing={2}
        flexWrap="wrap"
      >
        <Typography
          variant="h2"
          sx={{ transform: "skew(5deg, 5deg)", color: "#0a18a6" }}
        >
          Tic-tac-toe
        </Typography>
        <TextField
          id="demo-helper-text-misaligned-no-helper"
          label="name"
          value={currentUser}
          onChange={handleNameChange}
        />
        <TextField
          id="demo-helper-text-misaligned-no-helper"
          label="room"
          value={currentRoom}
          onChange={handleRoomChange}
        />
        <Button
          variant="contained"
          color="success"
          disabled={isJoining}
          onClick={joinRoom}
          sx={{ transform: "skew(2deg, 3deg)" }}
        >
          {isJoining ? "Joining..." : "Start new game"}
        </Button>
      </Stack>
    </Box>
  );
}

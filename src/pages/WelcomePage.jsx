import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";
import { SocketContext } from "../socketContext";

const WelcomeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RoomInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #222;
  border-radius: 3px;
  padding: 0 10px;
`;

const JoinButton = styled.button`
  outline: none;
  background-color: green;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 1em;
  cursor: pointer;
  &:hover {
    background-color: transparent;
    border: 2px solid green;
    color: #222;
  }
`;

export default function WelcomePage({ setInRoom }) {
  const [currentRoom, setCurrentRoom] = useState("room1");
  const [currentUser, setCurrentUser] = useState("hunter");
  const [isJoining, setJoining] = useState(false);

  // const socket = useRef();

  // useEffect(() => {
  //   if (currentUser) {
  //     socket = io("http://localhost:5000", {
  //       transports: ["websocket"],
  //     });
  //   }
  // }, []);

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
    socket.emit("join_game", currentRoom, currentUser);
    socket.on("room_joined", (name) => {
      console.log(`${name} joined`);
    });
    setInRoom(true);
    setJoining(false);
  };

  return (
    <WelcomeContainer>
      <h4>Please enter your name and room</h4>
      <RoomInput
        placeholder="Room"
        value={currentRoom}
        onChange={handleRoomChange}
      />
      <RoomInput
        placeholder="Name"
        value={currentUser}
        onChange={handleNameChange}
      />
      <JoinButton disabled={isJoining} onClick={joinRoom}>
        {isJoining ? "Joining..." : "Joing"}
      </JoinButton>
    </WelcomeContainer>
  );
}

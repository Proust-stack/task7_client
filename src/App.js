import React, { useState } from "react";
import { SocketProvider } from "./socketContext";
import Game from "./components/Game";
import WelcomePage from "./pages/WelcomePage";

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState("x");
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);

  return (
    <SocketProvider>
      {!isInRoom && <WelcomePage setInRoom={setInRoom} />}
      {isInRoom && <Game />}
    </SocketProvider>
  );
}

export default App;

import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "game",
  initialState: {
    user: null,
    gameBoard: Array(9).fill(null),
    room: null,
  },
  reducers: {
    registryUser(state, action) {
      state.user = action.payload.currentUser;
    },
    saveBoard(state, action) {
      state.gameBoard = action.payload.boardCopy;
    },
    getRoom(state, action) {
      state.room = action.payload.currentRoom;
    },
  },
});

export const { registryUser, saveBoard, getRoom } = gameSlice.actions;

export default gameSlice.reducer;

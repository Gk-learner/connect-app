import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      // localStorage.setItem("user", JSON.stringify(action.payload)); // Save user to localStorage
console.log(state, action)
      return action.payload;
    },
    removeUser: () => {
      localStorage.removeItem("user"); // Clear user from localStorage

      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    received: [],
    sent: [],
  },
  reducers: {
    setReceivedRequests: (state, action) => {
      state.received = Array.isArray(action.payload) ? action.payload : [];
    },
    setSentRequests: (state, action) => {
      state.sent = Array.isArray(action.payload) ? action.payload : [];
    },
    removeReceivedRequest: (state, action) => {
      const id = action.payload;
      state.received = state.received.filter((r) => r._id !== id);
    },
    removeSentRequest: (state, action) => {
      const id = action.payload;
      state.sent = state.sent.filter((r) => r._id !== id);
    },
  },
});

export const {
  setReceivedRequests,
  setSentRequests,
  removeReceivedRequest,
  removeSentRequest,
} = requestSlice.actions;

export default requestSlice.reducer;

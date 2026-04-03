import { createSlice } from "@reduxjs/toolkit";

const inboxSlice = createSlice({
  name: "inbox",
  initialState: {
    totalUnread: 0,
    threads: [],
  },
  reducers: {
    setInboxSummary: (state, action) => {
      state.totalUnread = action.payload?.totalUnread ?? 0;
      state.threads = Array.isArray(action.payload?.threads)
        ? action.payload.threads
        : [];
    },
  },
});

export const { setInboxSummary } = inboxSlice.actions;
export default inboxSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/auth/userSlice";
import feedReducer from "../features/feed/feedSlice";
import connectionReducer from "../features/connection/connectionSlice"
/* eslint-disable no-underscore-dangle */

export const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer
  },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== "production", // Enables Redux DevTools in development
});

export default appStore;

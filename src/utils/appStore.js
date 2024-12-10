import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice"
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

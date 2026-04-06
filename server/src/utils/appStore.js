import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/auth/userSlice";
import feedReducer from "../features/feed/feedSlice";
import connectionReducer from "../features/connection/connectionSlice";
import requestsReducer from "../features/request/requestSlice";
import inboxReducer from "../features/inbox/inboxSlice";
/* eslint-disable no-underscore-dangle */

export const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer,
    requests: requestsReducer,
    inbox: inboxReducer,
  },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== "production", // Enables Redux DevTools in development
});

export default appStore;

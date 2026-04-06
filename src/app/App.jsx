import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../features/auth/userSlice.js";
import { BASE_URL } from "../utils/constants/index.js";

// 🔥 Lazy loaded components (Code Splitting)
const Body = lazy(() => import("../shared/components/MainLayout.jsx"));
const Login = lazy(() => import("../features/auth/Login.jsx"));
const Signup = lazy(() => import("../features/auth/Signup.jsx"));
const Profile = lazy(() => import("../shared/components/Profile.jsx"));
const Feed = lazy(() => import("../features/feed/Feed.jsx"));
const Connections = lazy(() => import("../features/connection/Connections.jsx"));
const Requests = lazy(() => import("../features/request/Requests.jsx"));
const Home = lazy(() => import("../features/home/Home.jsx"));
const Chat = lazy(() => import("../features/chat/Chat.jsx"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}profile`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.user) {
          dispatch(addUser(data.user));
        } else {
          dispatch(removeUser());
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        dispatch(removeUser());
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <div>
      {/* 🔥 Suspense wraps all lazy components */}
      <Suspense fallback={<div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/chat/:userId" element={<Chat />} />
              <Route path="/requests" element={<Requests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
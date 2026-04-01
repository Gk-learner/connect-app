import Body from "../shared/components/MainLayout.jsx";
import React,{useEffect} from "react"; 
import { addUser,removeUser } from "../features/auth/userSlice.js";
import Login from "../features/auth/Login.jsx";
import Profile from "../shared/components/Profile.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Feed from "../features/feed/Feed.jsx";
import Connections from "../features/connection/Connections.jsx";
import Requests from "../features/request/Requests.jsx";
import Home from "../features/home/Home.jsx";
import { BASE_URL } from "../utils/constants/index.js";
import { useDispatch } from "react-redux";
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
}, []);

    return (
        <>
        <div >
                <BrowserRouter basename="/">
                    <Routes>
                        <Route path="/" element={<Body />}>
                            <Route index element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/feed" element={<Feed />} />
                            <Route path="/connections" element={<Connections />} />
                            <Route path="/requests" element={<Requests />}/>


                        </Route>
                    </Routes>
                </BrowserRouter>
        </div>
        
            
        </>
    );
}

export default App;

import Body from "../shared/components/MainLayout.jsx";
import React from "react"; 
import Login from "../features/auth/Login.jsx";
import Profile from "../shared/components/Profile.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Provider} from "react-redux";
import appStore from "../utils/appStore.js";
import Feed from "../features/feed/Feed.jsx";
import Connections from "../features/connection/Connections.jsx";
import Requests from "../features/request/Requests.jsx";
function App() {
    return (
        <>
        <div  
    //     style={{
    //     backgroundImage: "url('/homepagePic.png')",
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //   }}
      >
            <Provider store={appStore}>
                <BrowserRouter basename="/">
                    <Routes>
                        <Route path="/" element={<Body />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/feed" element={<Feed />} />
                            <Route path="/connections" element={<Connections />} />
                            <Route path="/requests" element={<Requests />}/>


                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </div>
        
            
        </>
    );
}

export default App;

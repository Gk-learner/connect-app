import Body from "./components/Body.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Provider} from "react-redux";
import appStore from "./utils/appStore.js";
import Feed from "./components/Feed.jsx";
function App() {
    return (
        <>
            <Provider store={appStore}>
                <BrowserRouter basename="/">
                    <Routes>
                        <Route path="/" element={<Body />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/feed" element={<Feed />} />

                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </>
    );
}

export default App;

import "./App.css";
import NavBar from "./NavBar";
import {createRoot} from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";
const root = createRoot(document.getElementById("root"));

root.render(<BrowserRouter>{/* The rest of your app goes here */}</BrowserRouter>);
function App() {
    return (
        <>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<NavBar />} />
                    <Route path="login" element={<div>Login</div>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;

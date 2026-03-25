import React,{useEffect} from "react"; 
import {StrictMode} from "react";
import App from "./app/App.jsx";

import {createRoot} from "react-dom/client";
import "./index.css";
import appStore from "./utils/appStore.js";
import { Provider } from "react-redux";



createRoot(document.getElementById("root")).render(
    
    <StrictMode >
        <Provider store={appStore}>
            <App />
        </Provider>
    </StrictMode>
);

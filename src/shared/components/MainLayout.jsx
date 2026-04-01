import React from "react"; 
import {Outlet} from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Body = () => {
   
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 pb-24">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Body;

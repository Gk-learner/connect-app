import {useEffect} from "react";
import React from "react"; 
import {Outlet, useNavigate} from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import {BASE_URL} from "../../utils/constants";
import {useDispatch} from "react-redux";
import {addUser} from "../../features/auth/userSlice";
import {useSelector} from "react-redux";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store) => store.user);

    const fetchUser = async () => {
        if (userData) {
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}profile/view`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const res = await response.json();
            console.log(res);
            dispatch(addUser(res));
        } catch (err) {
            if (err.status === 401) {
                navigate("/login");
            }
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <div>
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Body;

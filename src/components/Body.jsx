import {useEffect, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import {BASE_URL} from "../utils/constants";
import {useDispatch} from "react-redux";
import {addUser} from "../utils/userSlice";
import {useSelector} from "react-redux";

const Body = () => {
    // const [logout, setLogout] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store) => store.user);
    const fetchUser = async () => {
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
        } catch (err) {
            if (err.status === 401) {
                navigate("/login");
            }
        }
    };
    useEffect(() => {
        if (!userData) {
            fetchUser();
        }
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

import React from "react"; 
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {BASE_URL} from "../../utils/constants/index";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {removeUser} from "../../features/auth/userSlice";

const NavBar = () => {
    const user = useSelector((store) => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await fetch(`${BASE_URL}logout`, {
                method: "POST",

                credentials: "include",
            });
            dispatch(removeUser(user));
            localStorage.removeItem("user"); // Clear user from localStorage
            navigate("/login");

            // console.log(user);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <Link to="/feed" className="btn btn-ghost text-xl">
                    🤝 Connect APP
                </Link>
            </div>
            <div className="flex-none gap-2">
                {user ? (
                    <>
                        <p>Welcome {user?.firstName}</p>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <>
                                    <div className="w-10 rounded-full">
                                        <img
                                            alt="User avatar"
                                            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1733085801~exp=1733089401~hmac=3565f50174ad8dac985db4b15df1d753e211a6fef5be94da951673978555de97&w=740"
                                        />
                                    </div>
                                </>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                {/* <li>
                                    <Link to="/profile" className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings">Settings</Link>
                                </li> */}
                                <li>{user ? <a onClick={handleLogout}>Logout</a> : <Link to="/login">Login</Link>}</li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="btn">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

// Define PropTypes for the component
NavBar.propTypes = {
    logout: PropTypes.func, // Set as PropTypes.func if optional, or PropTypes.func.isRequired if required
};

export default NavBar;

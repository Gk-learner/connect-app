import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {addUser} from "../utils/userSlice";
import {BASE_URL} from "../utils/constants/index";

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);

    console.log(user);
    const handleLogin = async () => {
        try {
            const obj = {
                emailId: userName,
                password: password,
            };

            console.log(obj);
            const response = await fetch(`${BASE_URL}login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(obj),
            });

            const res = await response.json();

            console.log(res);
            if (res._id) {
                dispatch(addUser(res));
                navigate("/feed");
            }
        } catch (err) {
            console.error("Error logging in:", err);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="w-80 mt-12 mx-auto">
            <h1 className="text-center mb-10 ">Login</h1>
            <label className="input input-bordered flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                    type="text"
                    className="grow"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </label>
            <label className="input input-bordered flex my-10 items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                >
                    <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd"
                    />
                </svg>
                <input
                    type="password"
                    className="grow"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button className="btn justify-center" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
};

// Define PropTypes for the component
// Login.propTypes = {
//     setLogout: PropTypes.func.isRequired,
// };

export default Login;

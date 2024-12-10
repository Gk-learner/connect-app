import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../utils/constants";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [connections, setConnections] = useState([]);

    const fetchConnections = async () => {
        try {
            const response = await fetch(`${BASE_URL}user/connections`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const res = await response.json();
            console.log(res);
            setConnections(res);
            dispatch(addConnections(res));
        } catch (err) {
            if (err.status === 401) {
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);
    return (
        <div className="flex flex-wrap justify-center gap-4">
            {connections.map((cardData, index) => (
                <div className="card bg-base-100 w-1/4 shadow-xl" key={index}>
                    <figure>
                        <img
                            className="w-4/5"
                            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1733085801~exp=1733089401~hmac=3565f50174ad8dac985db4b15df1d753e211a6fef5be94da951673978555de97&w=740"
                            alt={cardData.firstName || "Card Image"}
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{cardData.firstName}</h2>
                       
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Connections;

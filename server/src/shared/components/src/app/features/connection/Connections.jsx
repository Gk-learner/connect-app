import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {BASE_URL} from "../../utils/constants";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import { addConnections } from "./connectionSlice";

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
            const list = res.data ?? [];
            setConnections(list);
            dispatch(addConnections(list));
        } catch (err) {
            if (err.status === 401) {
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections.length) {
        return (
            <p className="text-center my-12 text-base-content/70">
                No connections yet. Accept requests from the{" "}
                <Link to="/requests" className="link link-primary">
                    Requests
                </Link>{" "}
                page, then you can message people here.
            </p>
        );
    }

    return (
        <div className="flex flex-wrap justify-center gap-4 px-2">
            {connections.map((cardData) => (
                <div
                  className="card bg-base-100 w-full sm:w-[280px] shadow-xl"
                  key={cardData._id}
                >
                    <figure className="px-4 pt-4">
                        <img
                            className="rounded-xl w-full h-40 object-cover"
                            src={
                              cardData.photoUrl ||
                              "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                            }
                            alt={cardData.firstName || "Card Image"}
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">
                          {cardData.firstName} {cardData.lastName ?? ""}
                        </h2>
                        <div className="card-actions justify-end mt-2">
                          <Link
                            to={`/chat/${cardData._id}`}
                            state={{ peer: cardData }}
                            className="btn btn-primary btn-sm"
                          >
                            Message
                          </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Connections;

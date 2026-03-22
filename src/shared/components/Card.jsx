import React from "react"; 
import {BASE_URL} from "../../utils/constants";
import {useDispatch} from "react-redux";
import {addUser} from "../../features/auth/userSlice";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Modal from "./Modal";
import { useState } from "react";
const Card = (feed) => {
        const navigate = useNavigate();
          const [open, setOpen] = useState(false);

    
    const dispatch = useDispatch();

    if (!feed?.feed?.length) {
        return <p>No data available</p>;
    }

    const sendInterest = async (cardData, status) => {
        const user = feed.feed.find((a) => a._id === cardData._id)?._id;
        if (!user) {
            console.error("User not found in feed");
            return;
        }

        try {
  const response = await fetch(
    `${BASE_URL}/request/send/${status}/${user}`,
    {
      method: "POST",
      credentials: "include",   
    }
  );
  if (!response.ok) {
setOpen(true) 
    throw new Error(`Error: ${response.status}`);
  }
  if (response.ok){
setOpen(true)  }

  const res = await response.json();
  console.log("API Response:", res);
  dispatch(addUser(res.data));
  
}  catch (err) {
            console.error("Failed to send interest:", err);
            if (err.message.includes("401")) {
                navigate("./login")
                // Handle unauthorized error (e.g., navigate to login page)
            }
        }
    };

    return (
        <div className="flex flex-wrap justify-between gap-4 m-4">
            {feed.feed.map((cardData) => (
                <div className="card bg-base-100 w-1/6 shadow-xl" key={cardData._id}>
                    <figure>
                        <img
                            className="w-3/5"
                            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                            alt={cardData.firstName || "User Image"}
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{cardData.firstName || "Unnamed User"}</h2>
                        <div className="card-actions justify-end">
                            <Button className="btn btn-warning" onClick={() => sendInterest(cardData, "ignored")}>Ignore</Button>
                          {open ? <Modal
        isOpen={open}
        type="ignore"
        title="Awesome!!"
        message="Request sent  successfully."
        onClose={() => setOpen(false)}
      /> : null}
                            <Button className="btn btn-success" onClick={() => sendInterest(cardData, "interested")}>
                                Interested
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Card;

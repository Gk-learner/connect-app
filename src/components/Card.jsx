import {BASE_URL} from "../utils/constants";
import {useDispatch} from "react-redux";
import {addUser} from "../utils/userSlice";

const Card = (feed) => {
    const dispatch = useDispatch();

    if (!feed?.feed?.length) {
        return <p>No data available</p>;
    }

    const sendInterest = async (cardData, status) => {
        console.log("Selected Card:", status);
        const user = feed.feed.find((a) => a._id === cardData._id)?._id;
        console.log(user);
        if (!user) {
            console.error("User not found in feed");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}request/send/${status}/${user}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: status,
                    userId: user,
                }),
                credentials: "include",
            });
console.log("API Response Status:", response.status);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const res = await response.json();
            console.log("API Response:", res);
            dispatch(addUser(res.data));
        } catch (err) {
            console.error("Failed to send interest:", err);
            if (err.message.includes("401")) {
                // Handle unauthorized error (e.g., navigate to login page)
            }
        }
    };

    return (
        <div className="flex flex-wrap justify-between gap-4 m-4">
            {feed.feed.map((cardData) => (
                <div className="card bg-base-100 w-1/4 shadow-xl" key={cardData._id}>
                    <figure>
                        <img
                            className="w-4/5"
                            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                            alt={cardData.firstName || "User Image"}
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{cardData.firstName || "Unnamed User"}</h2>
                        <div className="card-actions justify-end">
                            <button className="btn btn-warning" onClick={() => sendInterest(cardData, "ignored")}>
                                Ignore
                            </button>
                            <button className="btn btn-success" onClick={() => sendInterest(cardData, "interested")}>
                                Interested
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Card;

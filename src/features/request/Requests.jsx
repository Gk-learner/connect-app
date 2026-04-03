import { BASE_URL } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { removeReceivedRequest } from "./requestSlice";
import { refreshRequests } from "./refreshRequests";
import React from "react";
import { useEffect, useState } from "react";

const Requests = () => {
  const { received, sent } = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [tab, setTab] = useState("received");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await refreshRequests(dispatch);
      if (result?.unauthorized) {
        setError("Please log in to see connection requests.");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Could not load requests.");
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, requestId) => {
    try {
      const response = await fetch(
        `${BASE_URL}request/review/${status}/${requestId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || "Update failed");
      }

      dispatch(removeReceivedRequest(requestId));
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Failed to update request.");
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  if (loading) {
    return (
      <p className="flex justify-center my-10 text-base-content/70">
        Loading requests…
      </p>
    );
  }

  if (error) {
    return <p className="flex justify-center my-10 text-error">{error}</p>;
  }

  const list = tab === "received" ? received : sent;
  const emptyMessage =
    tab === "received"
      ? "No incoming requests right now."
      : "You have not sent any pending requests.";

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <h1 className="text-center text-3xl font-bold mb-2">Connection requests</h1>
      <p className="text-center text-base-content/70 mb-8">
        Accept or decline incoming interest · Track what you have sent
      </p>

      <div role="tablist" className="tabs tabs-boxed justify-center mb-8">
        <button
          type="button"
          role="tab"
          className={`tab ${tab === "received" ? "tab-active" : ""}`}
          onClick={() => setTab("received")}
        >
          Received ({received.length})
        </button>
        <button
          type="button"
          role="tab"
          className={`tab ${tab === "sent" ? "tab-active" : ""}`}
          onClick={() => setTab("sent")}
        >
          Sent ({sent.length})
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-center my-12 text-base-content/60">{emptyMessage}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {list.map((request) => {
            const other =
              tab === "received" ? request.fromUserId : request.toUserId;
            if (!other) return null;

            const { firstName, lastName, photoUrl, age, gender, about } = other;

            return (
              <li
                key={request._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-base-200 border border-base-300"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    alt=""
                    className="w-16 h-16 rounded-full object-cover shrink-0 bg-base-300"
                    src={
                      photoUrl ||
                      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                    }
                  />
                  <div className="text-left min-w-0">
                    <h2 className="font-bold text-lg truncate">
                      {firstName} {lastName}
                    </h2>
                    {age != null && gender && (
                      <p className="text-sm text-base-content/70">
                        {age}, {gender}
                      </p>
                    )}
                    {about && (
                      <p className="text-sm text-base-content/80 line-clamp-2 mt-1">
                        {about}
                      </p>
                    )}
                  </div>
                </div>

                {tab === "received" ? (
                  <div className="flex flex-wrap gap-2 shrink-0 justify-end">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => reviewRequest("rejected", request._id)}
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => reviewRequest("accepted", request._id)}
                    >
                      Accept
                    </button>
                  </div>
                ) : (
                  <span className="badge badge-ghost shrink-0">Pending</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Requests;

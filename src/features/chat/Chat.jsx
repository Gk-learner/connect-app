import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../../utils/constants";
import { refreshUnreadMessages } from "../inbox/refreshUnreadMessages";

const Chat = () => {
  const { userId: partnerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const me = useSelector((store) => store.user.user);

  const [peer, setPeer] = useState(location.state?.peer ?? null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadPeer = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}user/peer/${partnerId}`, {
        credentials: "include",
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message || "Could not load contact");
      }
      const data = await res.json();
      setPeer(data.data);
    } catch (e) {
      setError(e.message);
    }
  }, [partnerId, navigate]);

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}user/messages/${partnerId}`, {
        credentials: "include",
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (res.status === 403) {
        setError("You can only chat with people you are connected to.");
        setMessages([]);
        return;
      }
      if (!res.ok) throw new Error("Could not load messages");
      const data = await res.json();
      setMessages(Array.isArray(data.data) ? data.data : []);
      setError(null);
      void refreshUnreadMessages(dispatch);
    } catch (e) {
      setError(e.message);
    }
  }, [partnerId, navigate, dispatch]);

  useEffect(() => {
    if (!partnerId) return;
    setLoading(true);
    const run = async () => {
      if (!location.state?.peer) {
        await loadPeer();
      }
      await loadMessages();
      setLoading(false);
    };
    run();
  }, [partnerId, loadPeer, loadMessages, location.state?.peer]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!partnerId || error) return undefined;
    const t = setInterval(() => {
      loadMessages();
    }, 5000);
    return () => clearInterval(t);
  }, [partnerId, loadMessages, error]);

  const send = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const res = await fetch(`${BASE_URL}user/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: partnerId, text: trimmed }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message || "Send failed");
      }

      setText("");
      await loadMessages();
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  if (!me) {
    return (
      <p className="text-center my-10">
        <Link to="/login" className="link link-primary">
          Log in
        </Link>{" "}
        to chat.
      </p>
    );
  }

  if (loading && !peer && !error) {
    return <p className="text-center my-10 text-base-content/70">Loading chat…</p>;
  }

  if (error && !peer) {
    return (
      <div className="max-w-lg mx-auto my-10 px-4 text-center">
        <p className="text-error mb-4">{error}</p>
        <Link to="/connections" className="btn btn-primary btn-sm">
          Back to connections
        </Link>
      </div>
    );
  }

  const peerName =
    peer?.firstName != null
      ? `${peer.firstName} ${peer.lastName ?? ""}`.trim()
      : "Chat";

  return (
    <div className="max-w-2xl mx-auto flex flex-col px-3 pb-28 pt-4 min-h-[70vh]">
      <header className="flex items-center gap-3 mb-4 pb-3 border-b border-base-300">
        <Link to="/connections" className="btn btn-ghost btn-sm btn-circle" aria-label="Back">
          ←
        </Link>
        <img
          alt=""
          className="w-12 h-12 rounded-full object-cover bg-base-300"
          src={
            peer?.photoUrl ||
            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
          }
        />
        <div>
          <h1 className="text-lg font-semibold leading-tight">{peerName}</h1>
          {error && <p className="text-xs text-warning">{error}</p>}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[55vh]">
        {messages.length === 0 ? (
          <p className="text-center text-base-content/50 text-sm py-8">
            No messages yet. Say hello.
          </p>
        ) : (
          messages.map((m) => {
            const mine = String(m.fromUserId) === String(me._id);
            return (
              <div
                key={m._id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? "bg-primary text-primary-content rounded-br-md"
                      : "bg-base-300 text-base-content rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <p
                    className={`text-[10px] mt-1 opacity-70 ${
                      mine ? "text-primary-content" : ""
                    }`}
                  >
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={send}
        className="fixed bottom-24 left-0 right-0 px-3 max-w-2xl mx-auto w-full flex gap-2 bg-base-100/95 backdrop-blur pt-2 pb-3 border-t border-base-300"
      >
        <input
          type="text"
          className="input input-bordered flex-1 input-sm sm:input-md"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          disabled={sending || Boolean(error)}
        />
        <button
          type="submit"
          className="btn btn-primary btn-sm sm:btn-md shrink-0"
          disabled={sending || !text.trim() || Boolean(error)}
        >
          {sending ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Chat;

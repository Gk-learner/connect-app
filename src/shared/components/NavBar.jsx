import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants/index";
import { removeUser } from "../../features/auth/userSlice";
import { refreshRequests } from "../../features/request/refreshRequests";
import {
  setReceivedRequests,
  setSentRequests,
} from "../../features/request/requestSlice";
import { refreshUnreadMessages } from "../../features/inbox/refreshUnreadMessages";
import { setInboxSummary } from "../../features/inbox/inboxSlice";

function initialsFromUser(u) {
  if (!u) return "?";
  const first = (u.firstName || "").trim();
  const last = (u.lastName || "").trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first.length >= 2) return first.slice(0, 2).toUpperCase();
  if (first) return first[0].toUpperCase();
  const email = (u.emailId || "").trim();
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

const NavBar = () => {
  const { user, isLoading } = useSelector((store) => store.user);
  const { received, sent } = useSelector((store) => store.requests);
  const { totalUnread, threads } = useSelector((store) => store.inbox);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pendingRequestCount =
    (received?.length ?? 0) + (sent?.length ?? 0);
  const incomingCount = received?.length ?? 0;
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.emailId ||
    "Account";
  const avatarInitials = initialsFromUser(user);

  const unreadMessagesTitle =
    threads?.length > 0
      ? threads
          .map((t) => {
            const name = [t.peer?.firstName, t.peer?.lastName]
              .filter(Boolean)
              .join(" ")
              .trim();
            const label = name || "Someone";
            return `${label}: ${t.unreadCount} new`;
          })
          .join(" · ")
      : "";

  useEffect(() => {
    if (!user || isLoading) return undefined;

    let cancelled = false;
    const cancelledFn = () => cancelled;

    const refreshNotifications = async () => {
      await Promise.all([
        refreshRequests(dispatch, { isCancelled: cancelledFn }),
        refreshUnreadMessages(dispatch, { isCancelled: cancelledFn }),
      ]);
    };

    refreshNotifications();
    const interval = setInterval(refreshNotifications, 12000);

    const onFocus = () => {
      refreshNotifications();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshNotifications();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user?._id, isLoading, dispatch]);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}logout`, {
        method: "POST",
        credentials: "include",
      });
      dispatch(removeUser(user));
      dispatch(setReceivedRequests([]));
      dispatch(setSentRequests([]));
      dispatch(setInboxSummary({ totalUnread: 0, threads: [] }));
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return (
      <div className="navbar bg-base-300">
        <div className="flex-1">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar bg-base-300 px-2">
      <div className="flex-1 min-w-0">
        <Link to="/" className="btn btn-ghost text-xl max-sm:px-2">
          🤝 Connect APP
        </Link>
      </div>
      {user ? (
        <div className="flex-none flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          <div className="hidden sm:flex items-center gap-1">
            <Link to="/feed" className="btn btn-ghost btn-sm">
              Feed
            </Link>
            <Link
              to="/connections"
              className="btn btn-ghost btn-sm gap-1"
              title={
                totalUnread > 0
                  ? `Messages — ${unreadMessagesTitle}`
                  : "Connections & chats"
              }
            >
              Connections
              {totalUnread > 0 && (
                <span className="badge badge-sm badge-secondary">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </Link>
            <Link
              to="/requests"
              className="btn btn-ghost btn-sm gap-1"
              title={
                incomingCount > 0
                  ? `${incomingCount} to review · ${sent?.length ?? 0} sent (pending)`
                  : `${sent?.length ?? 0} sent (pending)`
              }
            >
              Requests
              {pendingRequestCount > 0 && (
                <span
                  className={`badge badge-sm ${incomingCount > 0 ? "badge-error" : "badge-neutral"}`}
                >
                  {pendingRequestCount}
                </span>
              )}
            </Link>
          </div>
          <div className="sm:hidden flex items-center">
            <Link
              to="/connections"
              className="btn btn-ghost btn-circle btn-sm relative"
              aria-label={
                totalUnread > 0
                  ? `Messages: ${totalUnread} unread. ${unreadMessagesTitle}`
                  : "Connections and messages"
              }
            >
              💬
              {totalUnread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-content">
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
            </Link>
            <Link
              to="/requests"
              className="btn btn-ghost btn-circle btn-sm relative"
              aria-label={`Requests${pendingRequestCount > 0 ? `, ${pendingRequestCount} pending` : ""}`}
            >
              🔔
              {pendingRequestCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-error-content">
                  {pendingRequestCount > 9 ? "9+" : pendingRequestCount}
                </span>
              )}
            </Link>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle h-11 w-11 min-h-11 min-w-11 border border-transparent p-0 hover:border-base-300"
              aria-label={`Profile menu, ${displayName}`}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-content ring-2 ring-base-300 text-[11px] font-bold tracking-tight select-none"
                aria-hidden
              >
                {avatarInitials}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-56 p-2 shadow"
            >
              <li className="menu-title flex flex-col items-stretch gap-0.5 py-2">
                <span className="font-semibold truncate">{displayName}</span>
                {user?.emailId && (
                  <span className="text-xs font-normal opacity-70 truncate">
                    {user.emailId}
                  </span>
                )}
              </li>
              <li className="sm:hidden">
                <Link to="/feed">Feed</Link>
              </li>
              <li className="sm:hidden">
                <Link to="/connections" className="justify-between">
                  Connections
                  {totalUnread > 0 && (
                    <span className="badge badge-sm badge-secondary">
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </span>
                  )}
                </Link>
              </li>
              <li className="sm:hidden">
                <Link to="/requests" className="justify-between">
                  Requests
                  {pendingRequestCount > 0 && (
                    <span className="badge badge-sm badge-error">
                      {pendingRequestCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="justify-between">
                  Edit Profile
                  <span className="badge">Edit</span>
                </Link>
              </li>
              <li>
                {user ? (
                  <a onClick={handleLogout}>Logout</a>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex-none flex gap-2">
          <Link to="/login" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm">
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
};

NavBar.propTypes = {
  logout: PropTypes.func,
};

export default NavBar;

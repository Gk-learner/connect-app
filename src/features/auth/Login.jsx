import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { addUser } from "./userSlice";
import { BASE_URL } from "../../utils/constants/index";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const signupNotice = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ emailId: email.trim(), password }),
      });

      const raw = await response.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { message: raw || "Login failed" };
      }

      if (response.ok) {
        dispatch(addUser(data));
        navigate("/requests");
        return;
      }

      const msg =
        typeof data === "string"
          ? data
          : data?.message || data?.error || "Invalid email or password.";
      setError(msg);
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(var(--p)/0.2),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          {/* <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            <span aria-hidden>🤝</span> Connect App
          </Link> */}
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-6 tracking-tight">
            Welcome back
          </h1>
          <p className="text-base-content/70 mt-2 text-sm sm:text-base">
            Sign in to see your feed, messages, and connections.
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300/80">
          <div className="card-body p-6 sm:p-8">
            {signupNotice && (
              <div role="status" className="alert alert-success text-sm mb-2">
                <span>{signupNotice}</span>
              </div>
            )}
            {error && (
              <div role="alert" className="alert alert-error text-sm mb-2">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="form-control w-full">
                <label className="label pt-0" htmlFor="login-email">
                  <span className="label-text font-medium">Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-2 h-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-55 shrink-0"
                    aria-hidden
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.5 8.868l6.473-3.946A.75.75 0 0 1 15 5.75V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 7.06 8.688 10.77a.749.749 0 0 1-.376.1h-.004a.75.75 0 0 1-.375-.1L1 7.06v6.19A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5V7.06Z" />
                  </svg>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    className="grow min-w-0"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-control w-full">
                <label className="label pt-0" htmlFor="login-password">
                  <span className="label-text font-medium">Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-2 h-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-55 shrink-0"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    className="grow min-w-0"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/65 mt-6">
              New here?{" "}
              <Link to="/signup" className="link link-primary font-medium">
                Create an account
              </Link>
              {" · "}
              <Link to="/" className="link link-hover">
                Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

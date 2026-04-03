import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "./userSlice";
import { BASE_URL } from "../../utils/constants/index";

async function parseResponse(response) {
  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { message: raw || "Something went wrong" };
  }
  return data;
}

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const signupRes = await fetch(`${BASE_URL}signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          emailId: email.trim(),
          password,
        }),
      });

      const signupData = await parseResponse(signupRes);

      if (!signupRes.ok) {
        setError(
          signupData.message ||
            (typeof signupData === "string" ? signupData : "Sign up failed.")
        );
        return;
      }

      const loginRes = await fetch(`${BASE_URL}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ emailId: email.trim(), password }),
      });

      const loginRaw = await loginRes.text();
      let userData;
      try {
        userData = loginRaw ? JSON.parse(loginRaw) : null;
      } catch {
        userData = null;
      }

      if (loginRes.ok && userData) {
        dispatch(addUser(userData));
        navigate("/feed");
        return;
      }

      navigate("/login", {
        replace: true,
        state: {
          message:
            signupData.message ||
            "Account created. Sign in with your new credentials.",
        },
      });
    } catch (err) {
      console.error("Signup error:", err);
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
        className="pointer-events-none absolute top-1/3 right-0 h-72 w-72 rounded-full bg-secondary/15 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            <span aria-hidden>🤝</span> Connect App
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-6 tracking-tight">
            Create your account
          </h1>
          <p className="text-base-content/70 mt-2 text-sm sm:text-base">
            Join in a few steps — then explore your feed and start connecting.
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300/80">
          <div className="card-body p-6 sm:p-8">
            {error && (
              <div role="alert" className="alert alert-error text-sm mb-2">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control w-full sm:col-span-1">
                  <label className="label pt-0" htmlFor="signup-first">
                    <span className="label-text font-medium">First name</span>
                  </label>
                  <input
                    id="signup-first"
                    type="text"
                    autoComplete="given-name"
                    className="input input-bordered w-full h-11"
                    placeholder="At least 4 characters"
                    minLength={4}
                    maxLength={50}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control w-full sm:col-span-1">
                  <label className="label pt-0" htmlFor="signup-last">
                    <span className="label-text font-medium">Last name</span>
                    <span className="label-text-alt text-base-content/50 font-normal">
                      optional
                    </span>
                  </label>
                  <input
                    id="signup-last"
                    type="text"
                    autoComplete="family-name"
                    className="input input-bordered w-full h-11"
                    placeholder="Doe"
                    maxLength={50}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label pt-0" htmlFor="signup-email">
                  <span className="label-text font-medium">Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-2 h-11">
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
                    id="signup-email"
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
                <label className="label pt-0" htmlFor="signup-password">
                  <span className="label-text font-medium">Password</span>
                </label>
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  className="input input-bordered w-full h-11"
                  placeholder="Strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-base-content/55 mt-1.5 leading-snug px-0.5">
                  Use 8+ characters with uppercase, lowercase, a number, and a
                  symbol.
                </p>
              </div>

              <div className="form-control w-full">
                <label className="label pt-0" htmlFor="signup-confirm">
                  <span className="label-text font-medium">Confirm password</span>
                </label>
                <input
                  id="signup-confirm"
                  type="password"
                  autoComplete="new-password"
                  className="input input-bordered w-full h-11"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/65 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

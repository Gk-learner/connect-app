import React from "react";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const Home = () => {
    const user = useSelector((store) => store.user.user);

    return (
        <div className="overflow-x-hidden">
            <section className="relative isolate min-h-[calc(100vh-12rem)] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(var(--p)/0.25),transparent)]"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-1/4 -z-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl sm:right-10"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-10 left-0 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
                />

                <div className="mx-auto max-w-5xl text-center">
                    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100/80 px-4 py-1 text-sm font-medium text-base-content/80 shadow-sm backdrop-blur">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                        </span>
                        Meet people who matter to you
                    </p>
                    <h1 className="bg-gradient-to-br from-base-content via-base-content to-base-content/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl md:leading-[1.1]">
                        Your network,
                        <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            one connection at a time
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-base-content/70 md:text-xl">
                        Connect App helps you discover profiles, send requests, and build meaningful
                        relationships — all in a calm, focused experience.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                        {user ? (
                            <>
                                <Link to="/feed" className="btn btn-primary btn-lg min-w-[200px] shadow-lg shadow-primary/25">
                                    Go to feed
                                </Link>
                                <Link to="/connections" className="btn btn-outline btn-lg min-w-[200px]">
                                    My connections
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-primary btn-lg min-w-[200px] shadow-lg shadow-primary/25">
                                    Get started
                                </Link>
                                <a href="#features" className="btn btn-ghost btn-lg min-w-[200px]">
                                    See how it works
                                </a>
                            </>
                        )}
                    </div>

                    <div className="mt-16 grid gap-4 sm:grid-cols-3 sm:text-left">
                        {[
                            {value: "Feed", label: "Curated cards tailored to you"},
                            {value: "Requests", label: "Thoughtful connection flow"},
                            {value: "Profile", label: "Your story, your way"},
                        ].map((item) => (
                            <div
                                key={item.value}
                                className="rounded-2xl border border-base-300/80 bg-base-100/60 p-5 shadow-sm backdrop-blur transition hover:border-primary/30 hover:shadow-md"
                            >
                                <p className="text-2xl font-bold text-primary">{item.value}</p>
                                <p className="mt-1 text-sm text-base-content/65">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="border-t border-base-300 bg-base-200/40 px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for real connections</h2>
                        <p className="mt-4 text-base-content/70">
                            Everything you need to browse, request, and stay in touch — without the noise.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                        <article className="card border border-base-300 bg-base-100 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                            <div className="card-body">
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-2xl">
                                    ✨
                                </div>
                                <h3 className="card-title text-lg">Discover</h3>
                                <p className="text-base-content/70">
                                    Swipe through a personalized feed and find people aligned with your interests.
                                </p>
                            </div>
                        </article>
                        <article className="card border border-base-300 bg-base-100 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                            <div className="card-body">
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-2xl">
                                    🤝
                                </div>
                                <h3 className="card-title text-lg">Connect</h3>
                                <p className="text-base-content/70">
                                    Send and manage connection requests in one clear, simple inbox.
                                </p>
                            </div>
                        </article>
                        <article className="card border border-base-300 bg-base-100 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                            <div className="card-body">
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-2xl">
                                    👤
                                </div>
                                <h3 className="card-title text-lg">Express yourself</h3>
                                <p className="text-base-content/70">
                                    Keep your profile up to date so new connections know the real you.
                                </p>
                            </div>
                        </article>
                    </div>

                    <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-base-300 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 sm:flex-row sm:p-10">
                        <div className="text-center sm:text-left">
                            <h3 className="text-2xl font-bold">Ready when you are</h3>
                            <p className="mt-2 max-w-xl text-base-content/75">
                                {user
                                    ? "Jump back into your feed or review pending requests."
                                    : "Create an account or sign in to start connecting today."}
                            </p>
                        </div>
                        {user ? (
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link to="/requests" className="btn btn-primary">
                                    Requests
                                </Link>
                                <Link to="/profile" className="btn btn-outline">
                                    Profile
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-wide shadow-lg">
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

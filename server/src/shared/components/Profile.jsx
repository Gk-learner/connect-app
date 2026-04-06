import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addUser } from "../../features/auth/userSlice";
import { BASE_URL } from "../../utils/constants/index";

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

const Profile = () => {
  const dispatch = useDispatch();
  const { user: current, isLoading } = useSelector((store) => store.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState(null);
  const [photoBroken, setPhotoBroken] = useState(false);

  useEffect(() => {
    if (!current) return;
    setFirstName(current.firstName ?? "");
    setLastName(current.lastName ?? "");
    setGender(current.gender ?? "");
    setAge(current.age != null ? String(current.age) : "");
    setAbout(current.about ?? "");
    setPhotoUrl(current.photoUrl ?? "");
    setSkills(
      Array.isArray(current.skills) ? current.skills.join(", ") : ""
    );
    setPhotoBroken(false);
  }, [current]);

  useEffect(() => {
    setPhotoBroken(false);
  }, [photoUrl]);

  const editUserData = async () => {
    setSaving(true);
    setBanner(null);
    try {
      const skillsArr = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = {
        firstName,
        lastName,
        gender: gender || undefined,
        age: age === "" ? undefined : Number(age),
        about,
        photoUrl,
        skills: skillsArr,
      };

      const response = await fetch(`${BASE_URL}updateUser`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(addUser(data));
        setBanner({ type: "success", text: "Profile saved. You look great." });
      } else {
        setBanner({
          type: "error",
          text: typeof data === "string" ? data : data?.message || "Could not save.",
        });
      }
    } catch (err) {
      setBanner({ type: "error", text: "Something went wrong. Try again." });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <p className="text-center text-base-content/70 py-16">Loading profile…</p>
    );
  }

  if (!current) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <p className="mb-4 text-base-content/80">Sign in to edit your profile.</p>
        <Link to="/login" className="btn btn-primary">
          Log in
        </Link>
      </div>
    );
  }

  const preview = {
    firstName,
    lastName,
    emailId: current.emailId,
    photoUrl,
  };
  const avatarInitials = initialsFromUser(preview);
  const displayName =
    [firstName, lastName].filter(Boolean).join(" ").trim() || "Your name";

  return (
    <div className="relative overflow-hidden pb-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-br from-primary/25 via-base-200 to-secondary/20"
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        <header className="mb-10">
          <p className="text-sm font-medium text-primary uppercase tracking-wide">
            Your space
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Profile
          </h1>
          <p className="text-base-content/70 mt-2 max-w-xl">
            Update how you show up across Connect App — feed, chats, and
            connections.
          </p>
        </header>

        {banner && (
          <div
            role="alert"
            className={`alert mb-8 ${banner.type === "success" ? "alert-success" : "alert-error"}`}
          >
            <span>{banner.text}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-5 space-y-6">
            <div className="card bg-base-100 shadow-xl border border-base-300/80 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/40 to-secondary/40" />
              <div className="card-body pt-0 px-6 pb-6 -mt-12">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-28 h-28 mx-auto">
                    {photoUrl && !photoBroken ? (
                      <img
                        src={photoUrl}
                        alt=""
                        className="w-28 h-28 rounded-2xl object-cover ring-4 ring-base-100 shadow-lg bg-base-300"
                        onError={() => setPhotoBroken(true)}
                      />
                    ) : (
                      <div className="flex w-28 h-28 items-center justify-center rounded-2xl bg-primary text-primary-content text-2xl font-bold ring-4 ring-base-100 shadow-lg">
                        {avatarInitials}
                      </div>
                    )}
                  </div>
                  <h2 className="card-title text-xl mt-4 justify-center">
                    {displayName}
                  </h2>
                  <p className="text-sm text-base-content/60 break-all">
                    {current.emailId}
                  </p>
                  {current.createdAt && (
                    <p className="text-xs text-base-content/50 mt-2">
                      Member since{" "}
                      {new Date(current.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div className="divider my-2" />
                <p className="text-xs text-base-content/55 text-center leading-relaxed">
                  Photo must be a valid URL. Preview updates as you type.
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-7 space-y-6">
            <div className="card bg-base-100 shadow-lg border border-base-300/80">
              <div className="card-body">
                <h3 className="card-title text-lg font-bold border-b border-base-300 pb-3 mb-4">
                  Basics
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs font-semibold opacity-80">
                      First name
                    </legend>
                    <label className="input input-bordered flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-60 shrink-0"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                      </svg>
                      <input
                        type="text"
                        className="grow min-w-0"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </label>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs font-semibold opacity-80">
                      Last name
                    </legend>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset sm:col-span-2">
                    <legend className="fieldset-legend text-xs font-semibold opacity-80">
                      Gender
                    </legend>
                    <select
                      className="select select-bordered w-full"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs font-semibold opacity-80">
                      Age
                    </legend>
                    <input
                      type="number"
                      min={18}
                      max={120}
                      className="input input-bordered w-full"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="18+"
                    />
                  </fieldset>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300/80">
              <div className="card-body">
                <h3 className="card-title text-lg font-bold border-b border-base-300 pb-3 mb-4">
                  Photo & bio
                </h3>
                <fieldset className="fieldset mb-4">
                  <legend className="fieldset-legend text-xs font-semibold opacity-80">
                    Photo URL
                  </legend>
                  <input
                    type="url"
                    className="input input-bordered w-full font-mono text-sm"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://…"
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs font-semibold opacity-80">
                    About you
                  </legend>
                  <textarea
                    className="textarea textarea-bordered w-full min-h-[120px] leading-relaxed"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="A short intro — hobbies, what you’re looking for, or a fun fact."
                    maxLength={500}
                  />
                  <p className="label text-xs text-base-content/50">
                    {about.length}/500
                  </p>
                </fieldset>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300/80">
              <div className="card-body">
                <h3 className="card-title text-lg font-bold border-b border-base-300 pb-3 mb-4">
                  Skills
                </h3>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs font-semibold opacity-80">
                    Comma-separated
                  </legend>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, UX design, Hiking"
                  />
                </fieldset>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Link to="/" className="btn btn-ghost sm:order-first">
                Cancel
              </Link>
              <button
                type="button"
                className="btn btn-primary gap-2 min-w-[10rem]"
                disabled={saving}
                onClick={editUserData}
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Saving…
                  </>
                ) : (
                  "Save profile"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

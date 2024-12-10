import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addUser} from "../utils/userSlice";
import {BASE_URL} from "../utils/constants/index";

const Profile = () => {
    const user = useSelector((store) => store.user);
    const [firstName, setFirstName] = useState(user?.firstName);
    const [lastName, setLastName] = useState(user?.lastName);
    const [gender, setGender] = useState(user?.gender);
    const [age, setAge] = useState(user?.age);
    const [skills, setSkills] = useState(user?.skills);
    const [photoUrl, setPhotoUrl] = useState(
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
    );

    const dispatch = useDispatch();

    const editUserData = async () => {
        try {
            const payload = {
                firstName,
                lastName,
                gender,
                age,
                skills,
                photoUrl,
            };

            console.log("Payload:", payload);

            const response = await fetch(`${BASE_URL}profile/edit`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const res = await response.json();
            console.log("API Response:", res);

            if (res.data) {
                dispatch(addUser(res.data));
                // alert("Profile updated successfully!");
            } else {
                console.error("Error:", res.message);
                alert("Failed to update profile.");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        user && (
            <div className="w-80 mt-4 mx-auto overflow-scroll pb-20">
                <h1 className="text-center mb-10 ">Edit Profile</h1>
                <label>First Name</label>
                <label className="input input-bordered flex items-center gap-2 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>

                    <input
                        type="text"
                        className="grow"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </label>
                <label>Last Name</label>
                <label className="input input-bordered flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </label>
                <label>Gender</label>
                <label className="input input-bordered flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    />
                </label>
                <label>Age</label>
                <label className="input input-bordered flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                </label>
                <label>Photo URL</label>
                <label className="input input-bordered flex  items-center gap-2 mb-4">
                    <input
                        type=""
                        className="grow"
                        placeholder="PhotoUrl"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                    />
                </label>
                <label>Skills</label>
                <label className="input input-bordered flex items-center gap-2 mb-4">
                    <input
                        type=""
                        className="grow"
                        placeholder="Skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                    />
                </label>
                <button className="btn justify-center" onClick={editUserData}>
                    Edit
                </button>
            </div>
        )
    );
};

export default Profile;

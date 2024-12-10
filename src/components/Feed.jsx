import {useEffect} from "react";
import {BASE_URL} from "../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {addFeed} from "../utils/feedSlice";
import Card from "./Card";

const Feed = () => {
    const dispatch = useDispatch();
    const feed = useSelector((store) => store.feed);
    // const user = useSelector((store) => store.user);
    // console.log(user);
    const fetchUser = async () => {
        try {
            const response = await fetch(`${BASE_URL}user/feed`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const res = await response.json();
            // console.log(res);
            dispatch(addFeed(res));
        } catch (err) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        // if (!userData) {
        fetchUser();
        // }
    }, []);
    return <div className=" text-center flex justify-center">{feed && <Card feed={feed} />}</div>;
};

export default Feed;

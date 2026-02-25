import React, {useEffect} from "react";
import {BASE_URL} from "../../utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {addFeed} from "./feedSlice";
import Card from "../../shared/components/Card";

const Feed = () => {
    const dispatch = useDispatch();
    const feed = useSelector((store) => store.feed);
    const user = useSelector((store) => store.user);
    const fetchUser = async () => {
        try {
            const response = await fetch(`${BASE_URL}feed`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const res = await response.json();
            console.log(res);
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

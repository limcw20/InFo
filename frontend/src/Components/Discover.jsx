import React, { useContext, useEffect, useRef, useState } from "react";
import useFetch from "../Hooks/useFetch";
import { useParams } from "react-router-dom";
import DiscoverPassButton from "./DiscoverPassButton";
import UserContext from "../Context/user";
import DiscoverJoinButton from "./DiscoverJoinButton";

const Discover = () => {
  const fetchData = useFetch();
  const [posts, setPosts] = useState([]); // Define state for posts
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");
  let { user_id } = useParams();
  if (!user_id) {
    user_id = userCtx.userId;
  }

  const getRandomPost = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/chat/randompost/${user_id}`,
        "GET",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        setPosts(res.data); // Set the fetched posts to the state
      } else {
        setError("Error fetching posts");
      }
    } catch (error) {
      setError("Error fetching posts");
      console.error(error);
    }
  };
  useEffect(() => {
    getRandomPost();
  }, [user_id, userCtx.accessToken]);

  const handleGetPost = () => {
    getRandomPost();
  };

  console.log(posts.post_id);
  const joinPost = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/chat/${user_id}/${posts.post_id}`,
        "PUT",
        undefined,
        userCtx.accessToken
      );

      console.log(res);
      if (res.ok) {
        res.json({ msg: "hi" });
      } else {
        setError("Error fetching posts");
      }
    } catch (error) {
      setError("Error fetching posts");
      console.error(error);
    }
  };

  const handleJoinPost = () => {
    joinPost();
  };
  return (
    <>
      <h1>Random Post:</h1>
      <h3>{posts.post_title}</h3>
      <p>{posts.post_desc}</p>
      <DiscoverPassButton handleClick={handleGetPost} />
      <DiscoverJoinButton handleClick={handleJoinPost} />
    </>
  );
};

export default Discover;

import React, { useContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";

import UserContext from "../Context/user";
import { Link } from "react-router-dom";

const Chat = (props) => {
  const fetchData = useFetch();
  const [posts, setPosts] = useState([]); // Define state for posts
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");
  const { user_id } = props;

  const getPostsByUserId = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/chat/${props.user_id}`,
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        setPosts(res.data);
      } else {
        setError("Error fetching posts");
      }
    } catch (error) {
      setError("Error fetching posts");
      console.error(error);
    }
  };

  useEffect(() => {
    getPostsByUserId();
  }, [user_id, userCtx.accessToken]); // Make sure to include user_id and accessToken in the dependency array

  return (
    <>
      <h1>Posts you participate in:</h1>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.post_id}>
              <h3>{post.post_title}</h3>
              <p>{post.post_desc}</p>
              <Link to={`/responses/${post.post_id}`}>Chat with Post</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>{error ? error : "No posts found"}</div>
      )}
    </>
  );
};

export default Chat;

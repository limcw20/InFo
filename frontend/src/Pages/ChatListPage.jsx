import React, { useContext, useEffect, useState } from "react";
import UserContext from "../Context/user";
import useFetch from "../Hooks/useFetch";
import { useParams } from "react-router-dom";

const ChatListPage = () => {
  const fetchData = useFetch();
  const [posts, setPosts] = useState([]); // Define state for posts
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");
  let { user_id } = useParams();
  if (!user_id) {
    user_id = userCtx.userId;
  }

  const getPostsByUserId = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/chat/${user_id}`,
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        const data = await res.json();
        setPosts(data); // Set the fetched posts to the state
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
    <div>
      <h1>Posts created by user {user_id}</h1>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.post_id}>
              <h3>{post.post_title}</h3>
              <p>{post.post_desc}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>{error ? error : "No posts found"}</div>
      )}
    </div>
  );
};

export default ChatListPage;

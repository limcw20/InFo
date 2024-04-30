import React, { useContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import { useParams } from "react-router-dom";

const Chatroom = () => {
  const fetchData = useFetch();
  const [posts, setPosts] = useState([]); // Define state for posts
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");
  const { post_id } = useParams();

  const getAllInfoFromPost = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/responses/${post_id}`,
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
    getAllInfoFromPost();
  }, [post_id, userCtx.accessToken]); // Make sure to include post_id and accessToken in the dependency array

  return (
    <>
      {posts && posts.post && (
        <>
          <h1>{posts.post.post_title}:</h1>
          <h3>{posts.post.post_desc}</h3>
          <p>{posts.post.post_date}</p>
          {Array.isArray(posts.responses) && posts.responses.length > 0 ? (
            <ul>
              {posts.responses.map((response) => (
                <li key={response.response_id}>
                  <h3>{response.response_desc}</h3>
                  <p>{response.response_date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div>No response yet found</div>
          )}
        </>
      )}
      {error && <div>{error}</div>}
    </>
  );
};

export default Chatroom;

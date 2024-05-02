import React, { useContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import { useParams } from "react-router-dom";
import ChatroomResponse from "./ChatroomResponse";
import ChatRoomUserList from "./ChatRoomUserList";

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
  }, [post_id, userCtx.accessToken]);

  const refreshPost = async () => {
    // Perform data fetching again after response submission
    await getAllInfoFromPost();
  };

  const handleDelete = async (responseId) => {
    try {
      setError("");
      const res = await fetchData(
        `/responses/${userCtx.userId}/${responseId}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        console.log("Response deleted successfully");
        refreshPost(); // Refresh posts after deletion
      } else {
        setError("Error deleting response");
      }
    } catch (error) {
      setError("Error deleting response");
      console.error(error);
    }
  };

  return (
    <>
      User List:
      <ChatRoomUserList post_id={post_id} />
      {posts && posts.post && (
        <>
          <h1>{posts.post.post_title}:</h1>
          <h3>{posts.post.post_desc}</h3>
          <img src={posts.post.post_img} />
          <p>{posts.post.post_date}</p>
          <p>{posts.post.category}</p>
          <p>{posts.post.sub_category}</p>
          {Array.isArray(posts.responses) && posts.responses.length > 0 ? (
            <ul>
              {posts.responses.map((response) => (
                <li key={response.response_id}>
                  <img src={response.response_img} />
                  <h3>{response.response_desc}</h3>
                  <button onClick={() => handleDelete(response.response_id)}>
                    Delete
                  </button>
                  <p>{response.response_date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div>No response yet found</div>
          )}

          <ChatroomResponse refreshPost={refreshPost}></ChatroomResponse>
        </>
      )}
      {error && <div>{error}</div>}
    </>
  );
};

export default Chatroom;

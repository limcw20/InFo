import React, { useContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import { useParams } from "react-router-dom";
import ChatroomResponse from "./ChatroomResponse";
import ChatRoomUserList from "./ChatRoomUserList";
import styles from "./Chatroom.module.css";

const Chatroom = () => {
  const fetchData = useFetch();
  const [posts, setPosts] = useState([]);
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
        refreshPost();
      } else {
        setError("Error deleting response");
      }
    } catch (error) {
      setError("Error deleting response");
      console.error(error);
    }
  };

  return (
    <div className={styles.background}>
      {posts && posts.post && (
        <div className={styles.container}>
          {posts.post.post_img && (
            <img className={styles.img} src={posts.post.post_img} alt="Post" />
          )}
          <h1 className={styles.header}>{posts.post.post_title}:</h1>
          <h3 className={styles.p}>{posts.post.post_desc}</h3>
          <p className={styles.p}>{posts.post.post_date}</p>
          <p className={styles.p}>Category: {posts.post.category}</p>
          <p className={styles.p}>Sub-category: {posts.post.sub_category}</p>
          {Array.isArray(posts.responses) && posts.responses.length > 0 ? (
            <ul>
              {posts.responses.map((response) => (
                <li key={response.response_id}>
                  {response.response_img && (
                    <img
                      className={styles.img}
                      src={response.response_img}
                      alt="Response"
                    />
                  )}
                  <h3 className={styles.p}>{response.response_desc}</h3>
                  <button
                    className={styles.button}
                    onClick={() => handleDelete(response.response_id)}
                  >
                    Delete
                  </button>
                  <p>{response.response_date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div>No response yet found</div>
          )}
          <ChatroomResponse refreshPost={refreshPost} />
        </div>
      )}
      {error && <div>{error}</div>}
      <ChatRoomUserList post_id={post_id} />
    </div>
  );
};

export default Chatroom;

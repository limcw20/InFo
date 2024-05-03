import React, { useContext, useEffect, useState } from "react";
import UserContext from "../Context/user";
import useFetch from "../Hooks/useFetch";

const AdminPostControl = () => {
  const fetchData = useFetch();
  const [posts, setPosts] = useState([]);
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");

  const getAllUserPosts = async () => {
    try {
      setError("");
      const res = await fetchData(
        "/auth/posts",
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
    getAllUserPosts();
  }, [userCtx.accessToken]);

  const refreshPost = async () => {
    await getAllUserPosts();
  };

  const handleDelete = async (postId) => {
    try {
      setError("");
      const res = await fetchData(
        `/auth/posts/${postId}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log("Post deleted successfully");
        refreshPost();
      } else {
        setError("Error deleting post");
        console.error(error);
      }
    } catch (error) {
      setError("Error deleting post");
      console.error(error);
    }
  };

  return (
    <>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.post_id}>
              <p>Post title: {post.post_title}</p>
              <p>Post Description: {post.post_desc}</p>
              <p>Post Image URL: {post.post_img}</p>
              <p>Post Date: {post.post_date}</p>
              <p>Post Username: {post.username}</p>
              <p>Post Nickname: {post.nickname}</p>
              <button onClick={() => handleDelete(post.post_id)}>Delete</button>
              {/* Pass post_id to handleDelete */}
            </li>
          ))}
        </ul>
      ) : (
        <div>{error ? error : "No posts found"}</div>
      )}
    </>
  );
};

export default AdminPostControl;

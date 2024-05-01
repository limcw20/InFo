import React, { useContext, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import { useNavigate, useParams } from "react-router-dom";

const ChatroomDeletePostButton = ({ is_superuser }) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { post_id } = useParams();

  const handleDeletePost = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/chat/${userCtx.userId}/${post_id}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        console.log("Post deleted successfully");
        navigate("/chat");
      } else {
        setError("Failed to delete post");
      }
    } catch (error) {
      setError("Failed to delete post.");
      console.error(error);
    }
  };

  return (
    <div>
      {is_superuser && <button onClick={handleDeletePost}>Delete Post</button>}
      {error && <div>{error}</div>}
    </div>
  );
};

export default ChatroomDeletePostButton;

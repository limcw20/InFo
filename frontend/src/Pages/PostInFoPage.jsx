import React, { useContext, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import { useNavigate } from "react-router-dom";

const PostInFoPage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [postImg, setPostImg] = useState("");

  const CreateUserPost = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/chat/${userCtx.userId}/post`,
        "PUT",
        { post_title: postTitle, post_desc: postDesc, post_img: postImg },
        userCtx.accessToken
      );

      console.log(res);
      if (res.ok) {
        console.log("Post created successfully");
        navigate("/chat");
      } else {
        setError("Error creating post");
      }
    } catch (error) {
      setError("Error creating post");
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    CreateUserPost();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Type your title here"
        />
        <input
          type="text"
          value={postDesc}
          onChange={(e) => setPostDesc(e.target.value)}
          placeholder="Type your description here"
        />
        <input
          type="file"
          value={postImg}
          onChange={(e) => setPostImg(e.target.value)}
          placeholder="Upload image here"
        />
        <button type="submit">Submit</button>
        {error && <div>{error}</div>}
      </form>
    </>
  );
};

export default PostInFoPage;

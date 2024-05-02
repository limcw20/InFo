import React, { useContext, useEffect, useRef, useState } from "react";
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
  const [category, setCategory] = useState("");
  const [sub_category, setSub_category] = useState("");
  const imageUploadRef = useRef(null);
  const [postImg, setPostImg] = useState("");

  const CreateUserPost = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/chat/${userCtx.userId}/post`,
        "PUT",
        {
          post_title: postTitle,
          post_desc: postDesc,
          post_img: postImg,
          category: category,
          sub_category: sub_category,
        },
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

  useEffect(() => {
    if (!imageUploadRef.current) {
      const cloudinaryWidgetImage = window.cloudinary.createUploadWidget(
        {
          cloudName: "dedccruzp",
          uploadPreset: "cjdht8ty",
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Image URL:", result.info.secure_url); // Debugging line
            setPostImg(result.info.secure_url);
          }
        }
      );
      const uploadButton = document.getElementById("upload_image_widget");
      uploadButton.addEventListener(
        "click",
        (event) => {
          event.stopPropagation();
          cloudinaryWidgetImage.open();
        },
        false
      );
      imageUploadRef.current = uploadButton;
    }
  }, []);

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
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Type your category here"
        />
        <input
          type="text"
          value={sub_category}
          onChange={(e) => setSub_category(e.target.value)}
          placeholder="Type your sub_category here"
        />

        {error && <div>{error}</div>}
        {/* Display the image URL in a paragraph element */}
        <p>Image URL: {postImg}</p>
        <input type="hidden" value={postImg} />
        <button
          type="button"
          id="upload_image_widget"
          className="cloudinary-button"
        >
          Upload Picture
        </button>

        <button type="submit">Submit</button>
        {error && <div>{error}</div>}
      </form>
    </>
  );
};

export default PostInFoPage;

import React, { useContext, useEffect, useRef, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import { useNavigate } from "react-router-dom";
import styles from "./PostInFoPage.module.css";

const PostInFoPage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const imageUploadRef = useRef(null);
  const [postImg, setPostImg] = useState("");

  const createPost = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/chat/${userCtx.userId}/post`,
        "PUT",
        {
          post_title: postTitle,
          post_desc: postDesc,
          post_img: postImg,
          category,
          sub_category: subCategory,
        },
        userCtx.accessToken
      );

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
    createPost();
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
            console.log("Image URL:", result.info.secure_url);
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
    <div className={styles.background}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.h1}> What do you want to discuss about?</p>
        <br />
        <br />
        <br />
        <p className={styles.p}>Post Title</p>
        <input
          className={styles.input}
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="Type your title here"
        />
        <p className={styles.p}>Post Description</p>
        <input
          className={styles.input}
          type="text"
          value={postDesc}
          onChange={(e) => setPostDesc(e.target.value)}
          placeholder="Type your description here"
        />
        <p className={styles.p}>Category</p>
        <input
          className={styles.input}
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Type your category here"
        />
        <p className={styles.p}>Sub-Category</p>
        <input
          className={styles.input}
          type="text"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          placeholder="Type your sub-category here"
        />

        <p className={styles.p}>Image URL</p>
        <input type="text" value={postImg} className={styles.input} readOnly />
        <button
          type="button"
          id="upload_image_widget"
          className={`${styles.cloudinary_button} cloudinary-button`}
        >
          Upload Image Here
        </button>
        <br />
        <button className={styles.submit_button} type="submit">
          Post Info
        </button>
        <br />
        <br />
        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
};

export default PostInFoPage;

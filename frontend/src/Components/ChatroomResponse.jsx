import React, { useContext, useEffect, useRef, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import { useParams } from "react-router-dom";
import styles from "./Chatroom.module.css";

const ChatroomResponse = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [responseDesc, setResponseDesc] = useState("");
  const [error, setError] = useState("");
  const { post_id } = useParams();
  const imageUploadRef = useRef(null);
  const [responseImg, setResponseImg] = useState("");

  const AddResponse = async () => {
    try {
      setError("");

      const res = await fetchData(
        `/responses/${userCtx.userId}/${post_id}`,
        "PUT",
        { response_desc: responseDesc, response_img: responseImg },
        userCtx.accessToken
      );

      if (res.ok) {
        console.log("Response added successfully");
        props.refreshPost();
        setResponseDesc("");
        setResponseImg("");
      } else {
        setError("Error adding response");
      }
    } catch (error) {
      setError("Error adding response");
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    AddResponse();
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
            setResponseImg(result.info.secure_url);
          }
        }
      );
      const uploadButton = document.getElementById("upload_image_widget");
      uploadButton.addEventListener(
        "click",
        () => {
          cloudinaryWidgetImage.open();
        },
        false
      );
      imageUploadRef.current = uploadButton;
    }
  }, []);

  return (
    <div className={styles.responsesContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            type="text"
            value={responseDesc}
            onChange={(e) => setResponseDesc(e.target.value)}
            placeholder="Type your response here"
          />
          <button className={styles.button} type="submit">
            Submit
          </button>
        </div>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            type="text"
            value={responseImg}
            onChange={(e) => setResponseImg(e.target.value)}
            placeholder="Image URL"
          />
          <button
            type="button"
            id="upload_image_widget"
            className={`${styles.cloudinary_button} cloudinary-button`}
          >
            Upload Picture
          </button>
        </div>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default ChatroomResponse;

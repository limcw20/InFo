import React, { useContext, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import { useParams } from "react-router-dom";

const ChatroomResponse = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [responseDesc, setResponseDesc] = useState("");
  const [error, setError] = useState("");
  const { post_id } = useParams();
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImageToS3 = async () => {
    try {
      if (!image) {
        throw new Error("Please select an image");
      }

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        `https://capstoneprojectga.s3.amazonaws.com`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const imageURL = `https://capstoneprojectga.s3.amazonaws.com/${image.name}`;
        return imageURL;
      } else {
        throw new Error("Error uploading image to S3");
      }
    } catch (error) {
      throw error;
    }
  };

  const AddResponse = async () => {
    try {
      setError("");
      const imageUrl = await uploadImageToS3();

      const res = await fetchData(
        `/responses/${userCtx.userId}/${post_id}`,
        "PUT",
        { response_desc: responseDesc, response_img: imageUrl }, // Store the imageURL in response_img
        userCtx.accessToken
      );

      if (res.ok) {
        console.log("Response added successfully");
        props.refreshPost();
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={responseDesc}
          onChange={(e) => setResponseDesc(e.target.value)}
          placeholder="Type your response here"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Submit</button>
        {error && <div>{error}</div>}
      </form>
    </>
  );
};

export default ChatroomResponse;

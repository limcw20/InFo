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

  const AddResponse = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/responses/${userCtx.userId}/${post_id}`,
        "PUT",
        { response_desc: responseDesc },
        userCtx.accessToken
      );

      console.log(res);
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
        <button type="submit">Submit</button>
        {error && <div>{error}</div>}
      </form>
    </>
  );
};

export default ChatroomResponse;

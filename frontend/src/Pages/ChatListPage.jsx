import React, { useContext, useEffect, useState } from "react";
import UserContext from "../Context/user";
import useFetch from "../Hooks/useFetch";
import { useParams } from "react-router-dom";

const ChatListPage = () => {
  const fetchData = useFetch();
  const [userData, setUserData] = useState(null); // Define userData state
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");
  let { id } = useParams();
  if (!id) {
    id = userCtx.userId;
  }

  const getPostById = async () => {
    try {
      setError("");
      const res = await fetchData(
        "/chat/" + id,
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      } else {
        alert(JSON.stringify(res.data));
        console.log(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPostById();
  }, [id, userCtx.accessToken]); // Make sure to include id and accessToken in the dependency array

  return <div>{userData ? <div>hi</div> : <div>Loading...</div>}</div>;
};

export default ChatListPage;

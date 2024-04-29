import React, { useContext, useEffect, useState } from "react";
import UserContext from "../Context/user";
import useFetch from "../Hooks/useFetch";
import { useParams } from "react-router-dom";

const ChatListPage = () => {
  const fetchData = useFetch();
  const [userData, setUserData] = useState(null);
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");
  const { user_id } = useParams(); // Destructure user_id directly from useParams()
  console.log("User ID from URL:", user_id);

  useEffect(() => {
    const getPostById = async () => {
      try {
        setError("");
        const res = await fetchData(
          `/chat/${user_id}`, // Use user_id directly from useParams()
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
    getPostById();
  }, [user_id, userCtx.accessToken]);

  return (
    <div>
      {userData ? (
        <div>
          {userData.map((post) => (
            <ChatListDisplay key={post.post_id} post={post} />
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ChatListPage;

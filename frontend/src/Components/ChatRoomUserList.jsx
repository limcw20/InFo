import React, { useContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import ChatroomDeletePostButton from "./ChatroomDeletePostButton";
import { useParams } from "react-router-dom";

const ChatRoomUserList = (props) => {
  const fetchData = useFetch();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const userCtx = useContext(UserContext);
  const user_id = userCtx.userId;
  const { post_id } = props;
  const getUserList = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/chat/chatuserlist/${post_id}`,
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        setUsers(res.data);
      } else {
        setError("Error fetching posts");
      }
    } catch (error) {
      setError("Error fetching posts");
      console.error(error);
    }
  };

  useEffect(() => {
    getUserList();
  }, [userCtx.accessToken]);

  const refreshList = async () => {
    await getUserList();
  };

  const handleDelete = async (target_user_id) => {
    try {
      setError("");
      const res = await fetchData(
        `/chat/${user_id}/${post_id}/${target_user_id}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log("User deleted successfully");
        refreshList();
      } else {
        setError("Error deleting user");
        console.error(error);
      }
    } catch (error) {
      setError("Error deleting user");
      console.error(error);
    }
  };

  return (
    <>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.user_id}>
              <p>{user.nickname}</p>
              <p>{user.is_superuser ? "Host" : ""}</p>

              {!user.is_superuser && (
                <button onClick={() => handleDelete(user.user_id)}>
                  Delete
                </button>
              )}

              <ChatroomDeletePostButton is_superuser={user.is_superuser} />
            </li>
          ))}
        </ul>
      ) : (
        <div>{error ? error : "No posts found"}</div>
      )}
    </>
  );
};

export default ChatRoomUserList;

import React, { useContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import styles from "./Chatroom.module.css";

const ChatRoomUserList = (props) => {
  const fetchData = useFetch();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const { post_id } = props;
  const userCtx = useContext(UserContext);
  const user_id = userCtx.userId;

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
        setError("Error fetching users");
      }
    } catch (error) {
      setError("Error fetching users");
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
    <div className={styles.userListContainer}>
      <h2 className={styles.header2}>User List:</h2>
      {users.length > 0 ? (
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.user_id} className={styles.userListItem}>
              <p>{user.nickname}</p>
              <p>{user.is_superuser ? "Host" : ""}</p>
              {!user.is_superuser && (
                <button
                  className={styles.button}
                  onClick={() => handleDelete(user.user_id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>{error ? error : "No users found"}</div>
      )}
    </div>
  );
};

export default ChatRoomUserList;

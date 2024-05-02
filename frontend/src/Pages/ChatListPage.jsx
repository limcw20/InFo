import React, { useContext } from "react";
import styles from "./ChatListPage.module.css";
import Chat from "../Components/Chat";
import UserContext from "../Context/user";
import { useParams } from "react-router-dom";

const ChatListPage = () => {
  let { user_id } = useParams();
  const userCtx = useContext(UserContext);
  if (!user_id) {
    user_id = userCtx.userId;
  }
  return (
    <div className={styles.background}>
      <Chat className={styles.list} user_id={user_id}></Chat>
    </div>
  );
};

export default ChatListPage;

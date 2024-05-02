import React from "react";
import Chatroom from "../Components/Chatroom";
import styles from "./ChatRoomPage.module.css";

const ChatRoomPage = () => {
  return (
    <div className={styles.background}>
      <Chatroom></Chatroom>;
    </div>
  );
};

export default ChatRoomPage;

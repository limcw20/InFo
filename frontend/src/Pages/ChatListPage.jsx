import React, { useContext } from "react";

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
    <>
      <Chat user_id={user_id}></Chat>
    </>
  );
};

export default ChatListPage;

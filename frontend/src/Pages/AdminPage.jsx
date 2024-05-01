import React, { useState } from "react";
import AdminPostControl from "../Components/AdminPostControl";
import AdminUserControl from "../Components/AdminUserControl";

const AdminPage = () => {
  const [showPostControl, setShowPostControl] = useState(true);
  const [showUserControl, setShowUserControl] = useState(false);

  const togglePostControl = () => {
    setShowPostControl(true);
    setShowUserControl(false);
  };

  const toggleUserControl = () => {
    setShowPostControl(false);
    setShowUserControl(true);
  };

  return (
    <>
      <h1>hello admin</h1>
      <button onClick={togglePostControl}>Show Post Control</button>
      <button onClick={toggleUserControl}>Show User Control</button>
      {showPostControl && <AdminPostControl />}
      {showUserControl && <AdminUserControl />}
    </>
  );
};

export default AdminPage;

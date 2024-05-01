import React, { useContext, useEffect, useState } from "react";
import UserContext from "../Context/user";
import useFetch from "../Hooks/useFetch";

const AdminUserControl = () => {
  const fetchData = useFetch();
  const [user, setUser] = useState([]);
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");

  const getAllUsers = async () => {
    try {
      setError("");
      const res = await fetchData(
        "/auth/users",
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        setUser(res.data);
      } else {
        setError("Error fetching users");
      }
    } catch (error) {
      setError("Error fetching users");
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [userCtx.accessToken]);

  const refreshUser = async () => {
    await getAllUsers();
  };

  const handleDelete = async (userId) => {
    try {
      setError("");
      const res = await fetchData(
        `/auth/users/${userId}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log("User deleted successfully");
        refreshUser();
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
      {user.length > 0 ? (
        <ul>
          {user.map((user) => (
            <li key={user.user_id}>
              <p>Username: {user.username}</p>
              <p>Nickname: {user.nickname}</p>
              <p>
                Name:
                {user.first_name} {user.last_name ? user.last_name : ""}
              </p>
              <p>Gender: {user.gender ? user.gender : "not stated"}</p>
              <p>
                Last Online:{" "}
                {user.last_online ? user.last_online : "not logged in yet"}
              </p>
              <p>
                {user.profile_picture
                  ? user.profile_picture
                  : "No profile picture"}
              </p>
              <p>Admin: {user.is_admin ? "yes" : "no"}</p>
              {!user.is_admin && (
                <button onClick={() => handleDelete(user.user_id)}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>{error ? error : "No user found"}</div>
      )}
    </>
  );
};

export default AdminUserControl;

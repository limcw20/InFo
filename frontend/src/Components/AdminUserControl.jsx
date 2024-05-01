import React, { useContext, useEffect, useState } from "react";
import UserContext from "../Context/user";
import useFetch from "../Hooks/useFetch";

const AdminUserControl = () => {
  const fetchData = useFetch();
  const [user, setUser] = useState([]);
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");

  const getAllUserPosts = async () => {
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
        setError("Error fetching posts");
      }
    } catch (error) {
      setError("Error fetching posts");
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUserPosts();
  }, [userCtx.accessToken]);

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
            </li>
          ))}
        </ul>
      ) : (
        <div>{error ? error : "No posts found"}</div>
      )}
    </>
  );
};

export default AdminUserControl;

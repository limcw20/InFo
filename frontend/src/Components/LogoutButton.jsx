import React, { useContext, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";

const LogoutButton = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [error, setError] = useState();

  const Logout = async () => {
    try {
      setError("");
      const res = await fetchData(
        "/auth/users/logout",
        "POST",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        window.location.href = "/"; //useNavigate doesn't seem to work after multiple tries
        console.log("Log out successful");
      }
    } catch (error) {
      setError("Failed to log out");
      console.error(error);
    }
  };
  return (
    <>
      <button onClick={() => Logout()}>Log Out</button>
    </>
  );
};

export default LogoutButton;

import React, { useContext, useState } from "react";
import ReactDom from "react-dom";
import styles from "./SignUpModal.module.css";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import { jwtDecode } from "jwt-decode";

const LoginForm = (props) => {
  const userCtx = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [user_password, setPassword] = useState("");
  const fetchData = useFetch();

  const login = async () => {
    try {
      const res = await fetchData("/auth/users", "POST", {
        username,
        user_password,
      });

      if (res.ok) {
        userCtx.setAccessToken(res.data.access);

        const decoded = jwtDecode(res.data.access);
        userCtx.setUserId(decoded.loggedInId);

        // Log the decoded token
        console.log("Decoded Token:", decoded);

        const isAdmin = decoded.role;
        userCtx.setRole(isAdmin); // Set role based on isAdmin boolean value
      } else {
        alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("login Error", error);
    }
  };

  return (
    <div>
      <div>
        <div className={styles.crossContainer}>
          <i
            className={`bi bi-x-circle ${styles.cross}`}
            onClick={() => {
              props.setShowLoginModal(false);
            }}
          ></i>
        </div>
        <h1>Login</h1>
        <div>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <input
            type="password"
            placeholder="Password"
            className={styles.passwordInput}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        <button className={styles.LoginButton} onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
};

const LoginModal = (props) => {
  return (
    <>
      {ReactDom.createPortal(
        <LoginForm setShowLoginModal={props.setShowLoginModal} />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default LoginModal;

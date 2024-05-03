import React, { useContext, useState } from "react";
import ReactDom from "react-dom";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import { jwtDecode } from "jwt-decode";
import styles from "./SignupModal.module.css";

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
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.crossContainer}>
          <i
            className={`bi bi-x-circle ${styles.cross}`}
            onClick={() => {
              props.setShowLoginModal(false);
            }}
          ></i>
        </div>
        <h1 className={styles.title}>Login</h1>
        <div className={styles.inputField}>
          <input
            type="text"
            placeholder="Username"
            className={styles.userNameInput}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <input
            type="password"
            placeholder="Password"
            className={styles.passwordInput}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.LoginButton}
            onClick={() => props.setShowLoginModal(false)}
          >
            Close
          </button>
          <button className={styles.CloseButton} onClick={login}>
            Login
          </button>
        </div>
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

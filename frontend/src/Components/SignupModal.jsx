import React, { useRef, useState } from "react";
import ReactDom from "react-dom";
import useFetch from "../Hooks/useFetch";
import styles from "./SignUpModal.module.css";

const SignupForm = (props) => {
  const fetchData = useFetch();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const nicknameRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [accCreated, setAccCreated] = useState(false);
  const [allFields, setAllFields] = useState(false);
  const [passwordMatch, setPasswordsMatch] = useState(false);
  const [error, setError] = useState("");

  const register = async () => {
    const usernameCheck = usernameRef.current?.value;
    const passwordCheck = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current.value;
    setIsLoading(true);
    setError("");
    setPasswordsMatch(false);
    if (!usernameCheck || !passwordCheck) {
      setAllFields(true);
      setIsLoading(false);
      throw new Error("Please fill in all required fields.");
    }
    if (passwordCheck != passwordConfirm) {
      setPasswordsMatch(true);
      setIsLoading(false);
      throw new Error("Passwords do not match");
    }
    try {
      const res = await fetchData("/auth/users", "PUT", {
        username: usernameRef.current.value,
        user_password: passwordRef.current.value,
        nickname: nicknameRef.current.value,
        first_name: firstNameRef.current.value,
        last_name: lastNameRef.current.value,
      });
      if (res.ok) {
        setAccCreated(true);
        setAllFields(false);
        setIsLoading(false);
        props.setShowSignupModal(false);
        alert("Account Created");
      } else {
        setError(JSON.stringify(res.data));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to register", error);
    }
  };
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.crossContainer}>
          <i
            className={`bi bi-x-circle ${styles.cross}`}
            onClick={() => {
              props.setShowSignupModal(false);
            }}
          ></i>
        </div>
        <h1>Sign Up</h1>
        <div>
          <input
            type="text"
            placeholder="First Name"
            ref={firstNameRef}
          ></input>
          <input type="text" placeholder="Last Name" ref={lastNameRef}></input>
          <input type="text" placeholder="Username" ref={usernameRef}></input>
          <input type="text" placeholder="Nickname" ref={nicknameRef}></input>
          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
          ></input>
          <input
            type="password"
            placeholder="Password"
            ref={passwordConfirmRef}
          ></input>
        </div>

        <button onClick={register}>SIGN UP</button>
        {accCreated && <div>account created</div>}
        {allFields && <div> Please Fill up all fields!</div>}
        {passwordMatch && <div>Passwords do not match!</div>}
        {error && <div>{error}</div>}
        {isLoading && (
          <div className={styles.ldsSpinner}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    </div>
  );
};

const SignupModal = (props) => {
  return (
    <>
      {ReactDom.createPortal(
        <SignupForm setShowSignupModal={props.setShowSignupModal}></SignupForm>,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default SignupModal;

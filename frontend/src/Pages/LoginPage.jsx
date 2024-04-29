import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import LoginModal from "../Components/LoginModal";
import SignupModal from "../Components/SignupModal";

const LandingPage = (props) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const loginModal = () => {
    setShowLoginModal(true);
  };

  const signupModal = () => {
    setShowSignupModal(true);
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.content}>
        <div className={styles.title}>InFo</div>

        <div className={styles.twoButtons}>
          <div className={styles.login} onClick={loginModal}>
            Login
          </div>
          <div className={styles.signup} onClick={signupModal}>
            Sign Up
          </div>
        </div>

        {showLoginModal && (
          <LoginModal setShowLoginModal={setShowLoginModal}></LoginModal>
        )}

        {showSignupModal && (
          <SignupModal setShowSignupModal={setShowSignupModal}></SignupModal>
        )}
      </div>
    </div>
  );
};

export default LandingPage;

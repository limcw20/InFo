import React from "react";
import styles from "./Discover.module.css";

const DiscoverJoinButton = ({ handleJoinClick }) => {
  return (
    <button className={styles.button} onClick={handleJoinClick}>
      Join Post
    </button>
  );
};

export default DiscoverJoinButton;

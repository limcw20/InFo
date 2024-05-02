import React from "react";
import styles from "./Discover.module.css";

const DiscoverPassButton = ({ handleClick }) => {
  return (
    <button className={styles.button} onClick={handleClick}>
      Pass
    </button>
  );
};

export default DiscoverPassButton;

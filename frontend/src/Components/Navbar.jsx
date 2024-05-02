import React, { useContext } from "react";
import styles from "./NavBar.module.css";
import { Link, useParams } from "react-router-dom";
import UserContext from "../Context/user";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { user_id } = useParams();
  const userCtx = useContext(UserContext);
  return (
    <div className={styles.sideNavBar}>
      <div className={styles.sideBar}>
        <nav className={styles.content}>
          <ul>
            <div className={styles.InFo}>InFo</div>
            <div className={styles.InFoDesc}>
              Internet Forum meets Matchmaking
            </div>
            <li>
              <Link to="/discover">Discover</Link>
            </li>
            <li>
              <Link to={`/chat/${user_id || userCtx.userId}`}>Chat List</Link>
            </li>
            <li>
              <Link to="/postInFo">Post InFo</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <LogoutButton></LogoutButton>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

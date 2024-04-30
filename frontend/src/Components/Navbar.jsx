import React from "react";
import styles from "./NavBar.module.css";
import ChatListPage from "../Pages/ChatListPage";
import PostInFoPage from "../Pages/PostInFoPage";
import DiscoverPage from "../Pages/DiscoverPage";
import SettingsPage from "../Pages/SettingsPage";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <nav>
        <ul>
          <li>
            <Link to="/discover">Discover</Link>
          </li>
          <li>
            <Link to="/chat">Chat List</Link>
          </li>
          <li>
            <Link to="/postInFo">Post InFo</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

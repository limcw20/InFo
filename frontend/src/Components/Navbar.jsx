import React, { useContext } from "react";
import styles from "./NavBar.module.css";
import { Link, useParams } from "react-router-dom";
import UserContext from "../Context/user";

const Navbar = () => {
  const { user_id } = useParams();
  const userCtx = useContext(UserContext);
  return (
    <header className={styles.navbar}>
      <nav>
        <ul>
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
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

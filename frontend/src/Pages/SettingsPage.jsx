import React, { useContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import EditUserInfo from "../Components/EditUserInfo";
import CategorySettings from "../Components/CategorySettings";
import AddCategorySettings from "../Components/AddCategorySettings";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [userInfo, setUserInfo] = useState();
  const [originalUserInfo, setOriginalUserInfo] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const getUserInfo = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/users/${userCtx.userId}`,
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        const userData = res.data;
        setUserInfo(userData);
        setOriginalUserInfo(userData);
      } else {
        setError("Error fetching user information");
      }
    } catch (error) {
      setError("Error fetching user information");
      console.error(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [userCtx.accessToken]);

  const handleSaveUserInfo = async (updatedUserInfo) => {
    try {
      setError("");
      const { nickname, first_name, last_name, gender } = updatedUserInfo;
      const res = await fetchData(
        `/users/${userCtx.userId}`,
        "PATCH",
        { nickname, first_name, last_name, gender },
        userCtx.accessToken
      );
      if (res.ok) {
        setUserInfo(updatedUserInfo);
        console.log("User information updated successfully");
        setIsEditing(false);
        getUserInfo();
      } else {
        setError("Error updating user information");
      }
    } catch (error) {
      setError("Error updating user information");
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setUserInfo(originalUserInfo);
    setIsEditing(false);
    getUserInfo();
  };

  return (
    <div className={styles.background}>
      <div className={styles.leftColumn}>
        {userInfo && !isEditing && (
          <div className={styles.list}>
            <p className={styles.header}>User Details</p>
            <p className={styles.p}>Username: {userInfo.username}</p>
            <p className={styles.p}>First Name: {userInfo.first_name}</p>
            <p className={styles.p}>Last Name: {userInfo.last_name}</p>
            <p className={styles.p}>Nickname: {userInfo.nickname}</p>
            <p className={styles.p}>Gender: {userInfo.gender}</p>
            <button
              className={styles.button}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        )}
        {userInfo && isEditing && (
          <EditUserInfo
            userInfo={userInfo}
            onSave={handleSaveUserInfo}
            onCancel={handleCancelEdit}
          />
        )}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.rightColumn}>
          <CategorySettings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

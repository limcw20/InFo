import React, { useState } from "react";
import styles from "../Pages/SettingsPage.module.css";

const EditUserInfo = ({ userInfo, onSave, onCancel }) => {
  const [nickname, setNickname] = useState(userInfo.nickname);
  const [firstName, setFirstName] = useState(userInfo.first_name);
  const [lastName, setLastName] = useState(userInfo.last_name);
  const [gender, setGender] = useState(userInfo.gender); // Ensure gender is not null

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "nickname":
        setNickname(value);
        break;
      case "first_name":
        setFirstName(value);
        break;
      case "last_name":
        setLastName(value);
        break;
      case "gender":
        setGender(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nickname, first_name: firstName, last_name: lastName, gender });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className={styles.header3}>
        Nickname:
        <input
          className={styles.p}
          type="text"
          name="nickname"
          value={nickname}
          onChange={handleChange}
        />
      </label>
      <label className={styles.header3}>
        First Name:
        <input
          className={styles.p}
          type="text"
          name="first_name"
          value={firstName}
          onChange={handleChange}
        />
      </label>
      <label className={styles.header3}>
        Last Name:
        <input
          className={styles.p}
          type="text"
          name="last_name"
          value={lastName}
          onChange={handleChange}
        />
      </label>
      <label className={styles.header3}>
        Gender:
        <select name="gender" value={gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>
      </label>
      <button className={styles.button} type="submit">
        Save
      </button>
      <button className={styles.button} type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditUserInfo;

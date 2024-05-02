import React, { useContext, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import styles from "../Pages/SettingsPage.module.css";

const AddCategorySettings = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [category, setCategory] = useState("");
  const [sub_category, setSubCategory] = useState("");
  const [error, setError] = useState("");
  const user_id = userCtx.userId;

  const AddCategory = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/users/${user_id}/category`,
        "PUT",
        { category: category, sub_category: sub_category },
        userCtx.accessToken
      );

      console.log(res);
      if (res.ok) {
        console.log("Response added successfully");
        props.refreshCategories();
      } else {
        setError("Error adding response");
      }
    } catch (error) {
      setError("Error adding response");
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    AddCategory();
  };

  return (
    <div className={styles.gap}>
      <form onSubmit={handleSubmit}>
        <p className={styles.header3}>Add Category</p>
        <input
          className={styles.input}
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Add category here"
        />
        <p className={styles.header3}>Add Sub-Category</p>
        <input
          className={styles.input}
          type="text"
          value={sub_category}
          onChange={(e) => setSubCategory(e.target.value)}
          placeholder="Add sub-category here"
        />
        <button className={styles.button} type="submit">
          Submit
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default AddCategorySettings;

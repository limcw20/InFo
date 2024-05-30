import React, { useContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";
import AddCategorySettings from "./AddCategorySettings";
import styles from "../Pages/SettingsPage.module.css";

const CategorySettings = () => {
  const fetchData = useFetch();
  const [categories, setCategories] = useState([]);
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");

  const getUserCategories = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/users/${userCtx.userId}/category`,
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        setCategories(res.data);
      } else {
        setError("No Categories Found");
      }
    } catch (error) {
      setError("Error fetching categories");
    }
  };

  useEffect(() => {
    getUserCategories();
  }, [userCtx.accessToken]);

  const refreshCategories = async () => {
    await getUserCategories();
  };

  const handleDelete = async (user_settings_id) => {
    try {
      setError("");
      const res = await fetchData(
        `/users/${user_settings_id}/${userCtx.userId}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        console.log("Category deleted successfully");
        refreshCategories();
      } else {
        setError("Error deleting category");
      }
    } catch (error) {
      setError("Error deleting category");
      console.error(error);
    }
  };

  return (
    <>
      {categories.length > 0 ? (
        <ul className={styles.list}>
          {categories.map((userCategory) => (
            <li key={userCategory.user_settings_id} className={styles.listItem}>
              <p className={styles.header}>Category</p>
              <p className={styles.p}>{userCategory.category}</p>
              <p className={styles.header}>Sub-category</p>
              <p className={styles.p}>{userCategory.sub_category}</p>
              <button
                className={styles.button}
                onClick={() => handleDelete(userCategory.user_settings_id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.error}>
          {error ? error : "No categories found"}
        </div>
      )}
      <AddCategorySettings refreshCategories={refreshCategories} />
    </>
  );
};

export default CategorySettings;

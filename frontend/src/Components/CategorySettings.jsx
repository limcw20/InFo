import React, { useContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";

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
        setError("Error fetching categories");
      }
    } catch (error) {
      setError("Error fetching categories");
    }
  };

  useEffect(() => {
    getUserCategories();
  }, [userCtx.accessToken]);

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
        getUserCategories(); // Refresh categories after deletion
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
        <ul>
          {categories.map((userCategory) => (
            <li key={userCategory.user_settings_id}>
              <p>{userCategory.category}</p>
              <p>{userCategory.sub_category}</p>
              <button
                onClick={() => handleDelete(userCategory.user_settings_id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>{error ? error : "No categories found"}</div>
      )}
    </>
  );
};

export default CategorySettings;

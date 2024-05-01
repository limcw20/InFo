import React, { useContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";
import UserContext from "../Context/user";

const CategorySettings = () => {
  const fetchData = useFetch();
  const [category, setCategory] = useState([]);
  const userCtx = useContext(UserContext);
  const [error, setError] = useState("");
  const user_id = userCtx.userId;

  const getUserCategories = async () => {
    try {
      setError("");
      const res = await fetchData(
        `/users/${user_id}/category`,
        "GET",
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        setCategory(res.data);
      } else {
        setError("Error fetching Categories");
      }
    } catch (error) {
      setError("Error fetching categories");
    }
  };
  useEffect(() => {
    getUserCategories();
  }, [userCtx.accessToken]);

  return (
    <>
      {category.length > 0 ? (
        <ul>
          {category.map((category) => (
            <li key={category.user_settings_id}>
              <p>{category.category}</p>
              <p>{category.sub_category}</p>

              {/* <button onClick={() => handleDelete(post.post_id)}>Delete</button>
               */}
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

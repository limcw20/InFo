import React, { Suspense, useState, useEffect } from "react";
import UserContext from "./Context/user";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import ChatListPage from "./Pages/ChatListPage";
import AdminPage from "./Pages/AdminPage";
import useFetch from "./Hooks/useFetch";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState(null);

  const userContextValue = {
    accessToken,
    setAccessToken,
    role,
    setRole,
    userId,
    setUserId,
  };

  // Convert accessToken value to a boolean to see if the user is logged in
  const isLoggedIn = !!accessToken;

  useEffect(() => {
    if (role !== null) {
      return; // dont do anything after role is set
    }

    const fetchUserData = async () => {
      const fetchData = useFetch();
      try {
        if (isLoggedIn) {
          // Fetch user data from backend
          const userDataResponse = await fetchData(
            "/auth/users",
            "GET",
            undefined,
            userCtx.accessToken
          );

          if (userDataResponse.ok) {
            const userData = await userDataResponse.json();
            const isAdmin = userData.is_admin;
            const loggedInUserId = userData.user_id;
            setRole(isAdmin);
            setUserId(loggedInUserId);
            console.log(isAdmin);
            console.log(loggedInUserId);
          } else {
            // Handle error fetching user data
            console.error("Error fetching user data:", userDataResponse);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData(); // Call fetchUserData on mount
  }, [accessToken, isLoggedIn, role]); // Add accessToken, isLoggedIn, and role to dependency array

  return (
    <UserContext.Provider value={userContextValue}>
      <Suspense fallback={<h1>Loading</h1>}>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                role ? (
                  <Navigate to="/AdminPage" />
                ) : (
                  <Navigate to={`/chat/${userId}`} />
                )
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/ChatListPage"
            element={
              isLoggedIn && !role ? (
                <ChatListPage userId={userId} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/chat/:user_id" element={<ChatListPage />} />
          <Route
            path="/AdminPage"
            element={isLoggedIn && role ? <AdminPage /> : <Navigate to="/" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </UserContext.Provider>
  );
}

export default App;

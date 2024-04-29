import React, { Suspense, useState, useEffect } from "react";
import UserContext from "./Context/user";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import ChatListPage from "./Pages/ChatListPage";
import AdminPage from "./Pages/AdminPage";

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
    // Fetch user data and set role based on is_admin field
    const fetchUserData = async () => {
      try {
        if (isLoggedIn) {
          // Fetch user data from backend
          const userDataResponse = await fetch("/auth/users", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log(userDataResponse);

          if (userDataResponse.ok) {
            const userData = userDataResponse;
            console.log(userData);
            const isAdmin = userData.is_admin;
            setRole(isAdmin);
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
    console.log("isLoggedIn:", isLoggedIn);
    console.log("role:", role);
    console.log(accessToken);
  }, [accessToken, isLoggedIn]); // Add accessToken and isLoggedIn to dependency array

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
                  <Navigate to="/ChatListPage" />
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

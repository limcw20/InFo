import React, { Suspense, useState } from "react";
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

  return (
    <>
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
              path="/chat"
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
    </>
  );
}

export default App;

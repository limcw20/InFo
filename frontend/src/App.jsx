import React, { Suspense, useState } from "react";
import UserContext from "./Context/user";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const userContextValue = {
    accessToken,
    setAccessToken,
    role,
    setRole,
    userId,
    setUserId,
  };

  //converting accessToken value to a boolean to see if user is logged in
  const isLoggedIn = !!accessToken;

  return (
    <UserContext.Provider value={userContextValue}>
      <Suspense fallback={<h1>Loading</h1>}>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/ChatListPage" /> : <LoginPage />
            }
          />
        </Routes>
      </Suspense>
    </UserContext.Provider>
  );
}

export default App;

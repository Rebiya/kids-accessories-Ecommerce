// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./Signup";
import Signin from "./Signin";
import AdminPage from "./AdminPage";
import jwt_decode from "jwt-decode";

function App() {
  const token = localStorage.getItem("token");
  let userRole = 0;

  if (token) {
    const decodedToken = jwt_decode(token);
    userRole = decodedToken.role;
  }

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/admin"
          element={userRole === 1 ? <AdminPage /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

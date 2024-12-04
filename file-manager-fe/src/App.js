import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Footer from "./components/Footer";
import { getSessionToken, getSessionUser } from "./utilities/auth";
import "./assets/global/App.scss";

const App = () => {
  const token = getSessionToken();
  const userRole = getSessionUser();

  return (
    <Router>
      {!token ? (
        <Login />
      ) : (
        <div className="app-container d-flex">
          <ToastContainer />
          <Header userRole={userRole} />
          <Navbar userRole={userRole} />
          <div className="main-content flex-grow-1">
            <Routes>
              <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
              {userRole === "admin" && <Route path="/admin" element={<AdminPanel />} />}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </Router>
  );
};

export default App;

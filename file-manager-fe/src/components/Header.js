import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { clearSessionToken,clearSessionUser } from "../utilities/auth";
import "../assets/components/Header.scss";

const Header = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSessionToken();
    clearSessionUser();
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="header bg-primary text-white d-flex justify-content-between align-items-center p-3">
      <img src={process.env.PUBLIC_URL + '/logo64.png'} />
      <h1 className="header-title">File Manager</h1>
      <div>
        <span className="me-3">
        <FontAwesomeIcon className="icon" icon={faUser} />{userRole}
        </span>
        <button className="btn btn-secondary" onClick={handleLogout}>
        <FontAwesomeIcon className="icon" icon={faSignOutAlt} />Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

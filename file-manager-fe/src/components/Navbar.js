import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserCog } from '@fortawesome/free-solid-svg-icons';
import "../assets/components/Navbar.scss";

const Navbar = ({ userRole }) => {
  return (
    <div className="vertical-navbar bg-light">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
          <FontAwesomeIcon className="icon" icon={faHome} /> Dashboard
          </Link>
        </li>
        {userRole === "admin" && (
          <li className="nav-item">
            <Link className="nav-link" to="/admin">
            <FontAwesomeIcon className="icon" icon={faUserCog} /> User Management
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;

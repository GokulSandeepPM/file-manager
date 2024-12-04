import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight, faTrashCan, faPencil, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "./../assets/components/UserManagement.scss";
import { addUser } from "../services/api";

const UserManagement = ({ users, onRoleChange, onDelete, loadUsers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", roles: "user" });

  const usersPerPage = 8;

  const totalPages = Math.ceil(users.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUser(newUser);
      toast.success("User created successfully!");
      setShowForm(false);
      setTimeout(() => {
        loadUsers();
      });
    } catch (error) {
      toast.error("Email ID already exists!");
    }
  };

  const handleEditClick = (userId, currentRole) => {
    setEditingUserId(userId);
    setEditedRole(currentRole);
  };

  const handleSaveClick = (userId) => {
    onRoleChange(userId, editedRole);
    setEditingUserId(null);
    setEditedRole("");
  };

  return (
    <div className="user-management-container">
      <ToastContainer />
      <h3>User Management</h3>
      {/* New User Form */}
      {showForm && (
        <div className="user-form">
          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              required
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              required
            />
            <label>Role</label>
            <select
              name="roles"
              value={newUser.roles}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <button type="submit" className="btn btn-success">
              <FontAwesomeIcon icon={faFloppyDisk} /> Save
            </button>
            <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Users Table */}
      {!showForm && (
        <>
          <button className="btn btn-add" onClick={() => setShowForm(true)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    {editingUserId === user._id ? (
                      <select
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    ) : (
                      user.roles
                    )}
                  </td>
                  <td>
                    {editingUserId === user._id ? (
                      <button
                        className="btn btn-success"
                        onClick={() => handleSaveClick(user._id)}
                      >
                        <FontAwesomeIcon className="icon" icon={faFloppyDisk} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEditClick(user._id, user.roles)}
                      >
                        <FontAwesomeIcon className="icon" icon={faPencil} />
                      </button>
                    )}
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(user._id)}
                      disabled={editingUserId === user._id}
                    >
                      <FontAwesomeIcon className="icon" icon={faTrashCan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table><div className="pagination">
            <button
              className="btn"
              onClick={handleFirstPage}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>
            <button
              className="btn"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button
              className="btn"
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </div></>
      )}
    </div>
  );
};

export default UserManagement;

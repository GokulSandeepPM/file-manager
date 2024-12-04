import React, { useState, useEffect } from "react";
import UserManagement from "../components/UserManagement";
import { fetchUsers, manageUser, deleteUser } from "../services/api";
import "./../assets/pages/AdminPanel.scss";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await manageUser(userId, { role });
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role } : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId, { active: false });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="admin-panel-container">
      <UserManagement
        users={users}
        onRoleChange={handleRoleChange}
        onDelete={handleDelete}
        loadUsers = {loadUsers}
      />
    </div>
  );
};

export default AdminPanel;

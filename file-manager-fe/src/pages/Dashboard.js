import React, { useState, useEffect } from "react";
import DocumentList from "../components/DocumentList";
import FileUpload from "../components/FileUpload";
import SearchBar from "../components/SearchBar";
import { fetchDocuments, uploadDocument, deleteDocument } from "../services/api";
import "./../assets/pages/Dashboard.scss";

const Dashboard = ({ userRole }) => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const loadDocuments = async () => {
    try {
      const response = await fetchDocuments();
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (formData) => {
    try {
      const response = await uploadDocument(formData);
      setDocuments([...documents, response.data]);
      setFilteredDocuments([...documents, response.data]);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      const updatedDocs = documents.filter((doc) => doc._id !== id);
      setDocuments(updatedDocs);
      setFilteredDocuments(updatedDocs);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleSearch = (query) => {
    const filtered = documents.filter((doc) =>
      doc.fileName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDocuments(filtered);
  };

  return (
    <div className="dashboard-container">
      <h3>Dashboard</h3>
      <div className="top-bar">
        <SearchBar onSearch={handleSearch} />
        <FileUpload onUpload={handleUpload} userRole={userRole} loadDocuments={loadDocuments} />
      </div>
      <DocumentList
        documents={filteredDocuments}
        onDelete={handleDelete}
        userRole={userRole}
      />
    </div>
  );
};

export default Dashboard;

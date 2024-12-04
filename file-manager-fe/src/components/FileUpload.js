import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import "./../assets/components/FileUpload.scss";

const FileUpload = ({ onUpload, userRole, loadDocuments }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Reference for hidden file input

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Invalid file type. Only PDF, DOCX, and TXT files are allowed.");
        return;
      }

      if (selectedFile.size > maxSize) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }

      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      await onUpload(formData);
      setFile(null);
      toast.success("File uploaded successfully!");
      setTimeout(() => {
        loadDocuments();
      }, 3000);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the hidden file input
    }
  };

  if (userRole !== "admin") return null;

  return (
    <div className="file-upload">
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {/* Upload button */}
      <button onClick={handleButtonClick} className="upload-btn">
        <FontAwesomeIcon className="icon" icon={faPlus} />
      </button>
    </div>
  );
};

export default FileUpload;

import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight, faTrashCan, faDownload } from '@fortawesome/free-solid-svg-icons';
import "./../assets/components/DocumentList.scss";
import { downloadDocument } from "../services/api";  // Make sure you import the downloadDocument function

const DocumentList = ({ documents, onDelete, userRole }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = userRole === "admin" ? 5 : 8;
  
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  
  const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);
  const totalPages = Math.ceil(documents.length / documentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle downloading the document
  const handleDownload = async (doc) => {
    try {
      const response = await downloadDocument(doc._id);
      // Create a blob URL for the file data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const FileType = {
    'application/pdf' : 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'Word Document',
    'text/plain' : 'Text Document'
  }

  return (
    <div className="document-list">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDocuments.map((doc) => (
            <tr key={doc._id}>
              <td>{doc.fileName}</td>
              <td>{FileType[doc.fileType]}</td>
              <td>{(doc.size / 1024).toFixed(2)} KB</td>
              <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
              <td>
                {/* Delete Button */}
                {userRole === "admin" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(doc._id)}
                  >
                    <FontAwesomeIcon className="icon" icon={faTrashCan} />
                  </button>
                )}
                {/* Download Button */}
                <button
                  className="btn btn-primary"
                  onClick={() => handleDownload(doc)}
                >
                  <FontAwesomeIcon className="icon" icon={faDownload} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon className="icon" icon={faAngleDoubleLeft} />
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon className="icon" icon={faAngleLeft} />
        </button>
        
        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon className="icon" icon={faAngleRight} />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon className="icon" icon={faAngleDoubleRight} />
        </button>
      </div>
    </div>
  );
};

export default DocumentList;

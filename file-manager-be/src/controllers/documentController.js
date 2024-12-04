const { GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/awsConfig");
const Document = require("../models/documentModel");
const logger = require("../utils/logger");

const uploadDocument = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      logger.warn("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newDocument = new Document({
      fileName: file.originalname,
      fileUrl: file.location, 
      fileType: file.mimetype,
      size: file.size,
      fileKey: file.key, 
    });

    await newDocument.save();
    logger.info(`Document uploaded successfully: ${newDocument.fileName}`);
    res.status(201).json({ message: "File uploaded successfully", document: newDocument });
  } catch (error) {
    logger.error(`Error uploading document: ${error.message}`);
    res.status(500).json({ message: "Error uploading document", error });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    logger.info(`Fetched ${documents.length} documents`);
    res.json(documents);
  } catch (error) {
    logger.error(`Error fetching documents: ${error.message}`);
    res.status(500).json({ message: "Error fetching documents", error });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
      logger.warn(`Document not found for ID: ${id}`);
      return res.status(404).json({ message: "Document not found" });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: document.fileKey,
    };

    const command = new GetObjectCommand(params);
    const data = await s3.send(command);

    // Map file types to proper MIME types
    const mimeTypes = {
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
    };

    const fileExtension = document.fileType.split('/')[1];  // Extract file extension from MIME type
    const contentType = mimeTypes[fileExtension] || 'application/octet-stream';  // Default MIME type

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`);

    // Ensure the file stream is piped to the response
    if (data.Body && data.Body.pipe) {
      data.Body.pipe(res);

      data.Body.on('end', () => {
        logger.info(`Document downloaded successfully: ${document.fileName}`);
        res.end();
      });

      data.Body.on('error', (err) => {
        console.error('Error streaming file:', err);
        res.status(500).json({ message: "Failed to stream document", error: err });
      });
    } else {
      res.status(500).json({ message: "Failed to get a valid file stream" });
    }
  } catch (error) {
    logger.error(`Error downloading document: ${error.message}`);
    res.status(500).json({ message: "Failed to download document", error });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      logger.warn(`Document not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Document not found" });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: document.fileKey,
    };

    await s3.send(new DeleteObjectCommand(params));
    await Document.deleteOne({ _id: req.params.id });
    logger.info(`Document deleted successfully: ${document.fileName}`);
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting document: ${error.message}`);
    res.status(500).json({ message: "Failed to delete document", error });
  }
};

module.exports = { uploadDocument, getDocuments, downloadDocument, deleteDocument };
const express = require("express");
const { uploadDocument, getDocuments, deleteDocument,downloadDocument } = require("../controllers/documentController");
const multer = require("multer");
const multerS3 = require("multer-s3");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const s3 = require("../config/awsConfig");

// Multer S3 configuration
const upload = multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET_NAME,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        cb(null, `documents/${Date.now()}_${file.originalname}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
  });


router.get("/", authMiddleware, getDocuments);
router.get("/download/:id", authMiddleware, downloadDocument);
router.post("/upload", authMiddleware,upload.single("file"), uploadDocument);
router.delete("/:id", authMiddleware, deleteDocument);

module.exports = router;
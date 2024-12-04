const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../src/config/awsConfig");
const User = require("../src/models/userModel");
const Document = require("../src/models/documentModel");
const logger = require("../src/utils/logger");

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    logger.info(`${process}`); 
    logger.info(`${JSON.stringify(process.env,null,2)}`); 
    logger.info(`Mongo DB URL : ${process.env.MONGO_URI}`); 

    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to MongoDB");

    // Seed Users
    const users = [
      { email: "admin@filemanager.com", username: "Admin", roles: "admin", password: await bcrypt.hash("adminpassword", 10) },
      { email: "user@filemanager.com", username: "User", roles: "user", password: await bcrypt.hash("userpassword", 10) },
    ];

    await User.deleteMany({});
    await User.insertMany(users);
    logger.info("Users seeded successfully");

    // Seed Documents
    const files = [
      { name: "sample.pdf", type: "application/pdf", localPath: path.join(__dirname, "files/sample.pdf") },
      { name: "sample.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", localPath: path.join(__dirname, "files/sample.docx") },
      { name: "sample.txt", type: "text/plain", localPath: path.join(__dirname, "files/sample.txt") },
    ];

    const bucketName = process.env.AWS_BUCKET_NAME;

    const documentEntries = [];
    for (const file of files) {
      const fileStream = fs.createReadStream(file.localPath);
      const s3Key = `documents/${Date.now()}_${file.name}`;

      // Upload to aws
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: s3Key,
          Body: fileStream,
          ContentType: file.type,
        })
      );

      // Add entry to document collection
      documentEntries.push({
        fileName: file.name,
        fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
        fileType: file.type,
        size: fs.statSync(file.localPath).size,
        fileKey: s3Key,
      });

      logger.info(`Uploaded ${file.name} to S3`);
    }

    await Document.deleteMany({});
    await Document.insertMany(documentEntries);
    logger.info("Documents seeded successfully");

    // Close MongoDB connection
    await mongoose.connection.close();
    logger.info("Database connection closed");
  } catch (error) {
    logger.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();

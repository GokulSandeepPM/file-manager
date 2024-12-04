const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/models/db");
const authRoutes = require("./src/routes/authRoutes");
const documentRoutes = require("./src/routes/documentRoutes");
const userRoutes = require("./src/routes/userRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);

// Read SSL/TLS certificates
const privateKey = fs.readFileSync("./keys/localhost.key", "utf8");
const certificate = fs.readFileSync("./keys/localhost.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

// Start HTTPS server
const PORT = process.env.PORT || 3000;
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
  fileKey : {type: String, required: true}
});

module.exports = mongoose.model("Document", documentSchema);

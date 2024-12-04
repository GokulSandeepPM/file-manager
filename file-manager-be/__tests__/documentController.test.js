const { uploadDocument, getDocuments, downloadDocument, deleteDocument } = require("../src/controllers/documentController");
const Document = require("../src/models/documentModel");
const { S3Client, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { mockClient } = require("aws-sdk-client-mock");
const httpMocks = require("node-mocks-http");

// Mock S3 Client
const s3Mock = mockClient(S3Client);

jest.mock("../src/models/documentModel");

describe("Document Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    s3Mock.reset();
  });

  describe("uploadDocument", () => {
    test("should successfully upload a document and save metadata to the database", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        file: {
          originalname: "testfile.pdf",
          mimetype: "application/pdf",
          size: 1024,
          location: "https://example.com/testfile.pdf",
          key: "documents/testfile.pdf",
        },
      });

      const res = httpMocks.createResponse();

      Document.mockImplementation(() => ({
        save: jest.fn().mockResolvedValueOnce({}),
      }));

      await uploadDocument(req, res);

      expect(Document).toHaveBeenCalledWith({
        fileName: "testfile.pdf",
        fileUrl: "https://example.com/testfile.pdf",
        fileType: "application/pdf",
        size: 1024,
        fileKey: "documents/testfile.pdf",
      });
      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res._getData()).message).toBe("File uploaded successfully");
    });

    test("should return a 400 error if no file is uploaded", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await uploadDocument(req, res);

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res._getData()).message).toBe("No file uploaded");
    });
  });

  describe("getDocuments", () => {
    test("should fetch and return all documents", async () => {
      const mockDocuments = [{ fileName: "testfile.pdf" }, { fileName: "test2.docx" }];
      Document.find.mockResolvedValueOnce(mockDocuments);

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await getDocuments(req, res);

      expect(Document.find).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockDocuments);
    });

    test("should handle errors when fetching documents", async () => {
      Document.find.mockRejectedValueOnce(new Error("DB error"));

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await getDocuments(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData()).message).toBe("Error fetching documents");
    });
  });

  describe("downloadDocument", () => {
    test("should stream a document successfully", async () => {
      const mockDocument = {
        _id: "123",
        fileName: "testfile.pdf",
        fileKey: "documents/testfile.pdf",
        fileType: "application/pdf",
      };

      const mockStream = {
        pipe: jest.fn(),
        on: jest.fn((event, callback) => {
          if (event === "end") callback();
        }),
      };

      Document.findById.mockResolvedValueOnce(mockDocument);
      s3Mock.on(GetObjectCommand).resolves({ Body: mockStream });

      const req = httpMocks.createRequest({ params: { id: "123" } });
      const res = httpMocks.createResponse();

      await downloadDocument(req, res);

      expect(Document.findById).toHaveBeenCalledWith("123");
      expect(s3Mock.calls(GetObjectCommand)).toHaveLength(1);
      expect(res.statusCode).toBe(200);
    });

    test("should return a 404 if the document is not found", async () => {
      Document.findById.mockResolvedValueOnce(null);

      const req = httpMocks.createRequest({ params: { id: "123" } });
      const res = httpMocks.createResponse();

      await downloadDocument(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData()).message).toBe("Document not found");
    });
  });

  describe("deleteDocument", () => {
    test("should delete a document successfully", async () => {
      const mockDocument = {
        _id: "123",
        fileName: "testfile.pdf",
        fileKey: "documents/testfile.pdf",
      };

      Document.findById.mockResolvedValueOnce(mockDocument);
      Document.deleteOne.mockResolvedValueOnce({});
      s3Mock.on(DeleteObjectCommand).resolves({});

      const req = httpMocks.createRequest({ params: { id: "123" } });
      const res = httpMocks.createResponse();

      await deleteDocument(req, res);

      expect(Document.findById).toHaveBeenCalledWith("123");
      expect(Document.deleteOne).toHaveBeenCalledWith({ _id: "123" });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData()).message).toBe("Document deleted successfully");
    });

    test("should return a 404 if the document does not exist", async () => {
      Document.findById.mockResolvedValueOnce(null);

      const req = httpMocks.createRequest({ params: { id: "123" } });
      const res = httpMocks.createResponse();

      await deleteDocument(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData()).message).toBe("Document not found");
    });
  });
});

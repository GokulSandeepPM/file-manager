const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authController = require("../src/controllers/authController");
const User = require("../src/models/userModel");

// Mock dependencies
jest.mock("../src/models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller - Login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should log in successfully with valid credentials", async () => {
    const mockReq = {
      body: { email: "testuser@filemanager.com", password: "validpassword" },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUser = {
      _id: "12345",
      email: "testuser@filemanager.com",
      password: "hashedpassword",
      roles: "user",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockedToken");

    await authController.login(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: "testuser@filemanager.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("validpassword", "hashedpassword");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "12345", roles: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ token: "mockedToken", roles: "user" });
  });

  test("should return 400 if email is invalid", async () => {
    const mockReq = {
      body: { email: "wrong@filemanager.com", password: "password" },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);

    await authController.login(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: "wrong@filemanager.com" });
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid user credentials" });
  });

  test("should return 400 if password is invalid", async () => {
    const mockReq = {
      body: { email: "testuser@filemanager.com", password: "wrongpassword" },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUser = {
      _id: "12345",
      email: "testuser@filemanager.com",
      password: "hashedpassword",
      roles: "user",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await authController.login(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: "testuser@filemanager.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedpassword");
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid password credentials" });
  });

  test("should return 500 on internal server error", async () => {
    const mockReq = {
      body: { email: "testuser@filemanager.com", password: "validpassword" },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockRejectedValue(new Error("Database error"));

    await authController.login(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: "testuser@filemanager.com" });
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Database error" });
  });
});

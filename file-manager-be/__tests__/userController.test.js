const userController = require("../src/controllers/userController");
const User = require("../src/models/userModel");

// Mock dependencies
jest.mock("../src/models/userModel");

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    test("should create a new user successfully", async () => {
      const mockReq = {
        body: {
          email: "testuser@filemanager.com",
          password: "password123",
          roles: "user",
          username: "testuser",
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);

      await userController.createUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: "testuser@filemanager.com" });
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    test("should return 400 if email already exists", async () => {
      const mockReq = {
        body: { email: "testuser@filemanager.com" },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue({ email: "testuser@filemanager.com" });

      await userController.createUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: "testuser@filemanager.com" });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Email already exists!" });
    });

    test("should return 500 on server error", async () => {
      const mockReq = { body: { email: "testuser@filemanager.com" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockRejectedValue(new Error("Database error"));

      await userController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getUsers", () => {
    test("should fetch all users successfully", async () => {
      const mockUsers = [{ email: "testuser@filemanager.com" }, { email: "admin@filemanager.com" }];
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.find.mockResolvedValue(mockUsers);

      await userController.getUsers({}, mockRes);

      expect(User.find).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    test("should return 500 on server error", async () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.find.mockRejectedValue(new Error("Database error"));

      await userController.getUsers({}, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Failed to fetch users",
        error: expect.any(Error),
      });
    });
  });

  describe("getUserById", () => {
    test("should fetch a user by ID", async () => {
      const mockUser = { email: "testuser@filemanager.com" };
      const mockReq = { params: { id: "123" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findById.mockResolvedValue(mockUser);

      await userController.getUserById(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    test("should return 404 if user is not found", async () => {
      const mockReq = { params: { id: "123" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findById.mockResolvedValue(null);

      await userController.getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

  describe("updateUser", () => {
    test("should update user details", async () => {
      const mockReq = { params: { id: "123" }, body: { email: "updated@filemanager.com" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = {
        save: jest.fn().mockResolvedValue(),
        email: "old@filemanager.com",
      };

      User.findById.mockResolvedValue(mockUser);

      await userController.updateUser(mockReq, mockRes);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User updated successfully",
        user: mockUser,
      });
    });

    test("should return 404 if user is not found", async () => {
      const mockReq = { params: { id: "123" }, body: {} };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findById.mockResolvedValue(null);

      await userController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

  describe("deleteUser", () => {
    test("should delete user by ID", async () => {
      const mockReq = { params: { id: "123" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = { email: "testuser@filemanager.com", deleteOne: jest.fn().mockResolvedValue() };

      User.findById.mockResolvedValue(mockUser);

      await userController.deleteUser(mockReq, mockRes);

      expect(mockUser.deleteOne).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
    });

    test("should return 404 if user is not found", async () => {
      const mockReq = { params: { id: "123" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findById.mockResolvedValue(null);

      await userController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });
});

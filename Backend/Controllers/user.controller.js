const userService = require("../Services/user.service");
const bcrypt = require("bcrypt");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    // console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get user by UUID
const getUserByID = async (req, res) => {
  try {
    const user = await userService.getUserByID(req.params.uuid);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    // console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Error fetching user", error });
  }
};

// Create user (password hashing added)
const createUser = async (req, res) => {
  try {
    const { email, password, ...userData } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check for duplicate email
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { ...userData, email, password: hashedPassword };

    const result = await userService.createUser(newUser);
    return res.status(201).json({
      message: "User created successfully",
      user_id: result.insertId,
    });
  } catch (error) {
    // Send the actual error message in development
    return res.status(500).json({
      message: "Error creating user",
      error: error.message || "Unexpected error",
    });
  }
};

//update user by uuid
const updateUserByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    const updatedData = req.body;

    if (!uuid) {
      return res.status(400).json({ message: "ID is required" });
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const result = await userService.updateUserByID(uuid, updatedData);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    // console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user", error: error.code });
  }
};

// Delete user by UUID
const deleteUserByID= async (req, res) => {
  try {
    const { uuid } = req.params;
    const result = await userService.deleteUserByID(uuid);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting user", error });
  }
};
const getUsersByRole = async (req, res) => {
  const { roleId } = req.params;

  // Validate roleId
  if (!roleId || isNaN(roleId)) {
    return res.status(400).json({ message: "Invalid role ID" });
  }

  try {
    const users = await userService.getUsersByRole(roleId);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found for this role" });
    }

    res.status(200).json(users);
  } catch (error) {
    // console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getAllUsers,
  createUser,
  getUserByID,
  updateUserByUuid,
  deleteUserByID,
  getUsersByRole,
};
const userService = require("../../Services/User/user.service");
const db = require("../../Config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      ID: user.ID,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const login = async (userData) => {
  try {
    const userEmail = userData.email?.trim().toLowerCase();

    // Fetch user from database
    const user = await userService.getUserByEmail(userEmail);

    if (!user) {
      return { status: "fail", message: "User does not exist" };
    }

    if (!user.password) {
      return { status: "fail", message: "Invalid user data." };
    }

    // Check password match
    const passwordMatch = await bcrypt.compare(
      userData.password,
      user.password
    );
    if (!passwordMatch) {
      return { status: "fail", message: "Incorrect password" };
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);

    return {
      status: "success",
      message: "Login successful",
      accessToken,
    };
  } catch (error) {
    return { status: "fail", message: "An error occurred during login." };
  }
};

module.exports = { login, generateAccessToken };

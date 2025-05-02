const userService = require("../user.service.js");
const db = require("../../Config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      user_email: user.user_email,
      user_first_name: user.user_first_name,
      user_last_name: user.user_last_name,
      user_phone_number: user.user_phone_number,
      user_img: user.user_img,
      active_user_status: user.active_user_status,
      role_id: user.role_id,
      uuid: user.uuid,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};


const login = async (userData) => {
  // console.log("📩 Login Request Received:", userData);

  try {
    const userEmail = userData.user_email?.trim().toLowerCase();
    // console.log("📧 Normalized Email:", userEmail);

    // Fetch user from database
    const user = await userService.getUserByEmail(userEmail);
    // console.log("👤 User Found:", user);

    if (!user) {
      return { status: "fail", message: "User does not exist" };
    }

    if (!user.user_pass) {
      // console.error("❌ Error: User record is missing 'user_pass'");
      return { status: "fail", message: "Invalid user data." };
    }

    // Check password match
    const passwordMatch = await bcrypt.compare(
      userData.user_pass,
      user.user_pass
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
    // console.error("❌ Error during login:", error);
    return { status: "fail", message: "An error occurred during login." };
  }
};

module.exports = { login, generateAccessToken };

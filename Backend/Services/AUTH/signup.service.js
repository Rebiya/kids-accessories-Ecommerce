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

const signup = async (userData) => {
  // console.log("📩 Signup Request Received:", userData);

  try {
    const {
      user_first_name,
      user_last_name,
      user_email,
      user_pass,
      user_phone_number,
      role_id,
    } = userData;

    const normalizedEmail = user_email?.trim().toLowerCase();
    console.log("📧 Normalized Email:", normalizedEmail);

    // ✅ Check if user exists
    const userExists = await userService.checkIfUserExists(normalizedEmail);
    console.log("👤 Does user exist?", userExists);

    if (userExists) {
      console.log("🚫 User already exists, rejecting signup.");
      return { status: "fail", message: "User already exists" };
    }

    // ✅ Hash password securely
    const hashedPassword = await bcrypt.hash(user_pass, 10);

    // ✅ Insert user into database (Corrected Mapping)
    const result = await db.query(
      "INSERT INTO users (user_email, user_first_name, user_last_name, user_pass, user_phone_number, role_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        normalizedEmail, // Corrected
        user_first_name, // Corrected
        user_last_name, // Corrected
        hashedPassword,
        user_phone_number,
        role_id ?? 1,
      ]
    );

    console.log("🛠 Insert result:", result);

    if (!result || !result.insertId) {
      console.error("🚨 Database insert failed:", result);
      return { status: "fail", message: "User registration failed" };
    }

    console.log("✅ User successfully inserted with ID:", result.insertId);

    // ✅ Fetch newly created user
    const userRows = await db.query("SELECT * FROM users WHERE user_id = ?", [
      result.insertId,
    ]);

    if (!userRows || userRows.length === 0) {
      console.error("🚨 User retrieval failed after signup.");
      return { status: "fail", message: "User retrieval failed after signup." };
    }

    const newUser = userRows[0];

    // ✅ Generate tokens
    const accessToken = generateAccessToken(newUser);

    return {
      status: "success",
      message: "Signup successful",
      accessToken,
    };
  } catch (error) {
    console.error("❌ Error during signup:", error);
    return { status: "fail", message: "An error occurred during signup." };
  }
};

module.exports = { signup, generateAccessToken };
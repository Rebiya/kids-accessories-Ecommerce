const userService = require("../user.service");
const db = require("../../Config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // ✅ for UUID generation

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

const signup = async (userData) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      role_id,
    } = userData;

    const normalizedEmail = email?.trim().toLowerCase();
    console.log("📧 Normalized Email:", normalizedEmail);

    // ✅ Check if user exists
    const userExists = await userService.checkIfUserExists(normalizedEmail);
    console.log("👤 Does user exist?", userExists);

    if (userExists) {
      console.log("🚫 User already exists, rejecting signup.");
      return { status: "fail", message: "User already exists" };
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate UUID manually
    const userId = uuidv4();

    // ✅ Insert user
    const result = await db.query(
      "INSERT INTO Users (ID, email, password, role_id, phone_number, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        normalizedEmail,
        hashedPassword,
        role_id ?? 1,
        phone_number??null,
        first_name,
        last_name,
      ]
    );

    console.log("🛠 Insert result:", result);

    if (!result || result.affectedRows !== 1) {
      console.error("🚨 Database insert failed:", result);
      return { status: "fail", message: "User registration failed" };
    }

    console.log("✅ User successfully inserted with ID:", userId);

    // ✅ Fetch inserted user by ID
    const userRows = await db.query("SELECT * FROM Users WHERE ID = ?", [
      userId,
    ]);

    if (!userRows || userRows.length === 0) {
      console.error("🚨 User retrieval failed after signup.");
      return { status: "fail", message: "User retrieval failed after signup." };
    }

    const newUser = userRows[0];

    // ✅ Generate token
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

const db = require("../../Config/db.config");
const bcrypt = require("bcrypt");

const ForgotPass = async (user_email, new_password) => {
  try {
    const trimmedEmail = user_email.trim().toLowerCase();

    // Check if user exists
    const rows = await db.query("SELECT * FROM users WHERE user_email = ?", [
      trimmedEmail,
    ]);

    if (rows.length === 0) {
      return { status: "fail", message: "User not found" };
    }

    // Hash the new password securely
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update the password in the database
    const updateResult = await db.query(
      "UPDATE users SET user_pass = ? WHERE user_email = ?",
      [hashedPassword, trimmedEmail]
    );

    if (!updateResult.affectedRows) {
      return { status: "fail", message: "Password update failed" };
    }

    return { status: "success", message: "Password updated successfully" };
  } catch (error) {
    // console.error("❌ Error during password reset:", error);
    return {
      status: "fail",
      message: "An error occurred while updating password.",
    };
  }
};

module.exports = { ForgotPass };

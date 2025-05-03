const db = require("../../Config/db.config");
const bcrypt = require("bcrypt");

const ForgotPass = async (user_email, new_password) => {
  try {
    const trimmedEmail = user_email.trim().toLowerCase();

    const result = await db.query("SELECT * FROM Users WHERE email = ?", [trimmedEmail]);
    const rows = Array.isArray(result) ? result[0] || result : result;

    if (!rows || rows.length === 0) {
      return { status: "fail", message: "User not found" };
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    const update = await db.query(
      "UPDATE Users SET password = ? WHERE email = ?",
      [hashedPassword, trimmedEmail]
    );

    const updateResult = Array.isArray(update) ? update[0] || update : update;

    if (!updateResult || updateResult.affectedRows === 0) {
      return { status: "fail", message: "Password update failed" };
    }

    return { status: "success", message: "Password updated successfully" };
  } catch (error) {
    console.error("❌ Error during password reset:", error);
    return {
      status: "fail",
      message: "An error occurred while updating password.",
    };
  }
};

module.exports = { ForgotPass };

const ForgotPassService = require("../../services/AUTH/ForgotPass.service.js");

const ForgotPass = async (req, res) => {
  try {
    const { user_email, new_password } = req.body;

    if (!user_email || !new_password) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    const result = await ForgotPassService.ForgotPass(user_email, new_password);

    if (result.status === "fail") {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Forgot password error:", error);//
    
    return res
      .status(500)
      .json({ message: "Internal server error during password reset." });
  }
};

module.exports = { ForgotPass };

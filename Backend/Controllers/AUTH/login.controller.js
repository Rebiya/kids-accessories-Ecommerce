const loginService = require("../../services/AUTH/login.service.js");

const login = async (req, res) => {
  try {
    const userData = req.body;
    // console.log("📩 Login request received:", userData);

    // Fetch user details directly in the controller for debugging
    const user = await loginService.login(userData);
    // console.log("🔄 User Response from loginService:", user);

    if (user.status === "fail") {
      return res.status(403).json({ message: user.message, status: "fail" });
    }

    return res.status(200).json({
      message: "Login successful",
      status: "success",
      accessToken: user.accessToken,
      user: user.user,
    });
  } catch (error) {
    // console.error("❌ Login error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during login." });
  }
};

module.exports = { login };

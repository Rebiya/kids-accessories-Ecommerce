const logoutService = require("../../services/AUTH/logout.service.js");

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Call the logout service
    const result = await logoutService.logout(token);

    if (result.status === "fail") {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    // console.error("❌ Logout error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during logout." });
  }
};

module.exports = { logout };

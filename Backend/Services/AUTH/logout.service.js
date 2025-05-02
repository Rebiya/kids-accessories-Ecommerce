const jwt = require("jsonwebtoken");

const logout = async (token) => {
  try {
    // Verify the access token (just to ensure it's valid before "logging out")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return { status: "fail", message: "Invalid token" };
    }

    // There’s no actual way to "invalidate" a token without using a blacklist,
    // So the logout will be handled client-side by removing the token from storage.

    return { status: "success", message: "Token invalidated client-side" };
  } catch (error) {
    // console.error("❌ Error during logout:", error);
    return { status: "fail", message: "Invalid or expired token" };
  }
};

module.exports = { logout };

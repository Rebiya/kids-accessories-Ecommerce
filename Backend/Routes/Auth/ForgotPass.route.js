const express = require("express");
const router = express.Router();
const ForgotPassController = require("../../Controllers/AUTH/ForgotPass.controller");

// Create a route to handle the password reset request using PUT method
router.put("/auth/ForgotPass", ForgotPassController.ForgotPass);

module.exports = router;

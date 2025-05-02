//import the express module
const express = require("express");
//call the router method from the express to create router
const router = express.Router();
//import the logout controller
const logoutController = require("../../controllers/AUTH/logout.controller.js");
//create a route to handle the logout request on post
router.post("/auth/logout", logoutController.logout);
//export the router
module.exports = router;

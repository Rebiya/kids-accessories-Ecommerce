//import the express module
const express = require("express");
//call the router method from the express to create router
const router = express.Router();
//import the login controller
const loginController = require("../../Controllers/AUTH/signup.controller");
//create a route to handle the login request on post
router.post("/auth/register", loginController.signup);
//export the router
module.exports = router;

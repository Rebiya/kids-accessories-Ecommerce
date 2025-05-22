//import express and router
const express = require("express");
const router = express.Router();
//import the edit password controller
const EditPassController = require("../../Controllers/AUTH/editPass.controller");


// Create a route to handle the password update request using PUT method
router.put("/auth/editPass", EditPassController.EditPass);
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../Controllers/user.controller");

// Routes
router.get("/users", userController.getAllUsers);
router.get(
  "/users/:uuid",
  userController.getUserByID
);
router.put(
  "/users/:uuid",
  authMiddleware([1,2,3]),
  userController.updateUserByUuid
);
router.delete(
  "/users/:uuid",
  authMiddleware([2,3]),
  userController.deleteUserByID
);
router.get(
  "/users/role/:roleId",
  authMiddleware([2,3]),
  userController.getUsersByRole
);
router.post("/users",  authMiddleware([2,3]), userController.createUser);

module.exports = router;

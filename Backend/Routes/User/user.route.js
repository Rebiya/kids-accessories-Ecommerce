const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const userController = require("../../Controllers/User/user.controller");

// Routes
router.get("/users", authMiddleware([2, 3]), userController.getAllUsers);
router.get(
  "/users/:uuid",
  authMiddleware([2, 3]),
  userController.getUserByUuid
);
router.put(
  "/users/:uuid",
  authMiddleware([1,2,3]),
  userController.updateUserByUuid
);
router.delete(
  "/users/:uuid",
  authMiddleware([3]),
  userController.deleteUserByUuid
);
router.get(
  "/users/role/:roleId",
  authMiddleware([2,3]),
  userController.getUsersByRole
);
router.post("/users",  authMiddleware([3]), userController.createUser);

module.exports = router;

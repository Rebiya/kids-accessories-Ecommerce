const express = require("express");
const router = express.Router();
const categoryController = require("../Controllers/Category.controller");

router.get("/category", categoryController.getCategories);
router.get("/category/:id", categoryController.getCategory);
router.post("/category/", categoryController.createCategory);
router.put("/category/:id", categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);

module.exports = router;
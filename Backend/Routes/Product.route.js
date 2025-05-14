const express = require("express");
const router = express.Router();
const productController = require("../Controllers/Product.controller");

router.get("/product", productController.getProducts);
router.get("/product/:id", productController.getProduct);
router.post("/product", productController.createProduct);
router.put("/product/:id", productController.updateProduct); 
router.delete("/product/:id", productController.deleteProduct);
router.get("/products/category/:categoryName", productController.getProductByCategory);

module.exports = router;
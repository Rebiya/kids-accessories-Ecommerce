const productService = require("../Services/Product.service");

async function getProducts(req, res, next) {
  try {
    const result = await productService.getAllProducts();
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const result = await productService.getProductById(req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

//controller for getting products by category
async function getProductByCategory(req, res, next) {
  try {
    const result = await productService.getProductByCategory(req.params.categoryName);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const result = await productService.createProduct(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const result = await productService.updateProduct(req.params.id, req.body);
    console.log(result)
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByCategory
};
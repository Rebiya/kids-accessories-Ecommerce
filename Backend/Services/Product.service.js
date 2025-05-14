const { query } = require("../Config/db.config");

async function getAllProducts() {
  const sql = `
    SELECT p.*, c.category_name 
    FROM Products p
    JOIN Category c ON p.category_id = c.ID
    ORDER BY p.created_at DESC
  `;
  const products = await query(sql);
  return {
    success: products.length > 0,
    data: products,
    message: products.length > 0 
      ? 'Products retrieved successfully' 
      : 'No products found'
  };
}

async function getProductById(id) {
  const sql = `
    SELECT p.*, c.category_name 
    FROM Products p
    JOIN Category c ON p.category_id = c.ID
    WHERE p.ID = ?
  `;
  const [product] = await query(sql, [id]);
  return {
    success: !!product,
    data: product || null,
    message: product 
      ? 'Product retrieved successfully' 
      : 'Product not found'
  };
}

async function getProductByCategory(categoryName) {
  const sql = `
    SELECT p.*, c.category_name 
    FROM Products p
    JOIN Category c ON p.category_id = c.ID
    WHERE c.category_name = ?
  `;
  const products = await query(sql, [categoryName]);
  return {
    success: products.length > 0,
    data: products,
    message: products.length > 0 
      ? 'Products retrieved successfully' 
      : 'No products found in this category'
  };
}

async function createProduct(productData) {
  // Step 1: Get category_id from category_name
  const categorySql = `SELECT id FROM Category WHERE category_name = ?`;
  const categoryResult = await query(categorySql, [productData.category_name]);

  if (categoryResult.length === 0) {
    throw new Error(`Category '${productData.category_name}' does not exist.`);
  }

  const category_id = categoryResult[0].id;

  // Step 2: Insert product using the retrieved category_id
  const sql = `
    INSERT INTO Products 
    (title, description, image, price, category_id, rating_rate, rating_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;
  const params = [
    productData.title,
    productData.description,
    productData.image,
    productData.price,
    category_id,
    productData.rating_rate || 0,
    productData.rating_count || 0
  ];

  const result = await query(sql, params);

  return {
    success: true,
    message: 'Product created successfully'
  };
}


async function updateProduct(id, productData) {
  const existingProduct = await getProductById(id);
  if (!existingProduct.success) {
    return existingProduct;
  }

  const product = existingProduct.data; // <-- Extract the real product object

  const sql = `
    UPDATE Products 
    SET title = ?, description = ?, image = ?, price = ?, category_id = ?, 
        rating_rate = ?, rating_count = ?, updated_at = CURRENT_TIMESTAMP
    WHERE ID = ?
  `;

  const params = [
    productData.title ?? product.title,
    productData.description ?? product.description,
    productData.image ?? product.image,
    productData.price ?? product.price,
    productData.category_id ?? product.category_id,
    productData.rating_rate ?? product.rating_rate,
    productData.rating_count ?? product.rating_count,
    id
  ];

  await query(sql, params);
  return {
    success: true,
    message: 'Product updated successfully'
  };
}


async function deleteProduct(id) {
  const existingProduct = await getProductById(id);
  if (!existingProduct.success) {
    return existingProduct;
  }

  const sql = `DELETE FROM Products WHERE ID = ?`;
  await query(sql, [id]);
  return { 
    success: true,
    data: null,
    message: 'Product deleted successfully' 
  };
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByCategory
};
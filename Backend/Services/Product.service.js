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

async function createProduct(productData) {
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
    productData.category_id,
    productData.rating_rate || 0,
    productData.rating_count || 0
  ];
  const result = await query(sql, params);
  const newProduct = await getProductById(result.insertId);
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
console.log(existingProduct)
  const sql = `
    UPDATE Products 
    SET title = ?, description = ?, image = ?, price = ?, category_id = ?, 
        rating_rate = ?, rating_count = ?, updated_at = CURRENT_TIMESTAMP
    WHERE ID = ?
  `;
  const params = [
    productData.title??existingProduct.title,
    productData.description??existingProduct.description,
    productData.image??existingProduct.image,
    productData.price??existingProduct.price,
    productData.category_id??existingProduct.category_id,
    productData.rating_rate??existingProduct.rating_rate,
    productData.rating_count??existingProduct.rating_count,
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
  deleteProduct
};
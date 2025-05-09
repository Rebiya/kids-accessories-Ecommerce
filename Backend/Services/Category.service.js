const { query } = require("../Config/db.config");

async function getAllCategories() {
  const sql = `SELECT * FROM Category`;
  return await query(sql);
}

async function getCategoryById(id) {
  const sql = `SELECT * FROM Category WHERE ID = ?`;
  const [category] = await query(sql, [id]);
  return category;
}

async function createCategory(categoryData) {
  const sql = `INSERT INTO Category (category_name) VALUES (?)`;
  const result = await query(sql, [categoryData.category_name]);
  return getCategoryById(result.insertId);
}

async function updateCategory(id, categoryData) {
  const sql = `UPDATE Category SET category_name = ? WHERE ID = ?`;
  await query(sql, [categoryData.category_name, id]);
  return getCategoryById(id);
}

async function deleteCategory(id) {
  const sql = `DELETE FROM Category WHERE ID = ?`;
  await query(sql, [id]);
  return { message: "Category deleted successfully" };
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
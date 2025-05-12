const db = require("../Config/db.config");

async function createOrder(orderData) {
  const { product_id, user_id, stripe_payment_id } = orderData;

   // Validate input
  if (
    product_id === undefined ||
    user_id === undefined ||
    stripe_payment_id === undefined
  ) {
    throw new Error("All fields (product_id, user_id, stripe_payment_id) are required");
  }


  const sql = `INSERT INTO Orders (product_id, user_id, stripe_payment_id) VALUES (?, ?, ?)`;
  const result = await db.query(sql, [product_id, user_id, stripe_payment_id]);
  return { id: result.insertId, ...orderData };
}

async function getAllOrders() {
  const sql = `SELECT * FROM Orders`;
  return await db.query(sql);
}

async function getOrderById(id) {
  const sql = `SELECT * FROM Orders WHERE id = ?`;
  const rows = await db.query(sql, [id]);
  return rows[0];
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
};
